# agents/reconciliation/supabase_mcp.py — Supabase MCP client wrapper
import os
import json
import httpx
from typing import Optional, List, Dict, Any

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from shared.logging_utils import get_logger

logger = get_logger("supabase_mcp")


class SupabaseMCPClient:
    """
    Wrapper for Supabase MCP server interactions.
    Handles: query_database, insert_record, update_record, run_analytics
    """

    def __init__(self):
        self.mcp_endpoint = os.environ.get("SUPABASE_MCP_ENDPOINT", "http://localhost:3002")

    async def query_database(
        self, table: str, filters: Dict[str, Any] = None, limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Query a Supabase table via MCP."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/query_database",
                json={"table": table, "filters": filters or {}, "limit": limit},
            )
            response.raise_for_status()
            return response.json().get("data", [])

    async def insert_record(
        self, table: str, record: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Insert a record via Supabase MCP."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/insert_record",
                json={"table": table, "record": record},
            )
            response.raise_for_status()
            return response.json()

    async def update_record(
        self, table: str, record_id: str, updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update a record via Supabase MCP."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/update_record",
                json={"table": table, "id": record_id, "updates": updates},
            )
            response.raise_for_status()
            return response.json()

    async def run_analytics(
        self, query: str, params: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Run an analytics query via Supabase MCP."""
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.mcp_endpoint}/tools/run_analytics",
                json={"query": query, "params": params or {}},
            )
            response.raise_for_status()
            return response.json().get("data", [])
