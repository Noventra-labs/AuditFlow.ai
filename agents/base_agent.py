# agents/base_agent.py — Shared base: Pub/Sub, Redis, Claude, Supabase, Audit
import os
import json
import time
import asyncio
from typing import Optional, Dict, Any, Callable
from datetime import datetime
from uuid import uuid4

from google import genai
from google.genai import types
from google.cloud import pubsub_v1

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.vertex_client import get_vertex_client
from shared.redis_client import RedisSessionManager
from shared.supabase_client import get_supabase
from shared.logging_utils import get_logger, log_agent_action
from shared.models import AgentTask, AgentResult, AuditLogEntry


class BaseFinanceAgent:
    """
    Base class for all FinancePilot agents. Provides:
    - Claude API client
    - Pub/Sub publisher & subscriber
    - Redis session manager
    - Supabase client
    - Audit logging to Supabase
    - Standard message processing loop
    """

    AGENT_NAME: str = "base_agent"
    SYSTEM_PROMPT: str = "You are a financial AI agent."
    SUBSCRIBE_TOPIC: str = ""
    RESULT_TOPIC: str = "finance.results"

    def __init__(self):
        self.logger = get_logger(self.AGENT_NAME)
        # Initialize Vertex AI client using Application Default Credentials
        self.claude = get_vertex_client()
        self.redis = RedisSessionManager()
        self.supabase = get_supabase()

        project_id = os.environ.get("GCP_PROJECT_ID", "")
        self.publisher = pubsub_v1.PublisherClient()
        self.project_id = project_id

    # ── LLM Call ────────────────────────────────────────────────
    async def call_claude(
        self,
        user_message: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.2,
    ) -> tuple[str, int]:
        """Call Vertex AI Gemini and return (response_text, tokens_used).

        The model is determined by VERTEX_MODEL env var (default: gemini-2.5-pro)
        but can be overridden per-call via the `model` argument.
        """
        # Resolve model: use per-call override, falls back to VERTEX_MODEL env var
        resolved_model = model or os.environ.get("VERTEX_MODEL", "gemini-2.5-pro")
        start = time.time()
        response = self.claude.models.generate_content(
            model=resolved_model,
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt or self.SYSTEM_PROMPT,
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
        )
        text = response.text
        tokens = 0
        if response.usage_metadata:
            tokens = response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count

        elapsed_ms = int((time.time() - start) * 1000)
        self.logger.info(
            f"Vertex AI call completed in {elapsed_ms}ms, {tokens} tokens",
            extra={"duration_ms": elapsed_ms, "tokens_used": tokens, "model": resolved_model},
        )
        return text, tokens

    # ── Pub/Sub ────────────────────────────────────────────────────
    def publish_message(self, topic: str, data: dict):
        """Publish a message to a Pub/Sub topic."""
        safe_topic = topic.replace(".", "-")
        topic_path = self.publisher.topic_path(self.project_id, safe_topic)
        payload = json.dumps(data, default=str).encode("utf-8")
        future = self.publisher.publish(topic_path, payload)
        self.logger.info(f"Published to {safe_topic}: {future.result()}")

    def publish_result(self, result: AgentResult):
        """Publish agent result to the results topic."""
        self.publish_message(self.RESULT_TOPIC, result.model_dump())
        self.redis.store_result(
            result.session_id, result.agent_name, result.model_dump()
        )

    # ── Audit Logging ─────────────────────────────────────────────
    def log_audit(
        self,
        company_id: str,
        session_id: str,
        action: str,
        input_summary: str = "",
        output_summary: str = "",
        tool_calls: Optional[dict] = None,
        duration_ms: int = 0,
        tokens_used: int = 0,
    ):
        """Write immutable audit log entry to Supabase."""
        entry = {
            "id": str(uuid4()),
            "company_id": company_id,
            "session_id": session_id,
            "agent_name": self.AGENT_NAME,
            "action": action,
            "input_summary": input_summary[:500],
            "output_summary": output_summary[:1000],
            "tool_calls_json": tool_calls or {},
            "duration_ms": duration_ms,
            "tokens_used": tokens_used,
            "created_at": datetime.utcnow().isoformat(),
        }
        try:
            self.supabase.table("agent_audit_log").insert(entry).execute()
        except Exception as e:
            self.logger.error(f"Failed to write audit log: {e}")

    # ── Task Processing ───────────────────────────────────────────
    async def process_task(self, task: AgentTask) -> AgentResult:
        """
        Override in subclass. Process a single agent task and return result.
        """
        raise NotImplementedError("Subclasses must implement process_task()")

    async def handle_message(self, message_data: bytes):
        """Handle incoming Pub/Sub message — parse, process, publish result."""
        start = time.time()
        data = json.loads(message_data.decode("utf-8"))
        task = AgentTask(**data)

        self.logger.info(
            f"Processing task {task.task_id} for {task.company_id}",
            extra={"task_id": task.task_id, "session_id": task.session_id},
        )

        try:
            result = await self.process_task(task)
            duration_ms = int((time.time() - start) * 1000)
            result.duration_ms = duration_ms

            # Audit log
            self.log_audit(
                company_id=task.company_id,
                session_id=task.session_id,
                action=task.action,
                input_summary=json.dumps(task.payload, default=str),
                output_summary=json.dumps(result.result, default=str),
                duration_ms=duration_ms,
                tokens_used=result.tokens_used,
            )

            # Publish result
            self.publish_result(result)
            return result

        except Exception as e:
            self.logger.error(f"Task {task.task_id} failed: {e}", exc_info=True)
            error_result = AgentResult(
                task_id=task.task_id,
                session_id=task.session_id,
                agent_name=self.AGENT_NAME,
                status="error",
                error=str(e),
                duration_ms=int((time.time() - start) * 1000),
            )
            self.publish_result(error_result)
            return error_result

    def start_subscriber(self):
        """Start Pub/Sub subscriber loop (blocking)."""
        if not self.SUBSCRIBE_TOPIC:
            raise ValueError("SUBSCRIBE_TOPIC not set")

        import threading
        from http.server import HTTPServer, BaseHTTPRequestHandler

        class HealthCheckHandler(BaseHTTPRequestHandler):
            def do_GET(handler_self):
                handler_self.send_response(200)
                handler_self.end_headers()
                handler_self.wfile.write(b"OK\n")
            def log_message(self, format, *args):
                pass  # Suppress health check logging

        def serve_health():
            port = int(os.environ.get("PORT", 8080))
            try:
                server = HTTPServer(("0.0.0.0", port), HealthCheckHandler)
                server.serve_forever()
            except Exception as e:
                self.logger.error(f"Failed to start health check server: {e}")

        threading.Thread(target=serve_health, daemon=True).start()
        self.logger.info("Started dummy HTTP server to satisfy Cloud Run health checks.")

        subscriber = pubsub_v1.SubscriberClient()
        safe_sub = self.SUBSCRIBE_TOPIC.replace(".", "-")
        subscription_path = subscriber.subscription_path(
            self.project_id, f"{safe_sub}-sub"
        )

        def callback(message):
            message.ack()
            asyncio.run(self.handle_message(message.data))

        streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
        self.logger.info(f"Listening on {subscription_path}...")

        try:
            streaming_pull_future.result()
        except KeyboardInterrupt:
            streaming_pull_future.cancel()
            streaming_pull_future.result()
