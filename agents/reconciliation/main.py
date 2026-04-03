# agents/reconciliation/main.py — Reconciliation Agent entry point
import os
import json
from uuid import uuid4
from datetime import datetime, timedelta

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from agents.base_agent import BaseFinanceAgent
from agents.reconciliation.matcher import match_invoice_to_transactions, determine_reconciliation_action
from shared.models import AgentTask, AgentResult


class ReconciliationAgent(BaseFinanceAgent):
    AGENT_NAME = "reconciliation_agent"
    SUBSCRIBE_TOPIC = "finance.reconcile"
    SYSTEM_PROMPT = "You are FinancePilot Reconciliation Agent."

    async def process_task(self, task: AgentTask) -> AgentResult:
        """Match invoices to bank transactions."""
        payload = task.payload
        invoice_id = payload.get("invoice_id")
        total_tokens = 0

        # Fetch the invoice
        invoice = None
        if invoice_id:
            resp = self.supabase.table("invoices").select("*").eq("id", invoice_id).execute()
            if resp.data:
                invoice = resp.data[0]

        if not invoice:
            # If no specific invoice, get all unreconciled
            resp = self.supabase.table("invoices").select("*").eq(
                "company_id", task.company_id
            ).in_("status", ["parsed", "pending"]).execute()
            invoices_to_process = resp.data or []
        else:
            invoices_to_process = [invoice]

        # Fetch bank transactions within 30-day window
        date_from = payload.get("date_from")
        date_to = payload.get("date_to")
        if not date_from:
            date_from = (datetime.utcnow() - timedelta(days=30)).strftime("%Y-%m-%d")
        if not date_to:
            date_to = datetime.utcnow().strftime("%Y-%m-%d")

        txn_resp = self.supabase.table("bank_transactions").select("*").eq(
            "company_id", task.company_id
        ).gte("date", date_from).lte("date", date_to).is_("reconciled_invoice_id", "null").execute()

        transactions = txn_resp.data or []
        self.logger.info(f"Found {len(transactions)} unreconciled transactions in window")

        # Process each invoice
        results = []
        for inv in invoices_to_process:
            # Build invoice data for matching
            invoice_data = {
                "total": inv.get("total", 0),
                "vendor_name": "",
                "currency": inv.get("currency", "SGD"),
                "due_date": inv.get("due_date"),
            }

            # Get vendor name
            if inv.get("vendor_id"):
                v_resp = self.supabase.table("vendors").select("name").eq("id", inv["vendor_id"]).execute()
                if v_resp.data:
                    invoice_data["vendor_name"] = v_resp.data[0]["name"]

            # Run fuzzy matching
            candidates = match_invoice_to_transactions(invoice_data, transactions)

            if candidates:
                best = candidates[0]
                action, status = determine_reconciliation_action(best["confidence_score"])

                if action == "auto_reconcile":
                    # Auto-reconcile: update both records
                    self.supabase.table("bank_transactions").update({
                        "reconciled_invoice_id": inv["id"],
                        "confidence_score": best["confidence_score"],
                    }).eq("id", best["transaction_id"]).execute()

                    self.supabase.table("invoices").update({
                        "status": "reconciled",
                    }).eq("id", inv["id"]).execute()

                    # Create ledger entry
                    ledger_entry = {
                        "id": str(uuid4()),
                        "company_id": task.company_id,
                        "date": datetime.utcnow().strftime("%Y-%m-%d"),
                        "account_code": "2000",  # Accounts Payable
                        "description": f"Reconciled: Invoice {inv.get('invoice_number', inv['id'])}",
                        "debit": float(inv.get("total", 0)),
                        "credit": 0,
                        "source_invoice_id": inv["id"],
                        "source_transaction_id": best["transaction_id"],
                    }
                    self.supabase.table("ledger_entries").insert(ledger_entry).execute()

                elif action == "manual_review":
                    self.supabase.table("invoices").update({
                        "status": "manual_review",
                    }).eq("id", inv["id"]).execute()

                else:
                    # Trigger Alert Agent for unmatched
                    self.publish_message("finance.alert", {
                        "session_id": task.session_id,
                        "company_id": task.company_id,
                        "agent_name": "alert_agent",
                        "action": "unmatched_invoice",
                        "payload": {"invoice_id": inv["id"]},
                    })

                results.append({
                    "invoice_id": inv["id"],
                    "action": action,
                    "best_match": best,
                    "candidates_count": len(candidates),
                    "top_candidates": candidates[:3],
                })
            else:
                results.append({
                    "invoice_id": inv["id"],
                    "action": "unmatched",
                    "best_match": None,
                    "candidates_count": 0,
                })

        return AgentResult(
            task_id=task.task_id,
            session_id=task.session_id,
            agent_name=self.AGENT_NAME,
            status="success",
            result={
                "reconciled_count": sum(1 for r in results if r["action"] == "auto_reconcile"),
                "review_count": sum(1 for r in results if r["action"] == "manual_review"),
                "unmatched_count": sum(1 for r in results if r["action"] == "unmatched"),
                "details": results,
                "transactions_checked": len(transactions),
            },
            tokens_used=total_tokens,
        )


if __name__ == "__main__":
    agent = ReconciliationAgent()
    agent.start_subscriber()
