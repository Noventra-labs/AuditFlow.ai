# agents/tax_compliance/main.py — Tax Compliance Agent
import os
import json
from uuid import uuid4
from datetime import datetime, date

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.base_agent import BaseFinanceAgent
from agents.tax_compliance.jurisdictions import get_jurisdiction, calculate_tax, JURISDICTIONS
from agents.tax_compliance.calendar_mcp import CalendarMCPClient
from shared.models import AgentTask, AgentResult


class TaxComplianceAgent(BaseFinanceAgent):
    AGENT_NAME = "tax_compliance_agent"
    SUBSCRIBE_TOPIC = "finance.tax"
    SYSTEM_PROMPT = "You are FinancePilot Tax Compliance Agent."

    def __init__(self):
        super().__init__()
        self.calendar = CalendarMCPClient()

    async def process_task(self, task: AgentTask) -> AgentResult:
        """Check tax compliance, calculate obligations, create Calendar deadlines."""
        payload = task.payload
        total_tokens = 0

        # Get company jurisdiction
        company_resp = self.supabase.table("companies").select("*").eq("id", task.company_id).execute()
        company = company_resp.data[0] if company_resp.data else {}
        jurisdiction_code = company.get("jurisdiction", payload.get("jurisdiction", "SG"))
        jurisdiction = get_jurisdiction(jurisdiction_code)

        # Get invoice/transaction details
        invoice_id = payload.get("invoice_id")
        invoice = None
        if invoice_id:
            inv_resp = self.supabase.table("invoices").select("*").eq("id", invoice_id).execute()
            if inv_resp.data:
                invoice = inv_resp.data[0]

        # Search web for current tax rates (via Claude for reasoning)
        web_search_context = ""
        try:
            search_prompt = f"What is the current {jurisdiction.tax_name if jurisdiction else 'GST/VAT'} rate in {jurisdiction.name if jurisdiction else jurisdiction_code}? Include any recent rate changes in 2024-2025."
            web_result, tokens = await self.call_claude(
                search_prompt,
                system_prompt="You are a tax research assistant. Provide current tax rates for SE Asian jurisdictions. Be specific with rates and effective dates.",
            )
            web_search_context = web_result
            total_tokens += tokens
        except Exception as e:
            self.logger.warning(f"Web search for tax rates failed: {e}")

        # Calculate tax
        tax_calc = {}
        if invoice and jurisdiction:
            subtotal = float(invoice.get("subtotal", 0))
            tax_calc = calculate_tax(subtotal, jurisdiction_code)

            # Check if vendor is GST-registered
            vendor_id = invoice.get("vendor_id")
            vendor_gst = False
            if vendor_id:
                v_resp = self.supabase.table("vendors").select("gst_registered").eq("id", vendor_id).execute()
                if v_resp.data:
                    vendor_gst = v_resp.data[0].get("gst_registered", False)

            tax_calc["vendor_gst_registered"] = vendor_gst
            tax_calc["input_credit_eligible"] = vendor_gst

        # Calculate cumulative tax liability for current period
        today = date.today()
        if jurisdiction:
            deadline = jurisdiction.get_next_filing_deadline(today)
            # Quarter start
            q_start_month = ((today.month - 1) // 3) * 3 + 1
            period_start = date(today.year, q_start_month, 1).isoformat()
            period_end = today.isoformat()

            cumulative_resp = self.supabase.table("tax_records").select("tax_amount,input_credit").eq(
                "company_id", task.company_id
            ).eq("jurisdiction", jurisdiction_code).gte(
                "period_start", period_start
            ).execute()

            total_tax = sum(float(r.get("tax_amount", 0)) for r in (cumulative_resp.data or []))
            total_credits = sum(float(r.get("input_credit", 0)) for r in (cumulative_resp.data or []))
            net_payable = total_tax - total_credits

            # Add current invoice
            if tax_calc:
                total_tax += tax_calc.get("tax_amount", 0)
                if tax_calc.get("input_credit_eligible"):
                    total_credits += tax_calc.get("tax_amount", 0)
                net_payable = total_tax - total_credits

            # Check if Calendar deadline exists
            calendar_event_id = None
            try:
                events = await self.calendar.list_events(
                    time_min=today.isoformat(),
                    time_max=deadline.isoformat(),
                    query=f"{jurisdiction.tax_name} Filing",
                )
                if not events:
                    # Create Calendar event
                    event = await self.calendar.create_event(
                        summary=f"{jurisdiction.tax_name} Filing Deadline - {jurisdiction.name}",
                        description=f"Tax filing deadline for {jurisdiction.name}.\n"
                                    f"Estimated net payable: {jurisdiction.currency} {net_payable:,.2f}\n"
                                    f"Period: {period_start} to {deadline.isoformat()}",
                        start_date=deadline.isoformat(),
                        reminders=[14, 7, 1],
                    )
                    calendar_event_id = event.get("id")
                    self.logger.info(f"Created Calendar event: {calendar_event_id}")
                else:
                    calendar_event_id = events[0].get("id")
            except Exception as e:
                self.logger.warning(f"Calendar MCP interaction failed: {e}")

            # Write tax record to Supabase
            tax_record = {
                "id": str(uuid4()),
                "company_id": task.company_id,
                "period_start": period_start,
                "period_end": deadline.isoformat(),
                "jurisdiction": jurisdiction_code,
                "tax_type": jurisdiction.tax_name,
                "gross_amount": tax_calc.get("gross_amount", 0),
                "tax_rate": jurisdiction.standard_rate,
                "tax_amount": tax_calc.get("tax_amount", 0),
                "input_credit": tax_calc.get("tax_amount", 0) if tax_calc.get("input_credit_eligible") else 0,
                "net_payable": net_payable,
                "filing_deadline": deadline.isoformat(),
                "status": "pending",
            }
            try:
                self.supabase.table("tax_records").insert(tax_record).execute()
            except Exception as e:
                self.logger.error(f"Failed to write tax record: {e}")

            # Check threshold
            threshold_warning = None
            annual_revenue_resp = self.supabase.table("invoices").select("total").eq(
                "company_id", task.company_id
            ).gte("created_at", f"{today.year}-01-01").execute()
            annual_revenue = sum(float(r.get("total", 0)) for r in (annual_revenue_resp.data or []))
            if annual_revenue > jurisdiction.registration_threshold * 0.8:
                threshold_warning = (
                    f"WARNING: Annual revenue ({jurisdiction.currency} {annual_revenue:,.2f}) approaching "
                    f"{jurisdiction.tax_name} registration threshold "
                    f"({jurisdiction.currency} {jurisdiction.registration_threshold:,.2f})"
                )
        else:
            deadline = None
            net_payable = 0
            total_tax = 0
            total_credits = 0
            calendar_event_id = None
            threshold_warning = None

        return AgentResult(
            task_id=task.task_id,
            session_id=task.session_id,
            agent_name=self.AGENT_NAME,
            status="success",
            result={
                "jurisdiction": jurisdiction_code,
                "tax_calculation": tax_calc,
                "cumulative": {
                    "total_tax": total_tax,
                    "total_credits": total_credits,
                    "net_payable": net_payable,
                },
                "filing_deadline": deadline.isoformat() if deadline else None,
                "calendar_event_id": calendar_event_id,
                "threshold_warning": threshold_warning,
                "web_search_context": web_search_context[:500],
            },
            tokens_used=total_tokens,
        )


if __name__ == "__main__":
    agent = TaxComplianceAgent()
    agent.start_subscriber()
