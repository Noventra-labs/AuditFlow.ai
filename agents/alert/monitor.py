# agents/alert/monitor.py — Threshold check logic
from typing import Dict, Any, List, Optional
from datetime import datetime, date, timedelta


def check_overdue_invoices(
    invoices: List[Dict[str, Any]], threshold_days: int = 7
) -> List[Dict[str, Any]]:
    """Find invoices overdue by more than threshold_days."""
    today = date.today()
    alerts = []
    for inv in invoices:
        due = inv.get("due_date")
        if not due or inv.get("status") == "reconciled":
            continue
        if isinstance(due, str):
            due = date.fromisoformat(due)
        days_overdue = (today - due).days
        if days_overdue > threshold_days:
            alerts.append({
                "alert_type": "overdue_invoice",
                "severity": "high" if days_overdue > 30 else "medium",
                "message": f"Invoice {inv.get('invoice_number', inv['id'])} is {days_overdue} days overdue. Amount: {inv.get('currency', 'SGD')} {inv.get('total', 0):,.2f}",
                "related_invoice_id": inv.get("id"),
                "days_overdue": days_overdue,
            })
    return alerts


def check_unmatched_reconciliation(
    invoices: List[Dict[str, Any]], threshold_days: int = 3
) -> List[Dict[str, Any]]:
    """Find invoices unmatched in reconciliation for too long."""
    today = date.today()
    alerts = []
    for inv in invoices:
        if inv.get("status") not in ("parsed", "manual_review"):
            continue
        created = inv.get("created_at", "")
        if isinstance(created, str) and created:
            created_date = datetime.fromisoformat(created.replace("Z", "+00:00")).date()
        else:
            continue
        days_unmatched = (today - created_date).days
        if days_unmatched > threshold_days:
            alerts.append({
                "alert_type": "unmatched_reconciliation",
                "severity": "medium",
                "message": f"Invoice {inv.get('invoice_number', inv['id'])} has been unmatched for {days_unmatched} days.",
                "related_invoice_id": inv.get("id"),
            })
    return alerts


def check_low_runway(forecast: Dict[str, Any], threshold_days: int = 60) -> Optional[Dict[str, Any]]:
    """Check if cash runway is below threshold."""
    conservative_months = forecast.get("conservative_runway", 999)
    if conservative_months * 30 < threshold_days:
        return {
            "alert_type": "low_runway",
            "severity": "critical",
            "message": f"⚠️ CRITICAL: Conservative cash runway is only {conservative_months} months ({conservative_months * 30} days). Immediate attention required.",
        }
    base_months = forecast.get("base_runway", 999)
    if base_months * 30 < threshold_days * 1.5:
        return {
            "alert_type": "low_runway",
            "severity": "high",
            "message": f"Cash runway warning: Base case runway is {base_months} months. Consider reviewing expenses.",
        }
    return None


def check_unusual_transactions(
    transactions: List[Dict[str, Any]], multiplier: float = 3.0
) -> List[Dict[str, Any]]:
    """Flag transactions that are >3x the average amount."""
    amounts = [abs(float(t.get("amount", 0))) for t in transactions if t.get("amount")]
    if len(amounts) < 5:
        return []

    avg = sum(amounts) / len(amounts)
    threshold = avg * multiplier
    alerts = []

    for t in transactions:
        amt = abs(float(t.get("amount", 0)))
        if amt > threshold:
            alerts.append({
                "alert_type": "unusual_transaction",
                "severity": "high",
                "message": f"Unusual transaction: {t.get('currency', 'SGD')} {amt:,.2f} ({amt/avg:.1f}x average). Description: {t.get('description', 'N/A')}",
            })
    return alerts


def check_tax_deadlines(
    tax_records: List[Dict[str, Any]], days_ahead: int = 14
) -> List[Dict[str, Any]]:
    """Flag upcoming tax filing deadlines."""
    today = date.today()
    cutoff = today + timedelta(days=days_ahead)
    alerts = []

    for rec in tax_records:
        deadline = rec.get("filing_deadline")
        if not deadline:
            continue
        if isinstance(deadline, str):
            deadline = date.fromisoformat(deadline)
        if today <= deadline <= cutoff and rec.get("status") != "filed":
            days_until = (deadline - today).days
            alerts.append({
                "alert_type": "tax_deadline",
                "severity": "critical" if days_until <= 3 else "high" if days_until <= 7 else "medium",
                "message": f"Tax filing deadline in {days_until} days: {rec.get('tax_type', 'Tax')} for {rec.get('jurisdiction', 'N/A')}. Net payable: {rec.get('net_payable', 0):,.2f}",
            })
    return alerts
