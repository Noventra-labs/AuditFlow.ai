import type {
  Invoice,
  InvoicesResponse,
  AlertsResponse,
  ForecastResponse,
  AgentStatusResponse,
  TaxRecord,
  LedgerEntry,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export class ApiError extends Error {
  statusCode: number;
  detail?: string;

  constructor(statusCode: number, detail?: string) {
    super(detail || `HTTP ${statusCode}`);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.set('company_id', 'demo-company-001');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    let detail = 'Unknown error';
    try {
      const body = await response.json();
      detail = body.detail || body.message || body.error || detail;
    } catch { /* ignore */ }
    throw new ApiError(response.status, detail);
  }
  return response.json();
}

export const api = {
  health: () => fetchApi<{ status: string; timestamp: string; version?: string }>(`${API_BASE_URL}/v1/health`),

  getInvoices: (status?: string) =>
    fetchApi<InvoicesResponse>(buildUrl('/v1/invoices', status ? { status } : undefined)),

  getInvoice: (invoiceId: string) =>
    fetchApi<{ invoice: Invoice; agent_log: unknown[] }>(`${API_BASE_URL}/v1/invoices/${invoiceId}`),

  getAlerts: (severity?: string, resolved = false) =>
    fetchApi<AlertsResponse>(
      buildUrl('/v1/alerts', severity ? { severity, resolved: String(resolved) } : { resolved: String(resolved) })
    ),

  getForecast: () =>
    fetchApi<ForecastResponse>(buildUrl('/v1/forecast')),

  getLedger: (dateFrom?: string, dateTo?: string) =>
    fetchApi<{ entries: LedgerEntry[]; count: number }>(
      buildUrl('/v1/ledger', dateFrom ? { date_from: dateFrom, ...(dateTo ? { date_to: dateTo } : {}) } : undefined)
    ),

  getAgentStatus: () =>
    fetchApi<AgentStatusResponse>(`${API_BASE_URL}/v1/agents/status`),

  getTaxSummary: () =>
    fetchApi<{ tax_records: TaxRecord[]; count: number }>(buildUrl('/v1/tax/summary')),

  triggerReconciliation: (dateFrom?: string, dateTo?: string) =>
    fetchApi<{ session_id: string; status: string; matched_count?: number; unmatched_count?: number }>(
      buildUrl('/v1/reconcile', dateFrom ? { date_from: dateFrom, ...(dateTo ? { date_to: dateTo } : {}) } : undefined),
      { method: 'POST' }
    ),

  generateReport: (reportType = 'monthly') =>
    fetchApi<{ session_id: string; report_type: string; status: string; report_id?: string }>(
      buildUrl('/v1/reports/generate', { report_type: reportType }),
      { method: 'POST' }
    ),

  // Email report to recipients
  emailReport: (reportId: string, recipients: string[], subject?: string) =>
    fetchApi<{ status: string; sent_to: string[]; message_id?: string }>(
      buildUrl('/v1/reports/email', { report_id: reportId }),
      {
        method: 'POST',
        body: JSON.stringify({ recipients, subject }),
      }
    ),

  // Download report as PDF
  downloadPDF: async (reportId: string): Promise<Blob> => {
    const response = await fetch(buildUrl('/v1/reports/download', { report_id: reportId, format: 'pdf' }), {
      method: 'POST',
    });
    if (!response.ok) {
      let detail = 'Download failed';
      try { const b = await response.json(); detail = b.detail || detail; } catch { /* ignore */ }
      throw new ApiError(response.status, detail);
    }
    return response.blob();
  },

  // Export data as CSV
  exportCSV: async (exportType: 'invoices' | 'ledger' | 'tax' | 'vendors'): Promise<Blob> => {
    const response = await fetch(buildUrl('/v1/export', { type: exportType, format: 'csv' }), {
      method: 'POST',
    });
    if (!response.ok) {
      let detail = 'Export failed';
      try { const b = await response.json(); detail = b.detail || detail; } catch { /* ignore */ }
      throw new ApiError(response.status, detail);
    }
    return response.blob();
  },

  // Upload invoice document
  uploadInvoice: async (file: File): Promise<{ invoice_id: string; status: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/v1/invoices/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      let detail = 'Upload failed';
      try { const b = await response.json(); detail = b.detail || detail; } catch { /* ignore */ }
      throw new ApiError(response.status, detail);
    }
    return response.json();
  },

  // Get report library (list all reports)
  getReports: (status?: string) =>
    fetchApi<{ reports: unknown[]; count: number }>(buildUrl('/v1/reports', status ? { status } : undefined)),

  // Schedule a recurring report
  scheduleReport: (reportType: string, frequency: string, recipients: string[]) =>
    fetchApi<{ schedule_id: string; status: string }>(
      buildUrl('/v1/reports/schedule'),
      {
        method: 'POST',
        body: JSON.stringify({ report_type: reportType, frequency, recipients }),
      }
    ),

  createWebSocket,
};

export function createWebSocket(channel: string): WebSocket {
  return new WebSocket(`${WS_BASE_URL}/${channel}`);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
