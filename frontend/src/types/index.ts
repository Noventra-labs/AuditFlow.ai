// ── Core Entities ──────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  jurisdictions: string[];
  gst_registration_number?: string;
  bank_account_details?: string;
  base_currency: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  company_id: string;
  role: 'admin' | 'finance_manager' | 'viewer';
  name?: string;
  avatar_url?: string;
}

// ── Invoices ───────────────────────────────────────────────

export type InvoiceStatus =
  | 'AI Extracted'
  | 'Processing'
  | 'Needs Review'
  | 'Reconciled'
  | 'Overdue'
  | 'Voided';

export interface Invoice {
  id: string;
  vendor_id?: string;
  vendor?: string;
  invoice_number?: string;
  amount?: string;
  currency?: string;
  date?: string;
  due_date?: string;
  issue_date?: string;
  subtotal?: number;
  tax_amount?: number;
  tax_rate?: number;
  total?: number;
  status: InvoiceStatus | string;
  confidence?: number;
  raw_json?: Record<string, unknown>;
  document_url?: string;
  original_email_id?: string;
  manually_overridden?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceDetail extends Invoice {
  agent_log: unknown[];
}

export interface InvoicesResponse {
  invoices: Invoice[];
  count: number;
}

// ── Vendors ────────────────────────────────────────────────

export interface Vendor {
  id: string;
  name: string;
  tax_registration_number?: string;
  country?: string;
  gst_registered?: boolean;
  historical_avg_payment_days?: number;
  created_at?: string;
}

// ── Bank Transactions ──────────────────────────────────────

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  debit?: number;
  credit?: number;
  amount: number;
  currency: string;
  running_balance?: number;
  matched_invoice_id?: string;
  match_confidence?: number;
  match_status?: 'matched' | 'unmatched' | 'needs_review';
  imported_from?: string; // bank name e.g. 'DBS', 'OCBC'
  created_at?: string;
}

// ── Reconciliation ────────────────────────────────────────

export interface ReconciliationMatch {
  id: string;
  invoice_id: string;
  transaction_id: string;
  confidence: number;
  match_type: 'auto' | 'manual';
  variance_amount?: number;
  variance_explanation?: string;
  matched_by?: string; // agent or user name
  matched_at?: string;
  status: 'pending' | 'confirmed' | 'unmatched';
}

export interface ReconciliationSession {
  id: string;
  status: string;
  matched_count?: number;
  unmatched_count?: number;
  needs_review_count?: number;
  created_at?: string;
}

// ── Tax ────────────────────────────────────────────────────

export type Jurisdiction = 'SG' | 'ID' | 'TH' | 'PH' | 'MY';

export interface TaxRecord {
  id: string;
  reference_id: string;
  counterparty: string;
  date: string;
  net_amount: number;
  tax_rate: number;
  tax_amount: number;
  jurisdiction: Jurisdiction | string;
  tax_type: 'input' | 'output';
  invoice_id?: string;
  status?: string;
}

export interface TaxSummary {
  tax_records: TaxRecord[];
  count: number;
}

export interface TaxFiling {
  id: string;
  jurisdiction: Jurisdiction | string;
  filing_type: string; // e.g. 'GST F5', 'F7', 'PPN'
  period: string;
  due_date: string;
  estimated_amount?: number;
  status: 'Not Started' | 'Draft' | 'Submitted' | 'Filed';
  submitted_at?: string;
  filed_at?: string;
}

// ── Forecast ────────────────────────────────────────────────

export interface ForecastScenario {
  date: string;
  balance: number;
}

export interface ForecastData {
  scenarios?: {
    conservative?: number[];
    base?: number[];
    optimistic?: number[];
    dates?: string[];
  };
  cash_balance?: number;
  runway_months?: number;
  generated_at?: string;
}

export interface ForecastResponse {
  forecast: ForecastData;
  source: string;
}

// ── Reports ────────────────────────────────────────────────

export type ReportType = 'monthly' | 'quarterly' | 'tax' | 'investor' | 'annual' | 'custom';
export type ReportStatus = 'draft' | 'generated' | 'sent' | 'archived';
export type ReportFormat = 'pdf' | 'csv' | 'json';

export interface Report {
  id: string;
  type: ReportType | string;
  title?: string;
  period?: string;
  generated_at?: string;
  status: ReportStatus | string;
  recipient_count?: number;
  download_count?: number;
  file_url?: string;
  html_content?: string;
}

export interface ReportsResponse {
  reports: Report[];
  count: number;
}

export interface ScheduledReport {
  id: string;
  report_type: ReportType | string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: ReportFormat;
  timezone: string;
  language?: string;
  enabled: boolean;
  next_run?: string;
  created_at?: string;
}

// ── Agents ─────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'active' | 'error' | 'paused';

export interface AgentInfo {
  agent: string; // display name
  status: AgentStatus;
  last_activity?: string;
  last_task_description?: string;
  avg_latency_ms?: number;
  tasks_completed_today?: number;
  error_rate?: string;
  rate_limit?: number;
}

export interface AgentStatusResponse {
  agents: AgentInfo[];
}

export interface WSEvent {
  type?: string;
  agent?: string;
  message?: string;
  confidence?: number;
  timestamp?: string;
}

// ── Alerts ─────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  created_at: string;
  icon?: string;
  resolved?: boolean;
  resolved_at?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
  count: number;
}

export interface AlertConfig {
  id: string;
  alert_type: string;
  reminder_days: number[];
  channel: 'calendar' | 'email' | 'both';
  recipients: string[];
}

// ── Notifications ──────────────────────────────────────────

export interface Notification {
  id: string;
  icon: string;
  urgent: boolean;
  title: string;
  description: string;
  timestamp: string;
  read?: boolean;
  link?: string;
}

// ── Ledger ─────────────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  account_code?: string;
  type: 'credit' | 'debit';
  invoice_id?: string;
  transaction_id?: string;
  company_id?: string;
  created_at?: string;
}

// ── Calendar ───────────────────────────────────────────────

export interface CalendarDeadline {
  id: string;
  title: string;
  date: string;
  event_type: 'filing' | 'payment' | 'provisional';
  jurisdiction?: Jurisdiction | string;
  calendar_event_id?: string;
}

// ── Audit Log ──────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  session_id: string;
  agent_name: string;
  action: string;
  mcp_tool?: string;
  tool_input?: Record<string, unknown>;
  tool_output?: Record<string, unknown>;
  result_status: 'success' | 'error' | 'timeout';
  latency_ms?: number;
  token_count?: number;
  timestamp: string;
}

export interface AuditLogSearchFilters {
  agent_name?: string[];
  date_from?: string;
  date_to?: string;
  mcp_tool?: string;
  result_status?: 'success' | 'error' | 'timeout';
  session_id?: string;
  query?: string;
}

// ── Metrics ────────────────────────────────────────────────

export interface MetricsData {
  cash_balance: number;
  outstanding_ar: number;
  reconciled_rate: number;
  cash_runway_months: number;
  revenue_mtd?: number;
  expenses_mtd?: number;
  net_pnl?: number;
  gst_liability?: number;
}

// ── Upload / Batch ─────────────────────────────────────────

export interface UploadProgress {
  file_id: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'parsing' | 'done' | 'error';
  invoice_id?: string;
  error?: string;
}
