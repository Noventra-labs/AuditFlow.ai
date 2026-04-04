export interface Invoice {
  id: string;
  vendor?: string;
  amount?: string;
  currency?: string;
  date?: string;
  due_date?: string;
  status: string;
  confidence?: number;
  created_at?: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  count: number;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  created_at: string;
  icon?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
  count: number;
}

export interface ForecastData {
  scenarios?: {
    conservative?: number[];
    base?: number[];
    optimistic?: number[];
  };
  cash_balance?: number;
  runway_months?: number;
  generated_at?: string;
}

export interface ForecastResponse {
  forecast: ForecastData;
  source: string;
}

export interface MetricsData {
  cash_balance: number;
  outstanding_ar: number;
  reconciled_rate: number;
  cash_runway_months: number;
}

export interface AgentStatus {
  agent: string;
  status: 'active' | 'idle' | 'error';
  last_activity: unknown;
}

export interface AgentStatusResponse {
  agents: AgentStatus[];
}

export interface WSEvent {
  type: string;
  agent: string;
  message: string;
  confidence?: number;
  timestamp: string;
}
