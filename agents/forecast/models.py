# agents/forecast/models.py — AR aging, AP schedule, runway calculation
from typing import Dict, Any, List
from datetime import datetime, date, timedelta
from dataclasses import dataclass


@dataclass
class AgingBucket:
    label: str
    min_days: int
    max_days: int
    total: float = 0
    count: int = 0


def calculate_ar_aging(invoices: List[Dict[str, Any]], as_of: date = None) -> Dict[str, Any]:
    """Calculate Accounts Receivable aging buckets."""
    as_of = as_of or date.today()
    buckets = [
        AgingBucket("current", 0, 30),
        AgingBucket("30_days", 31, 60),
        AgingBucket("60_days", 61, 90),
        AgingBucket("90_plus", 91, 9999),
    ]

    for inv in invoices:
        due = inv.get("due_date")
        if not due:
            continue
        if isinstance(due, str):
            due = date.fromisoformat(due)
        days_overdue = (as_of - due).days
        total = float(inv.get("total", 0))

        for bucket in buckets:
            if bucket.min_days <= max(days_overdue, 0) <= bucket.max_days:
                bucket.total += total
                bucket.count += 1
                break

    return {
        b.label: {"amount": round(b.total, 2), "count": b.count}
        for b in buckets
    }


def calculate_ap_schedule(invoices: List[Dict[str, Any]], days_ahead: int = 90) -> List[Dict[str, Any]]:
    """Calculate Accounts Payable payment schedule."""
    today = date.today()
    cutoff = today + timedelta(days=days_ahead)
    schedule = []

    for inv in invoices:
        due = inv.get("due_date")
        if not due:
            continue
        if isinstance(due, str):
            due = date.fromisoformat(due)

        if today <= due <= cutoff:
            schedule.append({
                "invoice_id": inv.get("id"),
                "vendor": inv.get("vendor_name", "Unknown"),
                "amount": float(inv.get("total", 0)),
                "currency": inv.get("currency", "SGD"),
                "due_date": due.isoformat(),
                "days_until_due": (due - today).days,
            })

    schedule.sort(key=lambda x: x["due_date"])
    return schedule


def calculate_burn_rate(transactions: List[Dict[str, Any]], months: int = 3) -> Dict[str, Any]:
    """Calculate monthly burn rate from recent transactions."""
    today = date.today()
    monthly_totals = {}

    for txn in transactions:
        txn_date = txn.get("date")
        if isinstance(txn_date, str):
            txn_date = date.fromisoformat(txn_date)
        if not txn_date:
            continue

        month_key = f"{txn_date.year}-{txn_date.month:02d}"
        amount = float(txn.get("amount", 0))
        if amount < 0:  # Outflow
            monthly_totals[month_key] = monthly_totals.get(month_key, 0) + abs(amount)

    sorted_months = sorted(monthly_totals.keys(), reverse=True)[:months]
    if not sorted_months:
        return {"avg_monthly_burn": 0, "trend": "insufficient_data", "months_analyzed": 0}

    values = [monthly_totals[m] for m in sorted_months]
    avg = sum(values) / len(values)

    # Trend analysis
    if len(values) >= 2:
        if values[0] > values[-1] * 1.1:
            trend = "increasing"
        elif values[0] < values[-1] * 0.9:
            trend = "decreasing"
        else:
            trend = "stable"
    else:
        trend = "insufficient_data"

    return {
        "avg_monthly_burn": round(avg, 2),
        "monthly_breakdown": {m: round(monthly_totals[m], 2) for m in sorted_months},
        "trend": trend,
        "months_analyzed": len(sorted_months),
    }


def calculate_runway(
    current_cash: float,
    monthly_burn: float,
    monthly_revenue: float,
    scenario: str = "base",
) -> int:
    """Calculate cash runway in months for a given scenario."""
    # Adjust for scenario
    adjustments = {
        "conservative": {"revenue_mult": 0.7, "burn_mult": 1.15},
        "base": {"revenue_mult": 1.0, "burn_mult": 1.0},
        "optimistic": {"revenue_mult": 1.2, "burn_mult": 0.9},
    }
    adj = adjustments.get(scenario, adjustments["base"])

    adjusted_revenue = monthly_revenue * adj["revenue_mult"]
    adjusted_burn = monthly_burn * adj["burn_mult"]
    net_monthly = adjusted_revenue - adjusted_burn

    if net_monthly >= 0:
        return 999  # Infinite runway (profitable)

    months = int(current_cash / abs(net_monthly))
    return max(months, 0)
