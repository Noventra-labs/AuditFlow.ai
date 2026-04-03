'use client';

import { useState, useRef, useEffect } from 'react';

interface CommandEntry {
  id: string;
  type: 'user' | 'system' | 'agent' | 'error';
  agent?: string;
  text: string;
  timestamp: string;
}

const DEMO_SUGGESTIONS = [
  'Run full reconciliation for April 2026',
  'Show unreconciled invoices over SGD 5,000',
  'Generate board report for Q1 2026',
  'Calculate GST liability for current period',
  'What is our cash runway under conservative scenario?',
  'Summarize top 5 vendor expenses this month',
];

const DEMO_RESPONSES: Record<string, CommandEntry[]> = {
  default: [
    { id: 'r1', type: 'system', text: 'Routing command to orchestrator...', timestamp: '' },
    { id: 'r2', type: 'agent', agent: 'orchestrator', text: 'Analyzing request and selecting agents...', timestamp: '' },
    { id: 'r3', type: 'agent', agent: 'forecast_agent', text: 'Running cash flow projection with current parameters.', timestamp: '' },
    { id: 'r4', type: 'system', text: '✓ Analysis complete. Results are available in the Dashboard.', timestamp: '' },
  ],
  reconciliation: [
    { id: 'r1', type: 'system', text: 'Routing to Reconciliation Agent...', timestamp: '' },
    { id: 'r2', type: 'agent', agent: 'reconciliation_agent', text: 'Starting auto-reconciliation. Scanning 47 unmatched entries against bank feed.', timestamp: '' },
    { id: 'r3', type: 'agent', agent: 'reconciliation_agent', text: 'Matched 39/47 transactions (83% match rate). 8 items flagged for manual review.', timestamp: '' },
    { id: 'r4', type: 'system', text: '✓ Reconciliation session complete. Navigate to Reconciliation tab for details.', timestamp: '' },
  ],
  report: [
    { id: 'r1', type: 'system', text: 'Routing to Report Agent...', timestamp: '' },
    { id: 'r2', type: 'agent', agent: 'report_agent', text: 'Generating Quarterly Board Pack for Q1 2026...', timestamp: '' },
    { id: 'r3', type: 'agent', agent: 'report_agent', text: 'Compiling: Revenue summary, P&L, Cash flow, AR aging, Runway gauge.', timestamp: '' },
    { id: 'r4', type: 'system', text: '✓ Report generated. Preview available in the Reports tab.', timestamp: '' },
  ],
  gst: [
    { id: 'r1', type: 'system', text: 'Routing to Tax Compliance Agent...', timestamp: '' },
    { id: 'r2', type: 'agent', agent: 'tax_compliance_agent', text: 'Scanning tax register for Singapore GST (9%) jurisdiction.', timestamp: '' },
    { id: 'r3', type: 'agent', agent: 'tax_compliance_agent', text: 'Output Tax: SGD 14,820 | Input Tax: SGD 8,340 | Net Payable: SGD 6,480. Filing due in 12 days.', timestamp: '' },
    { id: 'r4', type: 'system', text: '✓ GST calculation complete. See Tax Compliance tab for full register.', timestamp: '' },
  ],
  runway: [
    { id: 'r1', type: 'system', text: 'Routing to Forecast Agent...', timestamp: '' },
    { id: 'r2', type: 'agent', agent: 'forecast_agent', text: 'Computing conservative scenario with current assumptions: 65% collection rate, 45-day avg payment terms.', timestamp: '' },
    { id: 'r3', type: 'agent', agent: 'forecast_agent', text: 'Conservative runway: 8.2 months. Base: 14 months. Optimistic: 22+ months.', timestamp: '' },
    { id: 'r4', type: 'system', text: '✓ Forecast available. Open the What-If Simulator in the Forecast tab to adjust assumptions.', timestamp: '' },
  ],
};

function getResponseKey(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('reconcil')) return 'reconciliation';
  if (lower.includes('report') || lower.includes('board')) return 'report';
  if (lower.includes('gst') || lower.includes('tax') || lower.includes('filing')) return 'gst';
  if (lower.includes('runway') || lower.includes('forecast') || lower.includes('cash')) return 'runway';
  return 'default';
}

function formatTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function CommandConsole() {
  const [entries, setEntries] = useState<CommandEntry[]>([
    {
      id: 'welcome',
      type: 'system',
      text: 'FinancePilot AI Command Console ready. Type a command or click a suggestion below.',
      timestamp: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = async (command: string) => {
    if (!command.trim() || isProcessing) return;

    const userEntry: CommandEntry = {
      id: `u-${Date.now()}`,
      type: 'user',
      text: command,
      timestamp: formatTime(),
    };

    setEntries((prev) => [...prev, userEntry]);
    setInput('');
    setIsProcessing(true);

    const key = getResponseKey(command);
    const responses = DEMO_RESPONSES[key];

    for (let i = 0; i < responses.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
      setEntries((prev) => [
        ...prev,
        { ...responses[i], id: `r-${Date.now()}-${i}`, timestamp: formatTime() },
      ]);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
  };

  const getEntryStyles = (type: string): React.CSSProperties => {
    switch (type) {
      case 'user':
        return { color: '#62df7d', fontWeight: 600 };
      case 'agent':
        return { color: '#bfc6db' };
      case 'error':
        return { color: '#ffb4ab' };
      case 'system':
      default:
        return { color: '#879485' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
      {/* Scrollable log */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          fontFamily: '"DM Mono", "Fira Code", monospace',
          fontSize: '13px',
          lineHeight: '1.7',
          background: 'var(--bg-recessed, #0a0e14)',
          borderRadius: '10px',
          marginBottom: '16px',
        }}
      >
        {entries.map((entry) => (
          <div key={entry.id} style={{ marginBottom: '6px', ...getEntryStyles(entry.type) }}>
            <span style={{ color: 'var(--text-muted, #555)', marginRight: '10px', fontSize: '11px' }}>
              [{entry.timestamp}]
            </span>
            {entry.type === 'user' && <span style={{ color: '#62df7d' }}>{'> '}</span>}
            {entry.type === 'agent' && (
              <span
                style={{
                  color: '#0891b2',
                  marginRight: '8px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                [{entry.agent}]
              </span>
            )}
            {entry.text}
          </div>
        ))}
        {isProcessing && (
          <div style={{ color: '#d97706', marginTop: '4px' }}>
            <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '8px' }}>●</span>
            Processing...
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {DEMO_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => processCommand(s)}
            disabled={isProcessing}
            style={{
              background: 'var(--bg-card, #1c2026)',
              color: 'var(--text-secondary, #bfc6db)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              transition: 'all 0.2s',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                (e.target as HTMLButtonElement).style.borderColor = 'rgba(98, 223, 125, 0.3)';
                (e.target as HTMLButtonElement).style.color = '#62df7d';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
              (e.target as HTMLButtonElement).style.color = 'var(--text-secondary, #bfc6db)';
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command... e.g. 'Run full reconciliation for April 2026'"
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'var(--bg-card, #1c2026)',
            color: 'var(--text-primary, #dfe2eb)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            fontFamily: '"DM Mono", monospace',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(98, 223, 125, 0.3)';
            e.target.style.boxShadow = '0 0 0 3px rgba(98, 223, 125, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={isProcessing || !input.trim()}
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            opacity: isProcessing || !input.trim() ? 0.5 : 1,
            cursor: isProcessing || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Run ⏎
        </button>
      </form>
    </div>
  );
}
