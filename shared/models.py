# shared/models.py — Pydantic models for FinancePilot
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum
from uuid import uuid4


class InvoiceStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PARSED = "parsed"
    RECONCILED = "reconciled"
    FAILED = "failed"
    MANUAL_REVIEW = "manual_review"


class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, Enum):
    OVERDUE_INVOICE = "overdue_invoice"
    UNMATCHED_RECONCILIATION = "unmatched_reconciliation"
    LOW_RUNWAY = "low_runway"
    UNUSUAL_TRANSACTION = "unusual_transaction"
    TAX_DEADLINE = "tax_deadline"
    ANOMALY = "anomaly"


class TaxJurisdiction(str, Enum):
    SINGAPORE = "SG"
    INDONESIA = "ID"
    THAILAND = "TH"
    PHILIPPINES = "PH"
    MALAYSIA = "MY"
    VIETNAM = "VN"


TAX_RATES = {
    TaxJurisdiction.SINGAPORE: {"gst": 0.09, "name": "GST", "threshold": 1_000_000},
    TaxJurisdiction.INDONESIA: {"ppn": 0.11, "name": "PPN", "threshold": 4_800_000_000},
    TaxJurisdiction.THAILAND: {"vat": 0.07, "name": "VAT", "threshold": 1_800_000},
    TaxJurisdiction.PHILIPPINES: {"vat": 0.12, "name": "VAT", "threshold": 3_000_000},
    TaxJurisdiction.MALAYSIA: {"sst": 0.06, "name": "SST", "threshold": 500_000},
    TaxJurisdiction.VIETNAM: {"vat": 0.10, "name": "VAT", "threshold": 1_000_000_000},
}


# ── Company & Vendor ──────────────────────────────────────────────
class Company(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    jurisdiction: TaxJurisdiction
    gst_number: Optional[str] = None
    bank_account_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Vendor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    name: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    country: Optional[str] = None
    gst_registered: bool = False
    avg_payment_days: int = 30


# ── Invoice ───────────────────────────────────────────────────────
class LineItem(BaseModel):
    description: str
    quantity: float = 1
    unit_price: float
    amount: float


class Invoice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    vendor_id: Optional[str] = None
    invoice_number: Optional[str] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    subtotal: float = 0
    tax_amount: float = 0
    total: float = 0
    currency: str = "SGD"
    status: InvoiceStatus = InvoiceStatus.PENDING
    pdf_url: Optional[str] = None
    raw_json: Optional[Dict[str, Any]] = None
    parsed_by_agent: Optional[str] = None
    line_items: List[LineItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class InvoiceSubmission(BaseModel):
    source: str = "upload"  # upload | gmail | api
    file_url: Optional[str] = None
    company_id: str
    notes: Optional[str] = None


# ── Bank & Ledger ─────────────────────────────────────────────────
class BankTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    date: date
    description: str
    amount: float
    currency: str = "SGD"
    balance: Optional[float] = None
    category: Optional[str] = None
    reconciled_invoice_id: Optional[str] = None
    confidence_score: Optional[float] = None


class LedgerEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    date: date
    account_code: str
    description: str
    debit: float = 0
    credit: float = 0
    running_balance: Optional[float] = None
    source_invoice_id: Optional[str] = None
    source_transaction_id: Optional[str] = None


# ── Tax ───────────────────────────────────────────────────────────
class TaxRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    period_start: date
    period_end: date
    jurisdiction: TaxJurisdiction
    tax_type: str
    gross_amount: float = 0
    tax_rate: float = 0
    tax_amount: float = 0
    input_credit: float = 0
    net_payable: float = 0
    filing_deadline: Optional[date] = None
    status: str = "pending"


# ── Forecast ──────────────────────────────────────────────────────
class ForecastScenario(BaseModel):
    conservative_runway: int = 0
    base_runway: int = 0
    optimistic_runway: int = 0


class Forecast(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    horizon_days: int = 90
    conservative_runway: int = 0
    base_runway: int = 0
    optimistic_runway: int = 0
    ar_aging_json: Optional[Dict[str, Any]] = None
    ap_schedule_json: Optional[Dict[str, Any]] = None
    assumptions_json: Optional[Dict[str, Any]] = None


# ── Audit & Alerts ────────────────────────────────────────────────
class AuditLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    session_id: str
    agent_name: str
    action: str
    input_summary: Optional[str] = None
    output_summary: Optional[str] = None
    tool_calls_json: Optional[Dict[str, Any]] = None
    duration_ms: Optional[int] = None
    tokens_used: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    alert_type: AlertType
    severity: AlertSeverity
    message: str
    related_invoice_id: Optional[str] = None
    calendar_event_id: Optional[str] = None
    email_sent_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReportHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company_id: str
    report_type: str
    period: str
    recipient_emails: List[str] = []
    subject: str
    sent_at: Optional[datetime] = None
    supabase_storage_url: Optional[str] = None


# ── Agent Communication ──────────────────────────────────────────
class AgentTask(BaseModel):
    task_id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str
    company_id: str
    agent_name: str
    action: str
    payload: Dict[str, Any] = {}
    priority: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentResult(BaseModel):
    task_id: str
    session_id: str
    agent_name: str
    status: str = "success"
    result: Dict[str, Any] = {}
    error: Optional[str] = None
    duration_ms: int = 0
    tokens_used: int = 0


class FinancialPlan(BaseModel):
    session_id: str
    intent: str
    subtasks: List[AgentTask] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── WebSocket Events ─────────────────────────────────────────────
class WSEvent(BaseModel):
    event: str
    data: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
