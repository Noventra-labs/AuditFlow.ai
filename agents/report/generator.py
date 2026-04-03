# agents/report/generator.py — P&L, balance sheet formatters
from typing import Dict, Any, List
from datetime import date, timedelta


def generate_pnl(
    transactions: List[Dict[str, Any]],
    invoices: List[Dict[str, Any]],
    period_start: str,
    period_end: str,
    currency: str = "SGD",
) -> Dict[str, Any]:
    """Generate a Profit & Loss statement for a period."""
    revenue = sum(
        float(t.get("amount", 0))
        for t in transactions
        if float(t.get("amount", 0)) > 0
    )

    expenses = sum(
        abs(float(t.get("amount", 0)))
        for t in transactions
        if float(t.get("amount", 0)) < 0
    )

    # Categorize expenses
    categories = {}
    for t in transactions:
        amt = float(t.get("amount", 0))
        if amt < 0:
            cat = t.get("category", "Other")
            categories[cat] = categories.get(cat, 0) + abs(amt)

    gross_profit = revenue - expenses
    tax_estimate = gross_profit * 0.17 if gross_profit > 0 else 0
    net_profit = gross_profit - tax_estimate

    return {
        "period": {"start": period_start, "end": period_end},
        "currency": currency,
        "revenue": round(revenue, 2),
        "total_expenses": round(expenses, 2),
        "expense_breakdown": {k: round(v, 2) for k, v in sorted(categories.items(), key=lambda x: -x[1])},
        "gross_profit": round(gross_profit, 2),
        "gross_margin": round((gross_profit / revenue * 100) if revenue > 0 else 0, 1),
        "tax_estimate": round(tax_estimate, 2),
        "net_profit": round(net_profit, 2),
        "net_margin": round((net_profit / revenue * 100) if revenue > 0 else 0, 1),
    }


def generate_balance_snapshot(
    cash_balance: float,
    ar_total: float,
    ap_total: float,
    currency: str = "SGD",
) -> Dict[str, Any]:
    """Generate a simplified balance sheet snapshot."""
    total_assets = cash_balance + ar_total
    total_liabilities = ap_total
    equity = total_assets - total_liabilities

    return {
        "currency": currency,
        "assets": {
            "cash": round(cash_balance, 2),
            "accounts_receivable": round(ar_total, 2),
            "total": round(total_assets, 2),
        },
        "liabilities": {
            "accounts_payable": round(ap_total, 2),
            "total": round(total_liabilities, 2),
        },
        "equity": round(equity, 2),
    }
