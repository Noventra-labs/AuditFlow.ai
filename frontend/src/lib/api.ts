'use client';

/**
 * API client for the FinancePilot backend orchestrator
 * Base URL should be set in NEXT_PUBLIC_API_URL env variable
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
  last_activity: any;
}

export interface AgentStatusResponse {
  agents: AgentStatus[];
}

// Helper to build URLs with company context
function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  // Default company ID for demo - in production this comes from auth context
  url.searchParams.set('company_id', 'demo-company-001');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API Methods
export const api = {
  // Health check
  health: () => fetchApi<{ status: string; timestamp: string }>(`${API_BASE_URL}/v1/health`),

  // Invoices
  getInvoices: (status?: string) =>
    fetchApi<InvoicesResponse>(buildUrl('/v1/invoices', status ? { status } : undefined)),

  getInvoice: (invoiceId: string) =>
    fetchApi<{ invoice: Invoice; agent_log: any[] }>(`${API_BASE_URL}/v1/invoices/${invoiceId}`),

  // Alerts
  getAlerts: (severity?: string, resolved = false) =>
    fetchApi<AlertsResponse>(buildUrl('/v1/alerts', severity ? { severity, resolved: String(resolved) } : { resolved: String(resolved) })),

  // Forecast
  getForecast: () =>
    fetchApi<ForecastResponse>(buildUrl('/v1/forecast')),

  // Ledger
  getLedger: (dateFrom?: string, dateTo?: string) =>
    fetchApi<{ entries: any[]; count: number }>(buildUrl('/v1/ledger', dateFrom ? { date_from: dateFrom, ...(dateTo ? { date_to: dateTo } : {}) } : undefined)),

  // Agent Status
  getAgentStatus: () =>
    fetchApi<AgentStatusResponse>(`${API_BASE_URL}/v1/agents/status`),

  // Trigger reconciliation
  triggerReconciliation: (dateFrom?: string, dateTo?: string) =>
    fetchApi<{ session_id: string; status: string }>(
      buildUrl('/v1/reconcile', dateFrom ? { date_from: dateFrom, ...(dateTo ? { date_to: dateTo } : {}) } : undefined),
      { method: 'POST' }
    ),

  // Generate report
  generateReport: (reportType = 'monthly') =>
    fetchApi<{ session_id: string; report_type: string; status: string }>(
      buildUrl('/v1/reports/generate', { report_type: reportType }),
      { method: 'POST' }
    ),
};

export default api;
