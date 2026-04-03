'use client';

const metrics = [
  {
    label: 'Cash Balance',
    value: 'SGD 189,772',
    change: '+12.4%',
    positive: true,
    color: '#4f8cff',
  },
  {
    label: 'Outstanding AR',
    value: 'SGD 21,906',
    change: '5 invoices',
    positive: true,
    color: '#a78bfa',
  },
  {
    label: 'Reconciled (MTD)',
    value: '87%',
    change: '+5.2%',
    positive: true,
    color: '#34d399',
  },
  {
    label: 'Cash Runway',
    value: '14 months',
    change: 'Base scenario',
    positive: true,
    color: '#22d3ee',
  },
];

export default function MetricCards() {
  return (
    <div className="metric-grid">
      {metrics.map((m) => (
        <div key={m.label} className="metric-card card">
          <div className="metric-label">{m.label}</div>
          <div className="metric-value" style={{ color: m.color }}>
            {m.value}
          </div>
          <div className={`metric-change ${m.positive ? 'positive' : 'negative'}`}>
            {m.positive ? '↑' : '↓'} {m.change}
          </div>
        </div>
      ))}
    </div>
  );
}
