'use client';

import { useState, useEffect } from 'react';
import { api, type Alert } from '@/lib/api';

interface AlertWithDisplay extends Alert {
  icon: string;
  displayTime: string;
}

const severityStyles: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', text: '#f87171' },
  high: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)', text: '#fb923c' },
  medium: { bg: 'rgba(79,140,255,0.06)', border: 'rgba(79,140,255,0.2)', text: '#4f8cff' },
  low: { bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.2)', text: '#34d399' },
};

const alertIcons: Record<string, string> = {
  low_runway: '🚨',
  overdue_invoice: '⚠️',
  tax_deadline: '🏛️',
  unusual_transaction: '💰',
  unmatched_reconciliation: '🔗',
  default: '🔔',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertWithDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await api.getAlerts();

        // Transform API data for display
        const formattedAlerts: AlertWithDisplay[] = response.alerts.map((alert) => ({
          ...alert,
          icon: alertIcons[alert.type] || alertIcons.default,
          displayTime: formatTimeAgo(alert.created_at),
        }));

        setAlerts(formattedAlerts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
        setError('Failed to load alerts');
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh every 20 seconds for alerts
    const interval = setInterval(fetchAlerts, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading alerts...
      </div>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#f87171' }}>{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No active alerts 🎉</p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>
          Everything looks good! We'll notify you if anything needs attention.
        </p>
      </div>
    );
  }

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
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.displayTime}</span>
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
