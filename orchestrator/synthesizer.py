# orchestrator/synthesizer.py — Multi-agent result synthesis with Claude
import json
from typing import Dict, Any

from google import genai
from google.genai import types

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from orchestrator.prompts import SYNTHESIZER_SYSTEM_PROMPT


async def synthesize_financial_response(
    client: genai.Client,
    original_request: str,
    agent_results: Dict[str, Any],
    company_context: Dict[str, Any] = None,
) -> Dict[str, Any]:
    """
    Take collected results from all agents and produce a clean
    financial summary with action items using Claude.
    """
    results_text = json.dumps(agent_results, default=str, indent=2)
    context_text = ""
    if company_context:
        context_text = f"\nCompany context: {json.dumps(company_context, default=str)}"

    user_prompt = f"""Original request: "{original_request}"
{context_text}

Agent results collected:
{results_text}

Synthesize these results into a clear, actionable financial summary.
Include specific numbers, dates, and any items requiring human attention."""

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYNTHESIZER_SYSTEM_PROMPT,
            temperature=0.3,
            max_output_tokens=4096,
        )
    )

    summary_text = response.text
    tokens_used = 0
    if response.usage_metadata:
        tokens_used = response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count

    # Extract action items if present
    action_items = []
    for line in summary_text.split("\n"):
        stripped = line.strip()
        if stripped.startswith("⚠️") or stripped.startswith("- ["):
            action_items.append(stripped)

    return {
        "summary": summary_text,
        "action_items": action_items,
        "agents_involved": list(agent_results.keys()),
        "tokens_used": tokens_used,
    }
