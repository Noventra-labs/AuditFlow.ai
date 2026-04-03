# orchestrator/decomposer.py — Financial task decomposition with Claude
import json
from uuid import uuid4
from typing import Dict, Any

from google import genai
from google.genai import types

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.models import AgentTask, FinancialPlan
from orchestrator.prompts import ORCHESTRATOR_SYSTEM_PROMPT


async def decompose_financial_task(
    client: genai.Client,
    message: str,
    company_id: str,
    session_id: str,
    context: Dict[str, Any] = None,
) -> FinancialPlan:
    """
    Use Claude to analyze the financial intent and decompose
    into subtasks mapped to specific finance agents.
    """
    context_str = ""
    if context:
        context_str = f"\n\nCompany context:\n{json.dumps(context, default=str, indent=2)}"

    user_prompt = f"""Financial request from company {company_id}:
\"{message}\"{context_str}

Analyze this request and return a JSON task plan decomposing it into subtasks
for the available finance agents. Consider which agents can run in parallel
and which have data dependencies."""

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=ORCHESTRATOR_SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=2048,
        )
    )

    # Parse the JSON plan from Gemini's response
    response_text = response.text
    try:
        # Extract JSON from response (may be wrapped in markdown)
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1
        plan_data = json.loads(response_text[json_start:json_end])
    except (json.JSONDecodeError, ValueError):
        # Fallback: create a simple plan
        plan_data = {
            "intent": message,
            "subtasks": [
                {
                    "agent_name": "invoice_parser_agent",
                    "action": "process_request",
                    "payload": {"message": message},
                    "priority": 1,
                }
            ],
        }

    # Build typed subtasks
    subtasks = []
    for st in plan_data.get("subtasks", []):
        subtasks.append(
            AgentTask(
                task_id=str(uuid4()),
                session_id=session_id,
                company_id=company_id,
                agent_name=st["agent_name"],
                action=st.get("action", "process"),
                payload=st.get("payload", {}),
                priority=st.get("priority", 1),
            )
        )

    return FinancialPlan(
        session_id=session_id,
        intent=plan_data.get("intent", message),
        subtasks=subtasks,
    )
