import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { AgentInfo, WSEvent } from '../types';

// ── AuditFlow Agent Definitions ──────────────────────────────────────────

const FINANCE_AGENTS: AgentInfo[] = [
  {
    agent: 'Invoice Parser',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Watching Gmail for new invoice attachments',
    avg_latency_ms: 420,
    tasks_completed_today: 38,
    error_rate: '0.0%',
  },
  {
    agent: 'Reconciliation',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Matching invoices to bank transactions',
    avg_latency_ms: 1240,
    tasks_completed_today: 142,
    error_rate: '0.2%',
  },
  {
    agent: 'Tax Compliance',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Checking thresholds and filing deadlines across 5 jurisdictions',
    avg_latency_ms: 890,
    tasks_completed_today: 24,
    error_rate: '0.0%',
  },
  {
    agent: 'Forecast',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Computing 90-day conservative / base / optimistic scenarios',
    avg_latency_ms: 2100,
    tasks_completed_today: 8,
    error_rate: '0.0%',
  },
  {
    agent: 'Report',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Assembling P&L statement and Board Pack documents',
    avg_latency_ms: 5600,
    tasks_completed_today: 5,
    error_rate: '0.0%',
  },
  {
    agent: 'Alert',
    status: 'idle',
    last_activity: new Date().toISOString(),
    last_task_description: 'Monitoring overdue invoices and cash runway thresholds',
    avg_latency_ms: 180,
    tasks_completed_today: 412,
    error_rate: '0.0%',
  },
];

const AGENT_COLORS: Record<string, string> = {
  'Invoice Parser': '#62df7d',
  'Reconciliation': '#f59e0b',
  'Tax Compliance': '#8b5cf6',
  'Forecast': '#06b6d4',
  'Report': '#D4AF37',
  'Alert': '#ec4899',
};

type NavKey = 'terminal' | 'agents' | 'troubleshoot' | 'insights' | 'history';

interface LiveEvent {
  id: number;
  time: string;
  agent: string;
  action: string;
  mcp_tool?: string;
  status: 'SUCCESS' | 'TIMEOUT' | 'ERROR' | 'TOOL_CALL';
  confidence: number;
  latency_ms?: number;
  token_count?: number;
}

const SEED_EVENTS: LiveEvent[] = [
  { id: 1, time: '09:41:02', agent: 'Invoice Parser', action: 'gmail_mcp.watch_inbox', status: 'TOOL_CALL', confidence: 100 },
  { id: 2, time: '09:41:04', agent: 'Invoice Parser', action: 'invoice.parse — INV-2024-1042', mcp_tool: 'claude_api', status: 'SUCCESS', confidence: 94.2, latency_ms: 1240, token_count: 4821 },
  { id: 3, time: '09:41:06', agent: 'Tax Compliance', action: 'web_search.get_tax_rate', status: 'TOOL_CALL', confidence: 100 },
  { id: 4, time: '09:41:08', agent: 'Tax Compliance', action: 'Singapore GST 9% applied to S$42,000', mcp_tool: 'supabase_mcp', status: 'SUCCESS', confidence: 100, latency_ms: 89 },
  { id: 5, time: '09:41:10', agent: 'Reconciliation', action: 'finance.reconcile topic received', status: 'TOOL_CALL', confidence: 100 },
  { id: 6, time: '09:41:12', agent: 'Reconciliation', action: 'Matched INV-2024-1042 to BDO txn #4821', mcp_tool: 'supabase_mcp', status: 'SUCCESS', confidence: 97.8, latency_ms: 342 },
  { id: 7, time: '09:41:15', agent: 'Alert', action: 'overdue_invoice.check — 7 days past due', status: 'TOOL_CALL', confidence: 100 },
  { id: 8, time: '09:41:16', agent: 'Alert', action: 'Notification created for overdue INV-2024-0991', mcp_tool: 'calendar_mcp', status: 'SUCCESS', confidence: 100, latency_ms: 120 },
];

export default function AgentConsoleView() {
  const { addToast } = useToast();
  const [agents, setAgents] = useState<AgentInfo[]>(FINANCE_AGENTS);
  const [events, setEvents] = useState<LiveEvent[]>(SEED_EVENTS);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>('terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [pausedAgents, setPausedAgents] = useState<Set<string>>(new Set());
  const [filterAgent, setFilterAgent] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<LiveEvent | null>(null);
  const eventIdRef = useRef(999);
  const wsRef = useRef<WebSocket | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const connectWs = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    const ws = api.createWebSocket('finance:demo-company-001');
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    ws.onmessage = (evt: MessageEvent) => {
      try {
        const data = JSON.parse(evt.data) as WSEvent & { action?: string; mcp_tool?: string; latency_ms?: number; token_count?: number };
        const now = new Date();
        const agentName = data.agent || 'Invoice Parser';
        const newEvt: LiveEvent = {
          id: eventIdRef.current++,
          time: now.toLocaleTimeString('en-US', { hour12: false }),
          agent: agentName,
          action: data.type || 'agent.event',
          mcp_tool: data.mcp_tool,
          status: data.type?.includes('error') ? 'ERROR' : 'SUCCESS',
          confidence: data.confidence ? Math.round(data.confidence * 100) : 98,
          latency_ms: data.latency_ms,
          token_count: data.token_count,
        };
        setEvents((prev) => [newEvt, ...prev].slice(0, 500));
        setAgents((prev) =>
          prev.map((a) =>
            a.agent === agentName ? { ...a, last_activity: now.toISOString(), status: 'idle' } : a
          )
        );
      } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    connectWs();
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [connectWs]);

  // Simulate live events when WS is disconnected
  useEffect(() => {
    if (wsConnected) return;
    const id = setInterval(() => {
      const agentNames = FINANCE_AGENTS.map((a) => a.agent);
      const agent = agentNames[Math.floor(Math.random() * agentNames.length)];
      const statuses: LiveEvent['status'][] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'TOOL_CALL', 'ERROR'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const actions: Record<string, string[]> = {
        'Invoice Parser': ['invoice.parse', 'gmail_mcp.download_attachment', 'claude_api.extract_fields'],
        'Reconciliation': ['bank.match_candidates', 'supabase_mcp.query_transactions', 'finance.reconcile'],
        'Tax Compliance': ['web_search.get_tax_rate', 'calendar_mcp.create_event', 'supabase_mcp.update_tax_record'],
        'Forecast': ['supabase_mcp.query_ledger', 'forecast.compute_scenarios', 'supabase_mcp.write_forecast'],
        'Report': ['supabase_mcp.query_invoices', 'claude_api.write_narrative', 'gmail_mcp.send_email'],
        'Alert': ['supabase_mcp.check_overdue', 'notification.create', 'calendar_mcp.create_reminder'],
      };
      const agentActions = actions[agent] || ['agent.event'];
      const now = new Date();
      const newEvt: LiveEvent = {
        id: eventIdRef.current++,
        time: now.toLocaleTimeString('en-US', { hour12: false }),
        agent,
        action: agentActions[Math.floor(Math.random() * agentActions.length)],
        status,
        confidence: status === 'SUCCESS' ? Math.round(85 + Math.random() * 15) : 0,
        latency_ms: status === 'SUCCESS' ? Math.round(80 + Math.random() * 800) : undefined,
        token_count: status === 'SUCCESS' ? Math.round(1000 + Math.random() * 8000) : undefined,
      };
      setEvents((prev) => [newEvt, ...prev].slice(0, 500));
    }, 2800);
    return () => clearInterval(id);
  }, [wsConnected]);

  function togglePauseAgent(agentName: string) {
    setPausedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentName)) {
        next.delete(agentName);
        addToast({ variant: 'success', title: 'Agent Resumed', message: `${agentName} is now active` });
      } else {
        next.add(agentName);
        addToast({ variant: 'info', title: 'Agent Paused', message: `${agentName} has stopped processing new tasks` });
      }
      return next;
    });
  }

  function handleClearMemory(agentName: string) {
    setAgents((prev) =>
      prev.map((a) =>
        a.agent === agentName
          ? { ...a, tasks_completed_today: 0, last_activity: new Date().toISOString() }
          : a
      )
    );
    addToast({ variant: 'info', title: 'Memory Cleared', message: `${agentName} working memory wiped` });
  }

  function handlePauseAll() {
    setPausedAgents(new Set(FINANCE_AGENTS.map((a) => a.agent)));
    if (wsRef.current) wsRef.current.close();
    setWsConnected(false);
    addToast({ variant: 'warning', title: 'All Agents Paused', message: 'Resume to continue processing' });
  }

  function handleResumeAll() {
    setPausedAgents(new Set());
    connectWs();
    addToast({ variant: 'success', title: 'All Agents Resumed', message: 'System is back online' });
  }

  function getStatusColor(status: string) {
    if (status === 'SUCCESS') return 'text-primary';
    if (status === 'ERROR' || status === 'TIMEOUT') return 'text-error';
    if (status === 'TOOL_CALL') return 'text-amber-400';
    return 'text-on-surface-variant';
  }

  function getAgentDotColor(agentName: string, status: AgentInfo['status']) {
    if (pausedAgents.has(agentName)) return 'bg-outline';
    if (status === 'error') return 'bg-error';
    if (status === 'active') return 'bg-primary animate-pulse';
    return 'bg-amber-400';
  }

  function filteredEvents() {
    let evts = events;
    if (filterAgent) evts = evts.filter((e) => e.agent === filterAgent);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      evts = evts.filter(
        (e) =>
          e.agent.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.mcp_tool?.toLowerCase().includes(q)
      );
    }
    return evts;
  }

  function renderTerminal() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-instrument text-3xl italic text-on-surface">Live Agent Stream</h2>
            <p className="text-xs text-on-surface-variant mt-1">Real-time view of all AuditFlow agent activity</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResumeAll}
              className="bg-primary text-on-primary-container px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span> Resume All
            </button>
            <button
              onClick={handlePauseAll}
              className="bg-surface-container text-on-surface px-3 py-1.5 rounded text-xs font-bold border border-outline-variant hover:text-error transition-all"
            >
              <span className="material-symbols-outlined text-sm">pause</span> Pause All
            </button>
          </div>
        </div>

        {/* Agent Cards 3x2 */}
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agent) => {
            const color = AGENT_COLORS[agent.agent] || '#62df7d';
            const isPaused = pausedAgents.has(agent.agent);
            const isActive = agent.status === 'active' && !isPaused;
            return (
              <div
                key={agent.agent}
                className={`bg-surface-container rounded-xl border-l-2 p-5 hover:bg-surface-container-high transition-colors ${
                  isPaused ? 'opacity-50' : ''
                }`}
                style={{ borderLeftColor: color }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {isActive && (
                        <span
                          className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-60"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      <div
                        className={`w-3 h-3 rounded-full ${getAgentDotColor(agent.agent, agent.status)}`}
                      />
                    </div>
                    <span className="font-bold text-on-surface tracking-tight text-[11px]">{agent.agent}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => togglePauseAgent(agent.agent)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title={isPaused ? 'Resume' : 'Pause'}
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={() => handleClearMemory(agent.agent)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
                      title="Clear working memory"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div
                  className="text-[11px] text-on-surface-variant/80 leading-relaxed min-h-[36px] border-b border-outline-variant/10 pb-3 mb-3"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {agent.last_task_description || 'Idle — no active task'}
                </div>
                <div className="flex justify-between items-end text-[10px]">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-0.5">Avg Latency</p>
                    <p className="font-mono" style={{ color }}>
                      {agent.avg_latency_ms?.toLocaleString()}ms
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-0.5">Tasks Today</p>
                    <p className="font-mono text-on-surface">{agent.tasks_completed_today}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-0.5">Error Rate</p>
                    <p className={`font-mono ${agent.error_rate !== '0.0%' ? 'text-error' : 'text-on-surface'}`}>
                      {agent.error_rate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Stream Terminal */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/5">
          <div className="bg-surface-container px-4 py-2.5 flex items-center justify-between border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                <div className="w-2 h-2 rounded-full bg-error/40" />
              </div>
              <span
                className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant"
              >
                auditflow.events_stream
              </span>
              {filterAgent && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                  Filter: {filterAgent}
                  <button onClick={() => setFilterAgent(null)} className="ml-1 hover:text-error">×</button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEvents([])}
                className="text-[10px] font-mono text-on-surface-variant/40 hover:text-on-surface uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest ${
                  wsConnected ? 'text-primary' : 'text-error'
                }`}
              >
                {wsConnected ? '● LIVE' : '○ DISCONNECTED'}
              </span>
            </div>
          </div>

          {/* Event feed */}
          <div
            ref={feedRef}
            className="p-4 h-[320px] overflow-y-auto font-mono text-[12px] space-y-1"
          >
            {filteredEvents().length === 0 && (
              <p className="text-on-surface-variant/30">No events to display.</p>
            )}
            {filteredEvents().map((evt) => (
              <div
                key={evt.id}
                onClick={() => setExpandedEvent(expandedEvent?.id === evt.id ? null : evt)}
                className={`flex gap-2 flex-wrap cursor-pointer px-2 py-1 rounded hover:bg-surface-container/50 transition-colors ${
                  expandedEvent?.id === evt.id ? 'bg-surface-container-high' : ''
                }`}
              >
                <span className="text-on-surface-variant/40 shrink-0">[{evt.time}]</span>
                <span className="shrink-0" style={{ color: AGENT_COLORS[evt.agent] || '#62df7d' }}>
                  [{evt.agent}]
                </span>
                <span className={`shrink-0 ${getStatusColor(evt.status)}`}>[{evt.action}]</span>
                {evt.mcp_tool && (
                  <span className="shrink-0 text-secondary/70">via {evt.mcp_tool}</span>
                )}
                <span className={`shrink-0 ${getStatusColor(evt.status)}`}>
                  [{evt.status}]
                </span>
                {evt.confidence > 0 && (
                  <span className="shrink-0 text-primary/60">{evt.confidence}%</span>
                )}
              </div>
            ))}
          </div>

          {/* Expanded Tool Call Inspector */}
          {expandedEvent && (
            <div className="border-t border-outline-variant/10 p-4 bg-surface-container">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-on-surface">Tool Call Inspector</h4>
                <button onClick={() => setExpandedEvent(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Input</p>
                  <pre className="bg-surface-container-lowest p-3 rounded text-[11px] font-mono text-primary/80 whitespace-pre overflow-auto max-h-32">
{JSON.stringify({
  agent: expandedEvent.agent,
  action: expandedEvent.action,
  mcp_tool: expandedEvent.mcp_tool || 'claude_api',
  timestamp: expandedEvent.time,
}, null, 2)}
                  </pre>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Output</p>
                  <pre className="bg-surface-container-lowest p-3 rounded text-[11px] font-mono text-primary/80 whitespace-pre overflow-auto max-h-32">
{JSON.stringify({
  status: expandedEvent.status,
  confidence: expandedEvent.confidence,
  latency_ms: expandedEvent.latency_ms,
  token_count: expandedEvent.token_count,
}, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="flex gap-6 mt-3 pt-3 border-t border-outline-variant/10">
                {[
                  { label: 'Latency', value: expandedEvent.latency_ms ? `${expandedEvent.latency_ms}ms` : '—' },
                  { label: 'Tokens', value: expandedEvent.token_count?.toLocaleString() || '—' },
                  { label: 'Confidence', value: expandedEvent.confidence > 0 ? `${expandedEvent.confidence}%` : '—' },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">{m.label}</p>
                    <p className="text-sm font-mono text-on-surface">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderAgentsOverview() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-instrument text-3xl italic text-on-surface">Agent Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={handleResumeAll}
              className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded text-xs font-bold hover:opacity-90 disabled:opacity-30 transition-all"
            >
              Resume All
            </button>
            <button
              onClick={handlePauseAll}
              className="bg-surface-container text-outline px-3 py-1.5 rounded text-xs font-bold border border-outline-variant/10 hover:text-error transition-colors"
            >
              Pause All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {agents.map((agent) => {
            const color = AGENT_COLORS[agent.agent] || '#62df7d';
            const isPaused = pausedAgents.has(agent.agent);
            return (
              <div
                key={agent.agent}
                className={`bg-surface-container rounded-xl p-6 border-l-2 hover:bg-surface-container-high transition-colors ${
                  isPaused ? 'opacity-50' : ''
                }`}
                style={{ borderLeftColor: color }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${getAgentDotColor(agent.agent, agent.status)}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface text-sm">{agent.agent}</h3>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 bg-surface-container-high rounded"
                      >
                        {isPaused ? 'PAUSED' : agent.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-on-surface-variant/80 mt-1">
                      {agent.last_task_description || 'Idle'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/10 pt-4">
                  {[
                    {
                      label: 'Avg Latency',
                      value: `${agent.avg_latency_ms?.toLocaleString()}ms`,
                      color,
                    },
                    {
                      label: 'Error Rate',
                      value: agent.error_rate || '0.0%',
                      color: agent.error_rate !== '0.0%' ? 'text-error' : 'text-on-surface',
                    },
                    {
                      label: 'Tasks Today',
                      value: String(agent.tasks_completed_today || 0),
                      color: 'text-on-surface',
                    },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">
                        {m.label}
                      </p>
                      <p className={`font-mono font-bold text-sm ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderTroubleshoot() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-instrument text-3xl italic text-on-surface">Tool Call Inspector</h2>
          <span className="font-mono text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full">
            LIVE SESSION
          </span>
        </div>

        {/* Prompt */}
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-3">
            Model Input Prompt
          </p>
          <div className="bg-surface-container-lowest p-4 rounded text-[12px] font-mono text-on-surface/80 italic leading-relaxed">
            "Parse the attached invoice PDF. Extract: vendor name, invoice number, issue date, due date,
            each line item with description and amount, subtotal, tax amount, tax rate, total, and currency.
            Cross-check the vendor against the master vendor list in Supabase."
          </div>
        </div>

        {/* Tool Payload / Result Toggle */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/5">
            <div className="px-4 py-3 border-b border-outline-variant/5 flex items-center justify-between bg-surface-container-high/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Tool Payload
              </p>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-on-surface-variant mb-2">
                Tool:{' '}
                <span className="font-mono text-secondary">claude_api.extract_document</span>
              </p>
              <pre className="bg-surface-container-lowest p-3 rounded text-[11px] font-mono text-primary/80 whitespace-pre">
{JSON.stringify({
  document_url: 'gs://auditflow-invoices/2024/nov/INV-2024-1042.pdf',
  system_prompt: 'Extract invoice fields per AuditFlow schema...',
  model: 'claude-opus-4-6',
  max_tokens: 4096,
}, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/5">
            <div className="px-4 py-3 border-b border-outline-variant/5 flex items-center justify-between bg-surface-container-high/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Execution Result
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-on-surface-variant">Status</p>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  SUCCESS
                </span>
              </div>
              <pre className="bg-surface-container-lowest p-3 rounded text-[11px] font-mono text-primary/80 whitespace-pre">
{JSON.stringify({
  vendor: 'AWS Asia Pacific (Singapore) Pte Ltd',
  invoice_number: 'INV-2024-1042',
  issue_date: '2024-11-01',
  due_date: '2024-11-30',
  line_items: [{ description: 'Cloud Services', amount: 42000 }],
  subtotal: 42000,
  tax_amount: 3780,
  tax_rate: 0.09,
  total: 45780,
  currency: 'SGD',
  confidence: 0.942,
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Exec Summary */}
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/5 grid grid-cols-4 gap-6">
          {[
            { label: 'Execution Time', value: '1,240ms', ok: true },
            { label: 'Confidence', value: '94.2%', ok: true },
            { label: 'Data Freshness', value: '< 1s', ok: true },
            { label: 'Token Count', value: '4,821', ok: true },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-2">
                {m.label}
              </p>
              <p className={`font-mono text-xl font-bold ${m.ok ? 'text-primary' : 'text-error'}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderInsights() {
    const totalTasks = agents.reduce((s, a) => s + (a.tasks_completed_today || 0), 0);
    const avgLatency = Math.round(agents.reduce((s, a) => s + (a.avg_latency_ms || 0), 0) / agents.length);
    const totalErrors = agents.filter((a) => a.error_rate !== '0.0%').length;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-instrument text-3xl italic text-on-surface">Performance Insights</h2>
          <span className="font-mono text-[10px] text-on-surface-variant">Updated every 60s</span>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Tasks Today', value: totalTasks.toLocaleString(), positive: true },
            { label: 'Avg Latency', value: `${avgLatency.toLocaleString()}ms`, positive: true },
            { label: 'Active Agents', value: `${agents.filter((a) => !pausedAgents.has(a.agent)).length}/6`, positive: true },
            { label: 'Error Rate', value: `${totalErrors} agents`, positive: totalErrors === 0 },
            { label: 'Reports Sent', value: '5', positive: true },
            { label: 'Alerts Triggered', value: '412', positive: true },
          ].map((m) => (
            <div key={m.label} className="bg-surface-container p-5 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-3">{m.label}</p>
              <p className="font-mono text-2xl font-bold text-on-surface mb-1">{m.value}</p>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-mono ${m.positive ? 'text-primary' : 'text-error'}`}>
                  {m.positive ? '● Healthy' : '● Warning'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Latency by Agent */}
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/5">
          <h3 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-6">
            Latency by Agent (ms)
          </h3>
          <div className="space-y-4">
            {agents.map((agent) => {
              const maxLatency = 3000;
              const width = Math.min(100, ((agent.avg_latency_ms || 0) / maxLatency) * 100);
              const color = AGENT_COLORS[agent.agent] || '#62df7d';
              return (
                <div key={agent.agent} className="grid grid-cols-[120px_1fr_80px] items-center gap-4">
                  <span className="text-[11px] font-mono text-on-surface">{agent.agent}</span>
                  <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${width}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant text-right">
                    {agent.avg_latency_ms?.toLocaleString()}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Throughput */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4">
              Throughput (tasks/hr)
            </h3>
            <div className="space-y-2">
              {agents.map((agent) => {
                const tasksPerHr = Math.round((agent.tasks_completed_today || 0) / 9);
                const maxTasks = 100;
                const width = Math.min(100, (tasksPerHr / maxTasks) * 100);
                const color = AGENT_COLORS[agent.agent] || '#62df7d';
                return (
                  <div key={agent.agent} className="grid grid-cols-[120px_1fr_60px] items-center gap-3">
                    <span className="text-[11px] font-mono text-on-surface-variant truncate">{agent.agent}</span>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${width}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant text-right">{tasksPerHr}/hr</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4">
              Token Usage (24h)
            </h3>
            <div className="space-y-2">
              {agents.slice(0, 4).map((agent) => {
                const tokens = (agent.tasks_completed_today || 0) * 4500;
                const maxTokens = 500000;
                const width = Math.min(100, (tokens / maxTokens) * 100);
                const color = AGENT_COLORS[agent.agent] || '#62df7d';
                return (
                  <div key={agent.agent} className="grid grid-cols-[120px_1fr_80px] items-center gap-3">
                    <span className="text-[11px] font-mono text-on-surface-variant truncate">{agent.agent}</span>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${width}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant text-right">
                      {(tokens / 1000).toFixed(0)}K
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderHistory() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-instrument text-3xl italic text-on-surface">Audit Log Search</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setEvents([])}
              className="bg-surface-container px-3 py-1.5 rounded text-xs font-bold text-outline border border-outline-variant/10 hover:text-error transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                addToast({ variant: 'info', title: 'Exporting Audit Log', message: 'Preparing CSV...' });
              }}
              className="bg-surface-container px-3 py-1.5 rounded text-xs font-bold text-outline border border-outline-variant/10 hover:text-primary transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/40 font-mono"
              placeholder="Search agent actions, MCP tools, session IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-xs font-mono"
            onChange={(e) => setFilterAgent(e.target.value || null)}
          >
            <option value="">All Agents</option>
            {agents.map((a) => (
              <option key={a.agent} value={a.agent}>{a.agent}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: events.length.toString() },
            {
              label: 'Success',
              value: events.filter((e) => e.status === 'SUCCESS').length.toString(),
              color: 'text-primary',
            },
            {
              label: 'Errors',
              value: events.filter((e) => e.status === 'ERROR').length.toString(),
              color: 'text-error',
            },
            {
              label: 'Tool Calls',
              value: events.filter((e) => e.status === 'TOOL_CALL').length.toString(),
              color: 'text-amber-400',
            },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container p-4 rounded-xl text-center">
              <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <p className={`font-mono text-2xl font-bold ${s.color || 'text-on-surface'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Full Event Log */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/5">
          <div className="bg-surface-container px-4 py-3 flex items-center justify-between border-b border-outline-variant/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">
              All Events — newest first
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant">{events.length} total</span>
          </div>
          <div className="divide-y divide-outline-variant/5">
            {filteredEvents().slice(0, 100).map((evt) => (
              <div
                key={evt.id}
                onClick={() => setExpandedEvent(expandedEvent?.id === evt.id ? null : evt)}
                className="px-4 py-3 flex items-center gap-4 hover:bg-surface-container/50 cursor-pointer transition-colors"
              >
                <span className="font-mono text-[11px] text-on-surface-variant/60 shrink-0 w-16">
                  {evt.time}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold shrink-0 w-24 ${getStatusColor(evt.status)}`}
                >
                  {evt.status}
                </span>
                <span
                  className="font-mono text-[11px] text-on-surface shrink-0 w-28"
                  style={{ color: AGENT_COLORS[evt.agent] || '#62df7d' }}
                >
                  {evt.agent}
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant shrink-0 w-48 truncate">
                  {evt.action}
                </span>
                {evt.mcp_tool && (
                  <span className="font-mono text-[11px] text-secondary shrink-0">{evt.mcp_tool}</span>
                )}
                <span className="font-mono text-[11px] text-primary/60 ml-auto shrink-0">
                  {evt.confidence > 0 ? `${evt.confidence}%` : '—'}
                </span>
                {evt.latency_ms && (
                  <span className="font-mono text-[11px] text-on-surface-variant/60 shrink-0">
                    {evt.latency_ms}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Nav */}
      <div className="flex items-center gap-2 bg-surface-container w-fit rounded-lg p-1">
        {([
          { key: 'terminal', icon: 'terminal', label: 'Terminal' },
          { key: 'agents', icon: 'diversity_3', label: 'Agents' },
          { key: 'troubleshoot', icon: 'troubleshoot', label: 'Troubleshoot' },
          { key: 'insights', icon: 'insights', label: 'Insights' },
          { key: 'history', icon: 'history', label: 'History' },
        ] as { key: NavKey; icon: string; label: string }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveNav(item.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all text-xs font-semibold ${
              activeNav === item.key
                ? 'bg-primary text-on-primary-container shadow-sm'
                : 'text-outline hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {activeNav === 'terminal' && renderTerminal()}
      {activeNav === 'agents' && renderAgentsOverview()}
      {activeNav === 'troubleshoot' && renderTroubleshoot()}
      {activeNav === 'insights' && renderInsights()}
      {activeNav === 'history' && renderHistory()}
    </div>
  );
}
