# agents/report/main.py — Report Agent
import os
import json
from uuid import uuid4
from datetime import datetime, timedelta

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.base_agent import BaseFinanceAgent
from agents.report.generator import generate_pnl, generate_balance_snapshot
from agents.report.templates import board_report_template, daily_digest_template
from agents.invoice_parser.gmail_mcp import GmailMCPClient
from shared.models import AgentTask, AgentResult


class ReportAgent(BaseFinanceAgent):
    AGENT_NAME = "report_agent"
    SUBSCRIBE_TOPIC = "finance.report"
    SYSTEM_PROMPT = "You are FinancePilot Report Agent."

    def __init__(self):
        super().__init__()
        self.gmail = GmailMCPClient()

    async def process_task(self, task: AgentTask) -> AgentResult:
        """Generate financial reports and email via Gmail MCP."""
        payload = task.payload
        report_type = payload.get("report_type", "monthly")
        total_tokens = 0

        # Determine period
        today = datetime.utcnow().date()
        if report_type == "daily":
            period_start = today.isoformat()
            period_end = today.isoformat()
        elif report_type == "weekly":
            period_start = (today - timedelta(days=7)).isoformat()
            period_end = today.isoformat()
        else:  # monthly
            period_start = today.replace(day=1).isoformat()
            period_end = today.isoformat()

        # Fetch transactions and invoices
        txn_resp = self.supabase.table("bank_transactions").select("*").eq(
            "company_id", task.company_id
        ).gte("date", period_start).lte("date", period_end).execute()
        transactions = txn_resp.data or []

        inv_resp = self.supabase.table("invoices").select("*").eq(
            "company_id", task.company_id
        ).gte("created_at", period_start).execute()
        invoices = inv_resp.data or []

        # Get company info
        company_resp = self.supabase.table("companies").select("*").eq("id", task.company_id).execute()
        company = company_resp.data[0] if company_resp.data else {}
        currency = company.get("currency", "SGD")

        # Generate P&L
        pnl = generate_pnl(transactions, invoices, period_start, period_end, currency)

        # Get forecast for runway
        forecast_resp = self.supabase.table("forecasts").select("*").eq(
            "company_id", task.company_id
        ).order("generated_at", desc=True).limit(1).execute()
        forecast = forecast_resp.data[0] if forecast_resp.data else {}

        # Get top vendors
        vendor_totals = {}
        for inv in invoices:
            v_id = inv.get("vendor_id", "unknown")
            vendor_totals[v_id] = vendor_totals.get(v_id, 0) + float(inv.get("total", 0))
        top_vendor_ids = sorted(vendor_totals.keys(), key=lambda k: -vendor_totals[k])[:5]

        top_vendors = []
        for v_id in top_vendor_ids:
            v_resp = self.supabase.table("vendors").select("name").eq("id", v_id).execute()
            name = v_resp.data[0]["name"] if v_resp.data else v_id
            top_vendors.append({"name": name, "amount": vendor_totals[v_id], "status": "Active"})

        # Generate narrative with Claude
        narrative_prompt = f"""Write a brief executive summary for this {report_type} financial report:
- Revenue: {currency} {pnl['revenue']:,.2f}
- Net Profit: {currency} {pnl['net_profit']:,.2f} ({pnl['net_margin']}% margin)
- New invoices: {len(invoices)}
- Cash runway: {forecast.get('base_runway', 'N/A')} months
- Top expense categories: {json.dumps(dict(list(pnl['expense_breakdown'].items())[:3]))}

Keep it to 2-3 sentences. Focus on actionable insights for an SME owner."""

        narrative, tokens = await self.call_claude(narrative_prompt)
        total_tokens += tokens

        # Build email
        report_data = {
            "company_name": company.get("name", "Company"),
            "period": f"{period_start} to {period_end}",
            "executive_summary": narrative,
            "currency": currency,
            "revenue": pnl["revenue"],
            "net_profit": pnl["net_profit"],
            "revenue_change": "+N/A",
            "profit_change": "+N/A",
            "cash_balance": forecast.get("current_cash", 0),
            "runway_months": forecast.get("base_runway", "N/A"),
            "top_vendors": top_vendors,
            "forecast_summary": f"Conservative: {forecast.get('conservative_runway', 'N/A')}mo, Base: {forecast.get('base_runway', 'N/A')}mo, Optimistic: {forecast.get('optimistic_runway', 'N/A')}mo",
            "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        }

        if report_type == "daily":
            html = daily_digest_template({
                "date": today.strftime("%A, %B %d, %Y"),
                "new_invoices": len(invoices),
                "reconciled": sum(1 for i in invoices if i.get("status") == "reconciled"),
                "pending_review": sum(1 for i in invoices if i.get("status") == "manual_review"),
                "active_alerts": 0,
            })
        else:
            html = board_report_template(report_data)

        # Send via Gmail MCP
        recipients = payload.get("recipients", company.get("stakeholder_emails", ["cfo@company.com"]))
        subject = f"FinancePilot {report_type.title()} Report - {company.get('name', '')} - {today.strftime('%B %Y')}"

        try:
            if isinstance(recipients, list):
                recipients = ", ".join(recipients)
            await self.gmail.send_email(to=recipients, subject=subject, body=html, html=True)
            self.logger.info(f"Report sent to {recipients}")
        except Exception as e:
            self.logger.error(f"Failed to send report email: {e}")

        # Save to report history
        history = {
            "id": str(uuid4()),
            "company_id": task.company_id,
            "report_type": report_type,
            "period": f"{period_start} to {period_end}",
            "recipient_emails": [recipients] if isinstance(recipients, str) else recipients,
            "subject": subject,
            "sent_at": datetime.utcnow().isoformat(),
        }
        try:
            self.supabase.table("report_history").insert(history).execute()
        except Exception as e:
            self.logger.error(f"Failed to save report history: {e}")

        return AgentResult(
            task_id=task.task_id,
            session_id=task.session_id,
            agent_name=self.AGENT_NAME,
            status="success",
            result={
                "report_type": report_type,
                "pnl": pnl,
                "recipients": recipients,
                "subject": subject,
                "narrative": narrative,
            },
            tokens_used=total_tokens,
        )


if __name__ == "__main__":
    agent = ReportAgent()
    agent.start_subscriber()
