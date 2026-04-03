'use client';

const alerts = [
  {
    id: '1',
    severity: 'critical',
    type: 'low_runway',
    message: 'Conservative cash runway is only 9 months. Review expense trends.',
    time: '1h ago',
    icon: '🚨',
  },
  {
    id: '2',
    severity: 'high',
    type: 'overdue_invoice',
    message: 'PT Tokopedia invoice 45 days overdue — IDR 17,316,000',
    time: '2h ago',
    icon: '⚠️',
  },
  {
    id: '3',
    severity: 'high',
    type: 'tax_deadline',
    message: 'Singapore GST filing deadline in 12 days. Net payable: SGD 4,280.',
    time: '3h ago',
    icon: '🏛️',
  },
  {
    id: '4',
    severity: 'medium',
    type: 'unusual_transaction',
    message: 'Unusual outflow: SGD 42,000 (Staff Salaries) — 3.2x average transaction.',
    time: '5h ago',
    icon: '💰',
  },
  {
    id: '5',
    severity: 'medium',
    type: 'unmatched_reconciliation',
    message: 'Grab for Business invoice (SGD 961.74) unmatched for 5 days.',
    time: '6h ago',
    icon: '🔗',
  },
];

const severityStyles: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', text: '#f87171' },
  high: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)', text: '#fb923c' },
  medium: { bg: 'rgba(79,140,255,0.06)', border: 'rgba(79,140,255,0.2)', text: '#4f8cff' },
};

export default function AlertsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
      {alerts.map((alert) => {
        const style = severityStyles[alert.severity] || severityStyles.medium;
        return (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              gap: '14px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: style.bg,
              border: `1px solid ${style.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{alert.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px',
                  fontWeight: 700, color: style.text,
                }}>
                  {alert.severity}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
