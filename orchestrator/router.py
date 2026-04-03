# orchestrator/router.py — Agent routing by task type via Pub/Sub
import json
import os
from google.cloud import pubsub_v1

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.models import AgentTask
from shared.logging_utils import get_logger

logger = get_logger("orchestrator.router")

# Agent name → Pub/Sub topic mapping
AGENT_TOPIC_MAP = {
    "invoice_parser_agent": "finance.invoice",
    "reconciliation_agent": "finance.reconcile",
    "tax_compliance_agent": "finance.tax",
    "forecast_agent": "finance.forecast",
    "report_agent": "finance.report",
    "alert_agent": "finance.alert",
}

_publisher = None


def _get_publisher() -> pubsub_v1.PublisherClient:
    global _publisher
    if _publisher is None:
        _publisher = pubsub_v1.PublisherClient()
    return _publisher


async def publish_to_agent(task: AgentTask, project_id: str = None):
    """Publish a task to the correct Pub/Sub topic for the target agent."""
    project_id = project_id or os.environ.get("GCP_PROJECT_ID", "")
    topic_name = AGENT_TOPIC_MAP.get(task.agent_name)

    if not topic_name:
        logger.error(f"Unknown agent: {task.agent_name}")
        raise ValueError(f"No topic mapping for agent: {task.agent_name}")

    publisher = _get_publisher()
    topic_path = publisher.topic_path(project_id, topic_name)
    payload = json.dumps(task.model_dump(), default=str).encode("utf-8")

    future = publisher.publish(
        topic_path,
        payload,
        agent_name=task.agent_name,
        session_id=task.session_id,
        priority=str(task.priority),
    )
    message_id = future.result()
    logger.info(
        f"Dispatched task {task.task_id} to {topic_name} (msg: {message_id})",
        extra={"task_id": task.task_id, "session_id": task.session_id},
    )
    return message_id


async def dispatch_all(tasks: list[AgentTask], project_id: str = None):
    """Dispatch all subtasks in parallel."""
    import asyncio

    dispatches = [publish_to_agent(task, project_id) for task in tasks]
    results = await asyncio.gather(*dispatches, return_exceptions=True)

    success_count = sum(1 for r in results if not isinstance(r, Exception))
    logger.info(f"Dispatched {success_count}/{len(tasks)} tasks successfully")
    return results
