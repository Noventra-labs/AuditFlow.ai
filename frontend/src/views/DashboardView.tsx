import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { Invoice, AgentInfo, AlertsResponse, ForecastResponse, WSEvent } from '../types';
import { SkeletonKpiStrip, SkeletonChart, SkeletonAgentFeed, SkeletonDeadlineList, SkeletonCard } from '../components/SkeletonLoader';

type Period = '7d' | '30d' | '90d' | 'ytd';

const PERIOD_LABELS: Record<Period, string> = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days', ytd: 'Year to Date' };

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkData: number[];
  sparkColor: string;
  staleness: string;
  onClick?: () => void;
}

function KpiCard({ label, value, delta, deltaPositive, sparkData, sparkColor, staleness, onClick }: KpiCard) {
  return (
    <button
      onClick={onClick}
      className="bg-surface p-5 flex flex-col gap-2 hover:bg-surface-container transition-colors text-left w-full border-r border-outline-variant/5 last:border-r-0"
    >
      <div className="flex items-start justify-between">
        <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest">{label}</p>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${deltaPositive ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
          {delta}
        </span>
      </div>
      <p className="text-2xl font-instrument text-on-surface leading-none">{value}</p>
      <div className="flex items-end justify-between mt-1">
        <Sparkline data={sparkData} color={sparkColor} />
        <span className="text-[9px] font-mono text-on-surface-variant/40">{staleness}</span>
      </div>
    </button>
  );
}

interface Deadline {
  id: string;
  icon: string;
  title: string;
  date: string;
  urgency: 'today' | 'week' | 'month';
}

function DeadlineCard({ deadline }: { deadline: Deadline }) {
  const urgencyColors = { today: 'border-error/50 bg-error/5', week: 'border-amber-500/50 bg-amber-500/5', month: 'border-primary/50 bg-primary/5' };
  const urgencyBadge = { today: 'bg-error/20 text-error', week: 'bg-amber-500/20 text-amber-400', month: 'bg-primary/20 text-primary' };
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${urgencyColors[deadline.urgency]}`}>
      <div className={`w-7 h-7 rounded flex items-center justify-center ${urgencyBadge[deadline.urgency].replace('text-', 'bg-').replace('/20', '')}`}>
        <span className="material-symbols-outlined text-sm">{deadline.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface truncate">{deadline.title}</p>
        <p className="text-[10px] text-on-surface-variant font-mono">{deadline.date}</p>
      </div>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${urgencyBadge[deadline.urgency]}`}>
        {deadline.urgency}
      </span>
    </div>
  );
}

function CashFlowChart({ period }: { period: Period }) {
  const labels = period === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
    period === '30d' ? ['W1', 'W2', 'W3', 'W4', 'W5'] : period === '90d' ?
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const income = [420, 380, 510, 440, 490, 520, 480, 530, 510, 560, 540, 580];
  const expenses = [320, 340, 310, 360, 330, 350, 370, 340, 360, 350, 380, 340];
  const net = income.map((v, i) => v - expenses[i]);

  const maxVal = Math.max(...income, ...expenses);
  const minVal = Math.min(...net);
  const range = maxVal - minVal || 1;

  const h = 220;
  const w = 800;
  const pad = { top: 10, bottom: 30, left: 0, right: 0 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  function toPath(values: number[], fill = false) {
    const pts = values.map((v, i) => {
      const x = pad.left + (i / (values.length - 1)) * chartW;
      const y = pad.top + chartH - ((v - minVal) / range) * chartH;
      return `${x},${y}`;
    });
    if (fill) {
      const lastX = pad.left + chartW;
      const firstX = pad.left;
      const bottom = pad.top + chartH;
      return `M ${pts.join(' L ')} L ${lastX},${bottom} L ${firstX},${bottom} Z`;
    }
    return `M ${pts.join(' L ')}`;
  }

  const zeroY = pad.top + chartH - ((0 - minVal) / range) * chartH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.top + chartH * t;
          return <line key={t} x1={pad.left} y1={y} x2={pad.left + chartW} y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />;
        })}
        {/* Zero line */}
        <line x1={pad.left} y1={zeroY} x2={pad.left + chartW} y2={zeroY} stroke="white" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Income area */}
        <path d={toPath(income, true)} fill="#62df7d" fillOpacity="0.08" />
        <path d={toPath(income)} fill="none" stroke="#62df7d" strokeWidth="2" strokeLinecap="round" />

        {/* Expenses area */}
        <path d={toPath(expenses, true)} fill="#ffb4ab" fillOpacity="0.06" />
        <path d={toPath(expenses)} fill="none" stroke="#ffb4ab" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" />

        {/* Net line */}
        <path d={toPath(net)} fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between px-4 mt-1">
        {labels.map((l, i) => i % Math.ceil(labels.length / 6) === 0 && (
          <span key={i} className="text-[9px] font-mono text-on-surface-variant/40">{l}</span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardView() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [, setAgentStatus] = useState<AgentInfo[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');
  const [currency] = useState('SGD');
  const [wsConnected, setWsConnected] = useState(false);
  const [wsEvents, setWsEvents] = useState<{ time: string; agent: string; msg: string; status: 'success' | 'error' | 'info' | 'warn'; confidence?: number }[]>([]);
  const [paused, setPaused] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const eventIdRef = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [alertsRes, forecastRes, agentRes, invoicesRes] = await Promise.all([
          api.getAlerts().catch(() => ({ alerts: [], count: 0 })),
          api.getForecast().catch(() => null),
          api.getAgentStatus().catch(() => ({ agents: [] })),
          api.getInvoices().catch(() => ({ invoices: [], count: 0 })),
        ]);
        setAlerts(alertsRes);
        setForecast(forecastRes);
        setAgentStatus(agentRes.agents || []);
        setInvoices(invoicesRes.invoices || []);
      } catch (err) {
        addToast({ variant: 'error', title: 'Dashboard Error', message: err instanceof Error ? err.message : 'Failed to load data' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // WebSocket for agent activity feed
  useEffect(() => {
    const ws = api.createWebSocket('finance:demo-company-001');
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    ws.onmessage = (evt: MessageEvent) => {
      try {
        const data = JSON.parse(evt.data) as WSEvent;
        const now = new Date();
        const status: 'success' | 'error' | 'warn' | 'info' =
          data.type?.includes('error') ? 'error' : data.type?.includes('warning') ? 'warn' : data.type?.includes('complete') ? 'success' : 'info';
        setWsEvents((prev) => {
          const entry = {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            agent: (data.agent || 'SYSTEM').toUpperCase(),
            msg: data.message || data.type || 'Event',
            status,
            confidence: data.confidence ? Math.round(data.confidence * 100) : undefined,
          };
          return [entry, ...prev].slice(0, 20);
        });
      } catch { /* ignore */ }
    };
    return () => { ws.close(); };
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    if (!paused && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [wsEvents, paused]);

  const revenue = invoices.reduce((s, i) => s + parseFloat(String(i.amount || '0')), 0) * 0.1;
  const expenses = revenue * 0.63;
  const netPnl = revenue - expenses;
  const arOutstanding = revenue * 0.28;
  const cashRunway = forecast?.forecast?.runway_months ?? 8.4;
  const gstLiability = 64310;
  const activeAlerts = alerts?.alerts?.filter((a) => a.severity === 'critical' || a.severity === 'high') ?? [];

  // Spec: cash runway < 30 days triggers alert banner
  const showAlertBanner = cashRunway < 1 || activeAlerts.length > 0;

  const deadlines: Deadline[] = [
    { id: '1', icon: 'event_busy', title: 'GST F5 Filing — Singapore', date: 'Nov 13, 2024', urgency: 'today' },
    { id: '2', icon: 'request_quote', title: 'Q3 Invoice Reconciliation', date: 'Nov 15, 2024', urgency: 'week' },
    { id: '3', icon: 'payments', title: 'Vendor Payment Run — AWS', date: 'Nov 20, 2024', urgency: 'week' },
    { id: '4', icon: 'account_balance', title: 'MY SST Return Due', date: 'Nov 30, 2024', urgency: 'month' },
    { id: '5', icon: 'description', title: 'Monthly Board Pack', date: 'Dec 1, 2024', urgency: 'month' },
  ];

  const formatCurrency = (v: number, curr = currency) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(v);

  const sparkRevenue = [310, 340, 320, 380, 360, 400, 420];
  const sparkExpenses = [210, 220, 200, 230, 210, 240, 220];
  const sparkNet = [100, 120, 120, 150, 150, 160, 200];
  const sparkAr = [280, 290, 285, 300, 295, 310, 320];
  const sparkRunway = [9.1, 8.8, 9.0, 8.5, 8.4, 8.6, 8.4];

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1600px]">
        <SkeletonKpiStrip />
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-9">
            <SkeletonChart />
          </div>
          <div className="col-span-3">
            <SkeletonAgentFeed />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-4">
            <SkeletonDeadlineList />
          </div>
          <div className="col-span-8">
            <SkeletonCard className="h-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 max-w-[1600px]">
      {/* ── Alert Banner ── */}
      {showAlertBanner && (
        <div className="flex items-center justify-between px-5 py-3 bg-error/10 border border-error/20 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-lg">warning</span>
            <span className="text-xs font-bold text-error">
              {cashRunway < 1
                ? `Cash runway ${(cashRunway * 30).toFixed(0)} days — below 30 day threshold`
                : `${activeAlerts.length} active alert(s) require attention`}
            </span>
          </div>
          <button onClick={() => navigate('/tax-compliance')} className="text-[10px] font-bold uppercase tracking-widest text-error hover:underline">
            Resolve Now
          </button>
        </div>
      )}

      {/* ── 6-KPI Strip ── */}
      <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant/10 grid grid-cols-6 divide-x divide-outline-variant/10">
        <KpiCard
          label="Revenue MTD"
          value={formatCurrency(revenue)}
          delta="+12.4%"
          deltaPositive
          sparkData={sparkRevenue}
          sparkColor="#62df7d"
          staleness="2m ago"
          onClick={() => navigate('/invoices')}
        />
        <KpiCard
          label="Expenses MTD"
          value={formatCurrency(expenses)}
          delta="+4.2%"
          deltaPositive={false}
          sparkData={sparkExpenses}
          sparkColor="#ffb4ab"
          staleness="2m ago"
        />
        <KpiCard
          label="Net P&L"
          value={formatCurrency(netPnl)}
          delta="+18.2%"
          deltaPositive
          sparkData={sparkNet}
          sparkColor="#62df7d"
          staleness="2m ago"
        />
        <KpiCard
          label="AR Outstanding"
          value={formatCurrency(arOutstanding)}
          delta="+2.1%"
          deltaPositive={false}
          sparkData={sparkAr}
          sparkColor="#ffb4ab"
          staleness="5m ago"
          onClick={() => navigate('/invoices')}
        />
        <KpiCard
          label="Cash Runway"
          value={`${cashRunway.toFixed(1)} mo`}
          delta={cashRunway < 6 ? 'Below target' : 'Healthy'}
          deltaPositive={cashRunway >= 6}
          sparkData={sparkRunway}
          sparkColor={cashRunway < 3 ? '#ffb4ab' : '#62df7d'}
          staleness="1m ago"
          onClick={() => navigate('/forecast')}
        />
        <KpiCard
          label="GST Liability"
          value={formatCurrency(gstLiability)}
          delta="+3.1%"
          deltaPositive={false}
          sparkData={sparkNet}
          sparkColor="#ffb4ab"
          staleness="1d ago"
          onClick={() => navigate('/tax-compliance')}
        />
      </div>

      {/* ── Main Chart + Agent Feed ── */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Cash Flow Chart */}
        <div className="col-span-9 bg-surface rounded-xl p-6 border border-outline-variant/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Cash Flow Velocity</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Real-time projection vs actual performance</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Period Toggle */}
              <div className="flex gap-1 bg-surface-container rounded-lg p-1">
                {(['7d', '30d', '90d', 'ytd'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-colors ${
                      period === p ? 'bg-primary text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {PERIOD_LABELS[p]}
                  </button>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-[10px] text-on-surface-variant">Income</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-error border border-error dashed"></span><span className="text-[10px] text-on-surface-variant">Expenses</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-on-surface"></span><span className="text-[10px] text-on-surface-variant">Net</span></div>
              </div>
            </div>
          </div>
          <CashFlowChart period={period} />
        </div>

        {/* Live Agent Activity Feed */}
        <div className="col-span-3 bg-surface rounded-xl flex flex-col border border-outline-variant/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10 bg-surface-container-high/30">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-primary animate-pulse' : 'bg-error'}`}></span>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent Feed</h4>
            </div>
            <button
              onClick={() => setPaused((p) => !p)}
              className="text-[9px] font-mono text-on-surface-variant/60 hover:text-on-surface uppercase"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
          <div
            ref={feedRef}
            className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1.5"
          >
            {wsEvents.length === 0 ? (
              <p className="text-on-surface-variant/30">Connecting to agent stream...</p>
            ) : (
              wsEvents.map((evt) => (
                <div key={eventIdRef.current++} className="flex gap-2 flex-wrap">
                  <span className="text-on-surface-variant/40 shrink-0">[{evt.time}]</span>
                  <span className={`shrink-0 ${evt.status === 'success' ? 'text-primary' : evt.status === 'error' ? 'text-error' : evt.status === 'warn' ? 'text-amber-400' : 'text-on-surface-variant'}`}>
                    [{evt.agent}]
                  </span>
                  <span className="text-on-surface/60">{evt.msg}</span>
                  {evt.confidence && <span className="text-primary/60 shrink-0">[{evt.confidence}%]</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Deadlines + Quick Actions ── */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Upcoming Deadlines */}
        <div className="col-span-4 bg-surface rounded-xl p-5 border border-outline-variant/5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Upcoming Deadlines</h4>
          <div className="space-y-2">
            {deadlines.map((d) => <DeadlineCard key={d.id} deadline={d} />)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-8 flex flex-col gap-4">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/invoices')}
              className="flex-1 py-4 bg-primary text-on-primary-container font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Upload Invoice
            </button>
            <button
              onClick={async () => {
                try {
                  addToast({ variant: 'info', title: 'Running Reconciliation', message: 'Processing all unmatched invoices...' });
                  const result = await api.triggerReconciliation();
                  addToast({ variant: 'success', title: 'Reconciliation Complete', message: `Session: ${result.session_id} — ${result.status}`, statusCode: 200 });
                } catch (err) {
                  const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                  addToast({ variant: 'error', title: 'Reconciliation Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
                }
              }}
              className="flex-1 py-4 bg-surface-container text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-all border border-outline-variant/10 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">sync_alt</span>
              Run Reconciliation
            </button>
            <button
              onClick={async () => {
                try {
                  addToast({ variant: 'info', title: 'Exporting', message: 'Preparing summary...' });
                  const blob = await api.exportCSV('invoices');
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `dashboard-summary-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  addToast({ variant: 'success', title: 'Export Complete', message: 'Summary downloaded', statusCode: 200 });
                } catch (err) {
                  const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                  addToast({ variant: 'error', title: 'Export Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
                }
              }}
              className="flex-1 py-4 bg-transparent text-primary border border-primary/30 font-bold rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">ios_share</span>
              Export Summary
            </button>
          </div>

          {/* Integrations */}
          <div className="bg-surface rounded-xl p-5 border border-outline-variant/5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Integrations</p>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center">
                <img alt="Quickbooks" className="w-6 h-6 grayscale brightness-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqzCBpMyfctWQGsRFx6v9BI-pNxd78-9CEzSZfUqWVs8mIL6PiU-DTVuFpA7BbXWveBtpzb76nJC9z7vFWoqlm7xE1SC8XdI-OkJiugU7LxkqapFIRLLlPdg1U0ngPRZEIZ4gqxmIYkrlR3ahLqYL1lZRFjg6lbOKOKv8bBXrV9ZVkSmwSAa-sQzC_egFprWnc_NwP3vcb7gkstzbLMysYWUWCikUS2svEGkAbEFokYTVrEl-x7nC1gb87QcOXJ5wE9EezB_45Lc" />
              </div>
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center">
                <img alt="Stripe" className="w-6 h-6 grayscale brightness-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAQ2gIZKQGo9JWhcLHe_fsWdcVVCkub6Rw9dPDot7k4EU_4FpwGUKcFo660lmDQVxqCP9PbG2lAubOmX-fSJgo-LCWWY7QYreqADJEOqiSQpB2qFV6qLYN9CAWg8sPDBCmPlfsQRjPATUS_b_4CCwU_2X3BkUjfFKoBh0lPYDOMjXV9vRGN01PuyroFS_5uFBdzty4_AGZMWXzSLXpw-vS894_YgR4R_RUVWI-CcU08T4DBz2C4x4c3GfW4oWNCIz-c52T2NfEoX2L" />
              </div>
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">add</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                <span>3 connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
