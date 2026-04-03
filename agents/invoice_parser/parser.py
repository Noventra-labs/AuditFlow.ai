# agents/invoice_parser/parser.py — Claude vision extraction logic
import json
import base64
from typing import Dict, Any, Optional, Tuple

from google import genai
from google.genai import types

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.invoice_parser.prompts import INVOICE_PARSER_SYSTEM_PROMPT
from shared.logging_utils import get_logger

logger = get_logger("invoice_parser.parser")


async def extract_invoice_from_text(
    client: genai.Client, text_content: str
) -> Tuple[Dict[str, Any], int]:
    """Extract structured invoice data from text content using Claude."""
    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=f"Extract all invoice data from this document:\n\n{text_content}",
        config=types.GenerateContentConfig(
            system_instruction=INVOICE_PARSER_SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=4096,
        )
    )
    text = response.text
    tokens = 0
    if response.usage_metadata:
        tokens = response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count

    # Parse JSON from response
    try:
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        parsed = json.loads(text[json_start:json_end])
    except (json.JSONDecodeError, ValueError):
        parsed = {"error": "Failed to parse invoice", "raw": text}

    return parsed, tokens


async def extract_invoice_from_image(
    client: genai.Client, image_data: bytes, media_type: str = "image/png"
) -> Tuple[Dict[str, Any], int]:
    """Extract structured invoice data from an image using Gemini vision."""
    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=[
            types.Part.from_bytes(data=image_data, mime_type=media_type),
            "Extract all invoice data from this document image."
        ],
        config=types.GenerateContentConfig(
            system_instruction=INVOICE_PARSER_SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=4096,
        )
    )
    text = response.text
    tokens = 0
    if response.usage_metadata:
        tokens = response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count

    try:
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        parsed = json.loads(text[json_start:json_end])
    except (json.JSONDecodeError, ValueError):
        parsed = {"error": "Failed to parse invoice image", "raw": text}

    return parsed, tokens


async def extract_invoice_from_pdf_url(
    client: genai.Client, pdf_url: str
) -> Tuple[Dict[str, Any], int]:
    """Download PDF and extract invoice data using Gemini document understanding."""
    import httpx

    async with httpx.AsyncClient(timeout=60) as http:
        resp = await http.get(pdf_url)
        resp.raise_for_status()
        pdf_bytes = resp.content

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=[
            types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
            "Extract all invoice data from this PDF document."
        ],
        config=types.GenerateContentConfig(
            system_instruction=INVOICE_PARSER_SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=4096,
        )
    )
    text = response.text
    tokens = 0
    if response.usage_metadata:
        tokens = response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count

    try:
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        parsed = json.loads(text[json_start:json_end])
    except (json.JSONDecodeError, ValueError):
        parsed = {"error": "Failed to parse PDF invoice", "raw": text}

    return parsed, tokens
