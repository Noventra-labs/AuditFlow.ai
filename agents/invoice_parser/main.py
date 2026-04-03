# agents/invoice_parser/main.py — Invoice Parser Agent entry point
import os
import json
import asyncio
from uuid import uuid4
from datetime import datetime

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.base_agent import BaseFinanceAgent
from agents.invoice_parser.parser import (
    extract_invoice_from_text,
    extract_invoice_from_pdf_url,
    extract_invoice_from_image,
)
from agents.invoice_parser.gmail_mcp import GmailMCPClient
from shared.models import AgentTask, AgentResult


class InvoiceParserAgent(BaseFinanceAgent):
    AGENT_NAME = "invoice_parser_agent"
    SUBSCRIBE_TOPIC = "finance.invoice"
    SYSTEM_PROMPT = "You are FinancePilot Invoice Parser Agent."

    def __init__(self):
        super().__init__()
        self.gmail = GmailMCPClient()

    async def process_task(self, task: AgentTask) -> AgentResult:
        """Process invoice parsing task."""
        payload = task.payload
        total_tokens = 0

        # Determine source and extract invoice data
        source = payload.get("source", "upload")
        parsed_data = {}

        if source == "gmail":
            # Fetch from Gmail MCP
            message_id = payload.get("message_id")
            if message_id:
                attachment_id = payload.get("attachment_id")
                if attachment_id:
                    attachment = await self.gmail.get_attachment(message_id, attachment_id)
                    import base64
                    file_bytes = base64.b64decode(attachment.get("data", ""))
                    parsed_data, tokens = await extract_invoice_from_image(
                        self.claude, file_bytes, "application/pdf"
                    )
                    total_tokens += tokens
                await self.gmail.mark_read(message_id)
            else:
                # Scan for new invoice emails
                emails = await self.gmail.fetch_emails(
                    query="has:attachment filename:pdf subject:invoice",
                    max_results=5,
                )
                if emails:
                    # Process first unread invoice email
                    email = emails[0]
                    parsed_data, tokens = await extract_invoice_from_text(
                        self.claude, json.dumps(email)
                    )
                    total_tokens += tokens

        elif source == "upload" or payload.get("file_url"):
            file_url = payload.get("file_url", "")
            if file_url:
                parsed_data, tokens = await extract_invoice_from_pdf_url(
                    self.claude, file_url
                )
                total_tokens += tokens
            else:
                text_content = payload.get("text_content", payload.get("message", ""))
                parsed_data, tokens = await extract_invoice_from_text(
                    self.claude, text_content
                )
                total_tokens += tokens

        # Validate against known vendors in Supabase
        vendor_name = parsed_data.get("vendor_name")
        vendor_match = None
        if vendor_name:
            try:
                resp = self.supabase.table("vendors").select("*").eq(
                    "company_id", task.company_id
                ).ilike("name", f"%{vendor_name}%").execute()
                if resp.data:
                    vendor_match = resp.data[0]
                    parsed_data["vendor_id"] = vendor_match["id"]
                    parsed_data["vendor_verified"] = True
            except Exception as e:
                self.logger.warning(f"Vendor lookup failed: {e}")

        # Write structured invoice to Supabase
        invoice_id = payload.get("invoice_id", str(uuid4()))
        invoice_record = {
            "id": invoice_id,
            "company_id": task.company_id,
            "vendor_id": parsed_data.get("vendor_id"),
            "invoice_number": parsed_data.get("invoice_number"),
            "issue_date": parsed_data.get("issue_date"),
            "due_date": parsed_data.get("due_date"),
            "subtotal": parsed_data.get("subtotal", 0),
            "tax_amount": parsed_data.get("tax_amount", 0),
            "total": parsed_data.get("total", 0),
            "currency": parsed_data.get("currency", "SGD"),
            "status": "parsed",
            "pdf_url": payload.get("file_url"),
            "raw_json": parsed_data,
            "parsed_by_agent": self.AGENT_NAME,
        }

        try:
            self.supabase.table("invoices").upsert(invoice_record).execute()
            self.logger.info(f"Invoice {invoice_id} saved to Supabase")
        except Exception as e:
            self.logger.error(f"Failed to save invoice: {e}")

        # Trigger downstream agents via result
        return AgentResult(
            task_id=task.task_id,
            session_id=task.session_id,
            agent_name=self.AGENT_NAME,
            status="success",
            result={
                "invoice_id": invoice_id,
                "parsed_data": parsed_data,
                "vendor_match": vendor_match,
                "source": source,
            },
            tokens_used=total_tokens,
        )


# Entry point
if __name__ == "__main__":
    agent = InvoiceParserAgent()
    agent.start_subscriber()
