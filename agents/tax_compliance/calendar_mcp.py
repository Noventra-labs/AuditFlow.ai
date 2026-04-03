# agents/tax_compliance/calendar_mcp.py — Calendar MCP deadline creation
import os
import httpx
from typing import Optional, Dict, Any, List

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from shared.logging_utils import get_logger

logger = get_logger("calendar_mcp")


class CalendarMCPClient:
    """Wrapper for Google Calendar MCP server."""

    def __init__(self):
        self.mcp_endpoint = os.environ.get("CALENDAR_MCP_ENDPOINT", "http://localhost:3003")

    async def create_event(
        self,
        summary: str,
        description: str,
        start_date: str,
        end_date: Optional[str] = None,
        reminders: Optional[List[int]] = None,
    ) -> Dict[str, Any]:
        """Create a calendar event for tax deadlines, payment dates, etc."""
        async with httpx.AsyncClient(timeout=15) as client:
            payload = {
                "summary": summary,
                "description": description,
                "start": {"date": start_date},
                "end": {"date": end_date or start_date},
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "email", "minutes": d * 24 * 60}
                        for d in (reminders or [14, 7, 1])
                    ],
                },
            }
            response = await client.post(
                f"{self.mcp_endpoint}/tools/create_event",
                json=payload,
            )
            response.raise_for_status()
            return response.json()

    async def list_events(
        self, time_min: str, time_max: str, query: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List upcoming calendar events."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/list_events",
                json={"time_min": time_min, "time_max": time_max, "query": query},
            )
            response.raise_for_status()
            return response.json().get("events", [])

    async def update_event(
        self, event_id: str, updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing calendar event."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/update_event",
                json={"event_id": event_id, "updates": updates},
            )
            response.raise_for_status()
            return response.json()
