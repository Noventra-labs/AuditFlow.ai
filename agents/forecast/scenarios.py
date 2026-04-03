# agents/forecast/scenarios.py — Conservative/base/optimistic forecast engine
from typing import Dict, Any, List
from datetime import date, timedelta

from agents.forecast.models import (
    calculate_ar_aging,
    calculate_ap_schedule,
    calculate_burn_rate,
    calculate_runway,
)


def build_three_scenario_forecast(
    invoices: List[Dict[str, Any]],
    transactions: List[Dict[str, Any]],
    current_cash: float,
    monthly_revenue: float,
    horizon_days: int = 90,
) -> Dict[str, Any]:
    """
    Build complete 3-scenario cash flow forecast.
    Returns AR aging, AP schedule, burn rate, and runway for all scenarios.
    """
    ar_aging = calculate_ar_aging(invoices)
    ap_schedule = calculate_ap_schedule(invoices, horizon_days)
    burn = calculate_burn_rate(transactions)

    monthly_burn = burn.get("avg_monthly_burn", 0)

    scenarios = {}
    for scenario in ["conservative", "base", "optimistic"]:
        runway = calculate_runway(current_cash, monthly_burn, monthly_revenue, scenario)
        scenarios[scenario] = {
            "runway_months": runway,
            "runway_days": runway * 30,
        }

    # Build monthly projection for base scenario
    projections = []
    cash = current_cash
    today = date.today()
    for month_offset in range(1, (horizon_days // 30) + 1):
        proj_date = today + timedelta(days=month_offset * 30)
        inflow = monthly_revenue
        outflow = monthly_burn
        cash = cash + inflow - outflow
        projections.append({
            "month": proj_date.strftime("%Y-%m"),
            "projected_cash": round(cash, 2),
            "inflow": round(inflow, 2),
            "outflow": round(outflow, 2),
        })

    return {
        "horizon_days": horizon_days,
        "current_cash": current_cash,
        "monthly_revenue": monthly_revenue,
        "ar_aging": ar_aging,
        "ap_schedule": ap_schedule[:10],  # Top 10 upcoming payments
        "burn_rate": burn,
        "scenarios": scenarios,
        "base_projection": projections,
        "assumptions": {
            "monthly_burn_source": f"{burn['months_analyzed']}-month average",
            "burn_trend": burn["trend"],
            "conservative": "70% revenue collection, 15% higher expenses",
            "base": "Historical average collection and burn",
            "optimistic": "120% collection, 10% lower expenses",
        },
    }
