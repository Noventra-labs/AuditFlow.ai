'use client';

const invoices = [
  { id: 'AWS-2024-0891', vendor: 'AWS Singapore', amount: 'USD 4,590.00', date: '2024-11-01', due: '2024-12-01', status: 'reconciled', confidence: 0.97 },
  { id: 'WW-SG-44821', vendor: 'WeWork Southeast Asia', amount: 'SGD 3,488.00', date: '2024-11-15', due: '2024-11-30', status: 'reconciled', confidence: 0.95 },
  { id: 'GFB-2024-1102', vendor: 'Grab for Business', amount: 'SGD 961.74', date: '2024-12-01', due: '2024-12-31', status: 'parsed', confidence: 0.89 },
  { id: 'TP-INV-78234', vendor: 'PT Tokopedia', amount: 'IDR 17,316,000', date: '2024-12-05', due: '2025-01-19', status: 'manual_review', confidence: 0.72 },
  { id: 'FIG-ENT-2024-12', vendor: 'Figma Inc', amount: 'USD 540.00', date: '2024-12-10', due: '2025-01-10', status: 'validated', confidence: 0.99 },
];

const statusLabels: Record<string, string> = {
  reconciled: '✓ Reconciled',
  parsed: '◉ Parsed',
  manual_review: '⚠ Review',
  validated: '✓ Validated',
  rejected: '✕ Rejected',
};

export default function InvoiceTable() {
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
            <td>{inv.vendor}</td>
            <td style={{ fontWeight: 600 }}>{inv.amount}</td>
            <td>{inv.due}</td>
            <td>
              <span className={`status-pill ${inv.status}`}>
                <span className="status-dot" />
                {statusLabels[inv.status]}
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
                    width: `${inv.confidence * 100}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: inv.confidence > 0.9 ? '#34d399' : inv.confidence > 0.8 ? '#fb923c' : '#f87171',
                  }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {(inv.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
