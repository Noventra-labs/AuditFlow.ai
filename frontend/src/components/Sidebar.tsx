'use client';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navSections = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'command', label: 'AI Command', icon: '⚡' },
    ],
  },
  {
    title: 'Financial Ops',
    items: [
      { id: 'invoices', label: 'Invoices', icon: '📄' },
      { id: 'reconciliation', label: 'Reconciliation', icon: '🔗' },
      { id: 'transactions', label: 'Transactions', icon: '🏦' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'forecast', label: 'Cash Forecast', icon: '📈' },
      { id: 'tax', label: 'Tax Compliance', icon: '🏛️' },
      { id: 'reports', label: 'Reports', icon: '📋' },
      { id: 'alerts', label: 'Alerts', icon: '🔔' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'agents', label: 'Agent Monitor', icon: '🤖' },
      { id: 'audit', label: 'Audit Trail', icon: '🔍' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <h1>FinancePilot</h1>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="nav-section">
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px'
          }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>CFO User</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TechPulse Pte Ltd</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
