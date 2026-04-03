# agents/forecast/main.py — Forecast Agent
import os
import json
from uuid import uuid4
from datetime import datetime, timedelta

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.base_agent import BaseFinanceAgent
from agents.forecast.scenarios import build_three_scenario_forecast
from shared.models import AgentTask, AgentResult


class ForecastAgent(BaseFinanceAgent):
    AGENT_NAME = "forecast_agent"
    SUBSCRIBE_TOPIC = "finance.forecast"
    SYSTEM_PROMPT = "You are FinancePilot Forecast Agent."

    async def process_task(self, task: AgentTask) -> AgentResult:
        """Build cash flow forecast with 3 scenarios."""
        payload = task.payload
        horizon = payload.get("horizon_days", 90)

        # Fetch last 90 days of transactions
        date_from = (datetime.utcnow() - timedelta(days=90)).strftime("%Y-%m-%d")
        txn_resp = self.supabase.table("bank_transactions").select("*").eq(
            "company_id", task.company_id
        ).gte("date", date_from).execute()
        transactions = txn_resp.data or []

        # Fetch outstanding invoices (receivables)
        inv_resp = self.supabase.table("invoices").select("*").eq(
            "company_id", task.company_id
        ).neq("status", "reconciled").execute()
        invoices = inv_resp.data or []

        # Get current cash balance (latest transaction balance or estimate)
        current_cash = 0
        if transactions:
            sorted_txns = sorted(transactions, key=lambda t: t.get("date", ""), reverse=True)
            current_cash = float(sorted_txns[0].get("balance", 0))

        # Estimate monthly revenue from recent payments
        revenue_txns = [t for t in transactions if float(t.get("amount", 0)) > 0]
        monthly_revenue = sum(float(t.get("amount", 0)) for t in revenue_txns) / 3 if revenue_txns else 0

        # Build forecast
        forecast = build_three_scenario_forecast(
            invoices=invoices,
            transactions=transactions,
            current_cash=current_cash,
            monthly_revenue=monthly_revenue,
            horizon_days=horizon,
        )

        # Cache in Redis
        self.redis.cache_forecast(task.company_id, forecast)

        # Write to Supabase
        forecast_record = {
            "id": str(uuid4()),
            "company_id": task.company_id,
            "generated_at": datetime.utcnow().isoformat(),
            "horizon_days": horizon,
            "conservative_runway": forecast["scenarios"]["conservative"]["runway_months"],
            "base_runway": forecast["scenarios"]["base"]["runway_months"],
            "optimistic_runway": forecast["scenarios"]["optimistic"]["runway_months"],
            "ar_aging_json": forecast["ar_aging"],
            "ap_schedule_json": forecast["ap_schedule"],
            "assumptions_json": forecast["assumptions"],
        }
        try:
            self.supabase.table("forecasts").insert(forecast_record).execute()
        except Exception as e:
            self.logger.error(f"Failed to save forecast: {e}")

        return AgentResult(
            task_id=task.task_id,
            session_id=task.session_id,
            agent_name=self.AGENT_NAME,
            status="success",
            result=forecast,
            tokens_used=0,
        )


if __name__ == "__main__":
    agent = ForecastAgent()
    agent.start_subscriber()
