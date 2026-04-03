# agents/tax_compliance/jurisdictions.py — SE Asia tax rule models
from dataclasses import dataclass
from typing import Optional, Dict
from datetime import date


@dataclass
class TaxJurisdiction:
    code: str
    name: str
    tax_name: str
    standard_rate: float
    registration_threshold: float
    currency: str
    filing_frequency: str  # quarterly, monthly, annual
    filing_deadlines: Dict[str, str]  # period -> deadline description

    def get_next_filing_deadline(self, current_date: date) -> date:
        month = current_date.month
        year = current_date.year
        if self.filing_frequency == "quarterly":
            q_end_months = [3, 6, 9, 12]
            for m in q_end_months:
                if month <= m:
                    # Deadline is typically end of month following quarter end
                    deadline_month = m + 1
                    deadline_year = year
                    if deadline_month > 12:
                        deadline_month = 1
                        deadline_year += 1
                    return date(deadline_year, deadline_month, 28)
        elif self.filing_frequency == "monthly":
            next_month = month + 1
            next_year = year
            if next_month > 12:
                next_month = 1
                next_year += 1
            return date(next_year, next_month, 15)
        return date(year + 1, 3, 31)  # default annual


# SE Asian tax jurisdictions
JURISDICTIONS = {
    "SG": TaxJurisdiction(
        code="SG", name="Singapore", tax_name="GST",
        standard_rate=0.09, registration_threshold=1_000_000,
        currency="SGD", filing_frequency="quarterly",
        filing_deadlines={"Q1": "Apr 30", "Q2": "Jul 31", "Q3": "Oct 31", "Q4": "Jan 31"},
    ),
    "ID": TaxJurisdiction(
        code="ID", name="Indonesia", tax_name="PPN",
        standard_rate=0.11, registration_threshold=4_800_000_000,
        currency="IDR", filing_frequency="monthly",
        filing_deadlines={"monthly": "end of following month"},
    ),
    "TH": TaxJurisdiction(
        code="TH", name="Thailand", tax_name="VAT",
        standard_rate=0.07, registration_threshold=1_800_000,
        currency="THB", filing_frequency="monthly",
        filing_deadlines={"monthly": "15th of following month"},
    ),
    "PH": TaxJurisdiction(
        code="PH", name="Philippines", tax_name="VAT",
        standard_rate=0.12, registration_threshold=3_000_000,
        currency="PHP", filing_frequency="quarterly",
        filing_deadlines={"Q1": "Apr 25", "Q2": "Jul 25", "Q3": "Oct 25", "Q4": "Jan 25"},
    ),
    "MY": TaxJurisdiction(
        code="MY", name="Malaysia", tax_name="SST",
        standard_rate=0.06, registration_threshold=500_000,
        currency="MYR", filing_frequency="quarterly",
        filing_deadlines={"quarterly": "last day of following month"},
    ),
    "VN": TaxJurisdiction(
        code="VN", name="Vietnam", tax_name="VAT",
        standard_rate=0.10, registration_threshold=1_000_000_000,
        currency="VND", filing_frequency="monthly",
        filing_deadlines={"monthly": "20th of following month"},
    ),
}


def get_jurisdiction(code: str) -> Optional[TaxJurisdiction]:
    return JURISDICTIONS.get(code.upper())


def calculate_tax(amount: float, jurisdiction_code: str) -> Dict:
    """Calculate tax for a given amount and jurisdiction."""
    j = get_jurisdiction(jurisdiction_code)
    if not j:
        return {"error": f"Unknown jurisdiction: {jurisdiction_code}"}
    tax_amount = amount * j.standard_rate
    return {
        "jurisdiction": j.code,
        "tax_name": j.tax_name,
        "gross_amount": amount,
        "tax_rate": j.standard_rate,
        "tax_amount": round(tax_amount, 2),
        "total_with_tax": round(amount + tax_amount, 2),
        "currency": j.currency,
    }
