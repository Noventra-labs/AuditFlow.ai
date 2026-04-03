# agents/reconciliation/matcher.py — Fuzzy matching + confidence scoring
from typing import List, Dict, Any, Tuple
from datetime import datetime, timedelta
from difflib import SequenceMatcher

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from shared.logging_utils import get_logger

logger = get_logger("reconciliation.matcher")


def fuzzy_match_string(a: str, b: str) -> float:
    """Fuzzy string match ratio (0-1)."""
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def match_invoice_to_transactions(
    invoice: Dict[str, Any],
    transactions: List[Dict[str, Any]],
    tolerance_pct: float = 0.02,
) -> List[Dict[str, Any]]:
    """
    Match an invoice against bank transactions using multi-signal scoring.

    Returns list of candidates with confidence scores, sorted highest first.
    """
    invoice_total = float(invoice.get("total", 0))
    invoice_vendor = invoice.get("vendor_name", "") or ""
    invoice_currency = invoice.get("currency", "SGD")
    invoice_due = invoice.get("due_date")

    candidates = []

    for txn in transactions:
        txn_amount = abs(float(txn.get("amount", 0)))
        txn_desc = txn.get("description", "")
        txn_currency = txn.get("currency", "SGD")
        txn_date = txn.get("date")

        # Skip if already reconciled
        if txn.get("reconciled_invoice_id"):
            continue

        # ── Signal 1: Amount Match (0-40 points) ──────────────────
        amount_diff_pct = abs(txn_amount - invoice_total) / max(invoice_total, 1)
        if amount_diff_pct == 0:
            amount_score = 40  # Exact match
        elif amount_diff_pct <= tolerance_pct:
            amount_score = 30  # Within tolerance (FX variance)
        elif amount_diff_pct <= 0.05:
            amount_score = 15
        else:
            amount_score = 0

        # ── Signal 2: Vendor Name Match (0-30 points) ─────────────
        vendor_score = int(fuzzy_match_string(invoice_vendor, txn_desc) * 30)

        # ── Signal 3: Currency Match (0-10 points) ────────────────
        currency_score = 10 if txn_currency == invoice_currency else 0

        # ── Signal 4: Date Proximity (0-20 points) ────────────────
        date_score = 0
        if invoice_due and txn_date:
            try:
                due = datetime.fromisoformat(str(invoice_due))
                txn_d = datetime.fromisoformat(str(txn_date))
                days_diff = abs((txn_d - due).days)
                if days_diff <= 3:
                    date_score = 20
                elif days_diff <= 7:
                    date_score = 15
                elif days_diff <= 14:
                    date_score = 10
                elif days_diff <= 30:
                    date_score = 5
            except (ValueError, TypeError):
                pass

        # ── Total Confidence ──────────────────────────────────────
        confidence = amount_score + vendor_score + currency_score + date_score

        if confidence > 20:  # Minimum threshold
            candidates.append({
                "transaction_id": txn.get("id"),
                "transaction_date": txn_date,
                "transaction_amount": txn_amount,
                "transaction_description": txn_desc,
                "confidence_score": confidence,
                "match_details": {
                    "amount_score": amount_score,
                    "vendor_score": vendor_score,
                    "currency_score": currency_score,
                    "date_score": date_score,
                    "amount_diff_pct": round(amount_diff_pct * 100, 2),
                },
            })

    # Sort by confidence, highest first
    candidates.sort(key=lambda x: x["confidence_score"], reverse=True)
    return candidates[:5]  # Return top 5 candidates


def determine_reconciliation_action(
    confidence: int,
) -> Tuple[str, str]:
    """
    Determine action based on confidence score.
    Returns (action, status).
    """
    if confidence > 90:
        return "auto_reconcile", "reconciled"
    elif confidence >= 50:
        return "manual_review", "review_required"
    else:
        return "unmatched", "unmatched"
