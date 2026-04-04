'use client';

import { useState, useEffect } from 'react';

interface ActivityEvent {
  id: string;
  agent: string;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  time: string;
}

const demoEvents: ActivityEvent[] = [
  { id: '1', agent: 'Invoice Parser', icon: '📄', iconClass: 'invoice', title: 'Invoice Extracted', description: 'AWS-2024-0891 parsed with 97% confidence', time: '2 min ago' },
  { id: '2', agent: 'Reconciliation', icon: '🔗', iconClass: 'reconcile', title: 'Auto-Matched', description: 'WeWork invoice matched to DBS txn (score: 0.94)', time: '5 min ago' },
  { id: '3', agent: 'Tax Compliance', icon: '🏛️', iconClass: 'tax', title: 'GST Filing Reminder', description: 'Singapore GST deadline in 12 days. Calendar event created.', time: '18 min ago' },
  { id: '4', agent: 'Forecast', icon: '📈', iconClass: 'forecast', title: 'Forecast Updated', description: 'Base runway: 14mo. Conservative: 9mo. Burn trend: stable.', time: '32 min ago' },
  { id: '5', agent: 'Alert', icon: '🔔', iconClass: 'alert', title: 'Overdue Invoice', description: 'PT Tokopedia invoice 45 days overdue — IDR 17.3M', time: '1h ago' },
  { id: '6', agent: 'Report', icon: '📋', iconClass: 'report', title: 'Monthly Report Sent', description: 'Board report emailed to cfo@techpulse.sg', time: '3h ago' },
];

export default function AgentActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>(demoEvents);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket for live agent events
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) return;

    try {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => setWsConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'agent_event') {
            setEvents((prev) => [data.payload, ...prev].slice(0, 20));
          }
        } catch (e) {
          // Skip parse errors
        }
      };
      ws.onclose = () => setWsConnected(false);
      return () => ws.close();
    } catch (e) {
      // WebSocket not available in dev
    }
  }, []);

  return (
    <div className="activity-feed" style={{ maxHeight: '360px', overflowY: 'auto' }}>
      {events.map((event) => (
        <div key={event.id} className="activity-item">
          <div className={`activity-icon ${event.iconClass}`}>{event.icon}</div>
          <div className="activity-content">
            <div className="activity-title">{event.title}</div>
            <div className="activity-desc">{event.description}</div>
            <div className="activity-time">{event.agent} · {event.time}</div>
          </div>
        </div>
      ))}

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 0', justifyContent: 'center',
      }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: wsConnected ? '#34d399' : '#f87171',
          boxShadow: wsConnected ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
        }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {wsConnected ? 'Live connected' : 'Demo mode'}
        </span>
      </div>
    </div>
  );
}
