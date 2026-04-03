# agents/invoice_parser/gmail_mcp.py — Gmail MCP client wrapper
import os
import json
import httpx
from typing import Optional, List, Dict, Any

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from shared.logging_utils import get_logger

logger = get_logger("gmail_mcp")


class GmailMCPClient:
    """
    Wrapper for Gmail MCP server interactions.
    Handles: fetch_emails, get_attachment, send_email, mark_read, create_draft
    """

    def __init__(self):
        self.mcp_endpoint = os.environ.get("GMAIL_MCP_ENDPOINT", "http://localhost:3001")

    async def fetch_emails(
        self,
        query: str = "has:attachment filename:pdf",
        max_results: int = 10,
        unread_only: bool = True,
    ) -> List[Dict[str, Any]]:
        """Fetch emails matching query via Gmail MCP."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/fetch_emails",
                json={
                    "query": query,
                    "max_results": max_results,
                    "unread_only": unread_only,
                },
            )
            response.raise_for_status()
            return response.json().get("emails", [])

    async def get_attachment(
        self, message_id: str, attachment_id: str
    ) -> Dict[str, Any]:
        """Download email attachment via Gmail MCP."""
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/get_attachment",
                json={
                    "message_id": message_id,
                    "attachment_id": attachment_id,
                },
            )
            response.raise_for_status()
            return response.json()

    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        html: bool = True,
        cc: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send email via Gmail MCP."""
        async with httpx.AsyncClient(timeout=30) as client:
            payload = {
                "to": to,
                "subject": subject,
                "body": body,
                "html": html,
            }
            if cc:
                payload["cc"] = cc
            response = await client.post(
                f"{self.mcp_endpoint}/tools/send_email",
                json=payload,
            )
            response.raise_for_status()
            return response.json()

    async def mark_read(self, message_id: str) -> bool:
        """Mark email as read via Gmail MCP."""
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/mark_read",
                json={"message_id": message_id},
            )
            return response.status_code == 200

    async def create_draft(
        self, to: str, subject: str, body: str
    ) -> Dict[str, Any]:
        """Create email draft via Gmail MCP."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/create_draft",
                json={"to": to, "subject": subject, "body": body},
            )
            response.raise_for_status()
            return response.json()
