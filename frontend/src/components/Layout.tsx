import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';
import type { AgentInfo, Notification } from '../types';

const TABS = [
  { path: '/', icon: 'dashboard', label: 'Dashboard', tooltip: 'Dashboard' },
  { path: '/invoices', icon: 'receipt_long', label: 'Invoices', tooltip: 'Invoices' },
  { path: '/reconciliation', icon: 'swap_horiz', label: 'Reconciliation', tooltip: 'Reconciliation' },
  { path: '/tax-compliance', icon: 'account_balance', label: 'Tax', tooltip: 'Tax Compliance' },
  { path: '/forecast', icon: 'trending_up', label: 'Forecast', tooltip: 'Forecast' },
  { path: '/reports', icon: 'bar_chart', label: 'Reports', tooltip: 'Reports' },
  { path: '/agent-console', icon: 'memory', label: 'Agent Console', tooltip: 'Agent Console' },
];

const CONTEXT_ITEMS = [
  { id: 'company', label: 'Company', value: 'Sovereign Asset Group' },
  { id: 'fiscal', label: 'Fiscal Year', value: 'FY 2024' },
  { id: 'currency', label: 'Base Currency', value: 'SGD' },
  { id: 'gst', label: 'GST Status', value: 'Registered', status: 'ok' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: 'warning', urgent: true, title: 'GST Filing Due', description: 'SG GST F5 filing due in 3 days', timestamp: '2h ago' },
  { id: '2', icon: 'check_circle', urgent: false, title: 'Reconciliation Complete', description: '142/142 items matched', timestamp: '4h ago' },
  { id: '3', icon: 'description', urgent: false, title: 'Report Generated', description: 'Q3 Board Pack ready to review', timestamp: '1d ago' },
];

const FISCAL_YEARS = ['FY 2024', 'FY 2025'];
const CURRENCIES = ['SGD', 'USD', 'EUR', 'IDR', 'MYR', 'THB', 'PHP'];

function AgentDots({ agents }: { agents: AgentInfo[] }) {
  const colors: Record<string, string> = {
    active: 'bg-primary',
    idle: 'bg-amber-400',
    error: 'bg-error',
    paused: 'bg-outline',
  };
  if (!agents.length) {
    return (
      <div className="flex items-center gap-1.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-surface-container-high" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      {agents.slice(0, 6).map((a) => (
        <div
          key={a.agent}
          className={`w-2 h-2 rounded-full ${colors[a.status] || 'bg-surface-container-high'} ${a.status === 'active' ? 'animate-pulse' : ''}`}
          title={`${a.agent}: ${a.status}`}
        />
      ))}
    </div>
  );
}

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [fiscalYear, setFiscalYear] = useState('FY 2024');
  const [currency, setCurrency] = useState('SGD');
  const [cashRunway] = useState(8.4);
  const [contextItems] = useState(CONTEXT_ITEMS);
  const notifRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch agent status
  useEffect(() => {
    api.getAgentStatus()
      .then((res) => setAgents(res.agents || []))
      .catch(() => {});
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        setCmdOpen(false);
        setNotifOpen(false);
        return;
      }

      // U = Upload Invoice (from any tab)
      if (e.key === 'u' && !e.metaKey && !e.ctrlKey && !isInput) {
        e.preventDefault();
        navigate('/invoices');
        return;
      }

      // F = Focus search (if search exists on page)
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !isInput) {
        e.preventDefault();
        const searchEl = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchEl?.focus();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  // Close notif on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((result: { type: string; id: string }) => {
    setCmdOpen(false);
    setCmdQuery('');
    if (result.type === 'invoice') navigate(`/invoices`);
    else if (result.type === 'report') navigate(`/reports/library`);
    else if (result.type === 'vendor') navigate(`/invoices/vendors`);
    else navigate('/');
  }, [navigate]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const isLight = theme === 'light';
  const runwayColor = cashRunway < 3 ? 'text-error' : cashRunway < 6 ? 'text-amber-400' : 'text-primary';

  return (
    <>
      {/* ── Left Sidebar (52px icon nav) ── */}
      <nav className="fixed left-0 top-0 h-full w-[52px] bg-surface flex flex-col items-center py-4 gap-1 z-50 border-r border-outline-variant">
        {/* Logo mark */}
        <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center mb-3 shrink-0">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
        </div>

        {/* Tab Icons */}
        <div className="flex flex-col gap-0.5 w-full px-1.5">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
              title={tab.tooltip}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {tab.tooltip}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Settings at bottom */}
        <div className="mt-auto w-full px-1.5">
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`
            }
            title="Help"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-surface-container-highest text-on-surface text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Help
            </span>
          </NavLink>
        </div>
      </nav>

      {/* ── Context Panel (240px) ── */}
      <aside className="fixed left-[52px] top-0 h-full w-[240px] bg-surface flex flex-col z-40 border-r border-outline-variant">
        {/* Company Header */}
        <div className="px-5 py-6 border-b border-outline-variant">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Operational Focus</p>
          <h2 className="text-sm font-bold text-on-surface tracking-tight">Sovereign Asset Group</h2>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Enterprise Dashboard</p>
        </div>

        {/* Context Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-1">
          {contextItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{item.label}</span>
              <span className={`text-[11px] font-semibold ${
                item.status === 'ok' ? 'text-primary' : 'text-on-surface'
              }`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* GST Status Banner */}
        <div className="mx-4 mb-4 p-3 rounded-lg bg-primary-container/20 border border-primary/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-[10px] font-bold text-primary">GST Registered — All Jurisdictions Active</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="min-h-screen flex flex-col" style={{ marginLeft: '292px' }}>
        {/* 48px Global Header */}
        <header className="h-12 flex items-center justify-between px-6 bg-surface sticky top-0 z-30 border-b border-outline-variant shrink-0">
          {/* Left: Command Palette */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low hover:bg-surface-container-high transition-all w-64"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
            <span className="text-xs text-on-surface-variant flex-1 text-left">Search financial entities...</span>
            <span className="text-[10px] font-mono text-on-surface-variant/40 bg-surface-container px-1.5 py-0.5 rounded">⌘K</span>
          </button>

          {/* Center: Agent Status Dots + Runway Badge */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <AgentDots agents={agents} />
              <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-tighter hidden lg:block">AI Agents</span>
            </div>
            {/* Cash Runway Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-outline-variant/20 ${runwayColor}`}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <span className="text-[11px] font-bold font-mono">{cashRunway.toFixed(1)} mo</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Period Selector */}
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg px-2 py-1.5 text-[11px] font-mono text-on-surface appearance-none cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              {FISCAL_YEARS.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg px-2 py-1.5 text-[11px] font-mono text-on-surface appearance-none cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 hover:bg-surface-container-high rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl border border-outline-variant shadow-2xl z-[70] overflow-hidden">
                    <div className="px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                      <span className="text-sm font-bold text-on-surface">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-[10px] text-primary hover:underline font-semibold">
                            Mark all read
                          </button>
                        )}
                        <span className="text-[10px] text-on-surface-variant">{unreadCount} unread</span>
                      </div>
                    </div>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant last:border-0 ${n.urgent ? 'border-l-2 border-l-error' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`material-symbols-outlined text-sm mt-0.5 ${n.urgent ? 'text-error' : 'text-primary'}`}>{n.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">{n.title}</p>
                            <p className="text-[11px] text-on-surface-variant mt-0.5">{n.description}</p>
                            <p className="text-[10px] text-on-surface-variant mt-1 opacity-60">{n.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2.5 border-t border-outline-variant text-center">
                      <button className="text-xs font-semibold text-primary hover:underline">View all notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-all"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <span className="material-symbols-outlined text-on-surface-variant">{isLight ? 'dark_mode' : 'light_mode'}</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer ml-1">
              <img
                alt="User"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJoc3dbfORt1gHTuqacgTtIuR_jGfL0qjuEgjahQLRW-LhWX0wAgjPbHI4cc5alDnjJoJUamni2oBtTOI9PKKuo_DGdIkXoE3EH-BuMtXH-a2vvZWgRFwhFxymUqFx_mbykv-uiI1oEBknS2oQrIsmg2GkN6IQgfEamYKptRk9YPGXOItsir-yp_q-AywsDlkENzYxpATqY1PAJAfRS8WzlhSDX_ILDqQ4zDeCb49FDuILCCQpnil7NmUzgKjk4Btvaj32M2E1ipav"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* ── Command Palette Modal ── */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setCmdOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40"
                placeholder="Search invoices, reports, vendors, tax records..."
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cmdQuery.trim()) {
                    handleSearch({ type: 'invoice', id: cmdQuery });
                  }
                }}
              />
              <span className="text-[10px] font-mono text-on-surface-variant/40 bg-surface-container px-1.5 py-0.5 rounded">ESC</span>
            </div>

            {/* Quick Results */}
            <div className="p-3 max-h-80 overflow-y-auto">
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-2 mb-2">Quick Actions</p>
              {[
                { icon: 'upload_file', label: 'Upload Invoice', shortcut: 'U', action: () => { setCmdOpen(false); navigate('/invoices'); } },
                { icon: 'sync_alt', label: 'Run Reconciliation', shortcut: 'R', action: () => { setCmdOpen(false); navigate('/reconciliation'); } },
                { icon: 'description', label: 'Generate Report', shortcut: 'G', action: () => { setCmdOpen(false); navigate('/reports/generate'); } },
                { icon: 'trending_up', label: 'View Forecast', shortcut: 'F', action: () => { setCmdOpen(false); navigate('/forecast'); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container transition-colors group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">{item.icon}</span>
                  <span className="text-sm text-on-surface flex-1 text-left">{item.label}</span>
                  <span className="text-[10px] font-mono text-on-surface-variant/40 bg-surface-container px-1.5 py-0.5 rounded">{item.shortcut}</span>
                </button>
              ))}

              {cmdQuery.trim() && (
                <>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-2 mb-2 mt-3">Search Results</p>
                  <button
                    onClick={() => handleSearch({ type: 'invoice', id: cmdQuery })}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
                    <span className="text-sm text-on-surface flex-1 text-left">Invoices matching "{cmdQuery}"</span>
                    <span className="text-[10px] font-mono text-on-surface-variant/40">Enter ↵</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for keyboard-triggered upload */}
      <input ref={uploadInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
    </>
  );
}
