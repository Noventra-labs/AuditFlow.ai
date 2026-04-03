'use client';

import { useState, useEffect } from 'react';
import { api, Invoice } from '@/lib/api';

interface InvoiceWithDisplay extends Invoice {
  displayAmount: string;
  displayDate: string;
  displayDue: string;
}

const statusLabels: Record<string, string> = {
  reconciled: '✓ Reconciled',
  parsed: '◉ Parsed',
  manual_review: '⚠ Review',
  validated: '✓ Validated',
  rejected: '✕ Rejected',
  processing: '⟳ Processing',
};

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<InvoiceWithDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await api.getInvoices();

        // Transform API data for display
        const formattedInvoices: InvoiceWithDisplay[] = response.invoices.map((inv) => ({
          ...inv,
          displayAmount: inv.amount || 'SGD 0.00',
          displayDate: inv.created_at
            ? new Date(inv.created_at).toLocaleDateString('en-GB')
            : inv.date || '-',
          displayDue: inv.due_date
            ? new Date(inv.due_date).toLocaleDateString('en-GB')
            : inv.due || '-',
        }));

        setInvoices(formattedInvoices);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
        setError('Failed to load invoices');
        // Fallback to empty state - no mock data
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
    // Refresh every 30 seconds
    const interval = setInterval(fetchInvoices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading invoices...
      </div>
    );
  }

  if (error && invoices.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#f87171' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
          style={{ marginTop: '16px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No invoices found</p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>
          Invoices will appear here when they are processed
        </p>
      </div>
    );
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Vendor</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>AI Score</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id}>
            <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{inv.id}</td>
            <td>{inv.vendor || 'Unknown Vendor'}</td>
            <td style={{ fontWeight: 600 }}>{inv.displayAmount}</td>
            <td>{inv.displayDue}</td>
            <td>
              <span className={`status-pill ${inv.status}`}>
                <span className="status-dot" />
                {statusLabels[inv.status] || inv.status}
              </span>
            </td>
            <td>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <div style={{
                  width: '50px', height: '4px', borderRadius: '2px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(inv.confidence || 0.5) * 100}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: (inv.confidence || 0) > 0.9 ? '#34d399' : (inv.confidence || 0) > 0.8 ? '#fb923c' : '#f87171',
                  }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {((inv.confidence || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
