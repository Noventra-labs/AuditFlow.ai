'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api, type Invoice } from '@/lib/api';

interface ChartDataPoint {
  month: string;
  actual: number | null;
  conservative: number | null;
  base: number | null;
  optimistic: number | null;
}

const defaultData: ChartDataPoint[] = [
  { month: 'Jan', actual: 145000, conservative: null, base: null, optimistic: null },
  { month: 'Feb', actual: 152000, conservative: null, base: null, optimistic: null },
  { month: 'Mar', actual: 168000, conservative: null, base: null, optimistic: null },
  { month: 'Apr', actual: 175000, conservative: null, base: null, optimistic: null },
  { month: 'May', actual: 189772, conservative: 172000, base: 189772, optimistic: 195000 },
  { month: 'Jun', actual: null, conservative: 158000, base: 182000, optimistic: 205000 },
  { month: 'Jul', actual: null, conservative: 145000, base: 176000, optimistic: 218000 },
  { month: 'Aug', actual: null, conservative: 132000, base: 170000, optimistic: 232000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: 'rgba(26, 31, 53, 0.95)',
      border: '1px solid rgba(79, 140, 255, 0.3)',
      borderRadius: '12px',
      padding: '14px 18px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <p style={{ color: '#f0f2f8', fontWeight: 600, marginBottom: 8 }}>{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: 13, margin: '2px 0' }}>
          {entry.name}: SGD {entry.value?.toLocaleString() || 'N/A'}
        </p>
      ))}
    </div>
  );
};

export default function CashFlowChart() {
  const [data, setData] = useState<ChartDataPoint[]>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await api.getForecast();
        const forecast = response.forecast;

        // Transform forecast data to chart format
        if (forecast?.scenarios) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonth = new Date().getMonth(); // 0-11

          // Build chart data from forecast scenarios
          const chartData: ChartDataPoint[] = months.map((month, index) => {
            const isPast = index <= currentMonth;
            const isCurrent = index === currentMonth;

            return {
              month,
              actual: isPast ? (forecast.scenarios?.base?.[index] || defaultData[index]?.actual || null) : null,
              conservative: forecast.scenarios?.conservative?.[index] || defaultData[index]?.conservative || null,
              base: forecast.scenarios?.base?.[index] || defaultData[index]?.base || null,
              optimistic: forecast.scenarios?.optimistic?.[index] || defaultData[index]?.optimistic || null,
            };
          });

          setData(chartData.slice(0, 12)); // Show up to 12 months
          setError(null);
        } else {
          // Fallback to default if no forecast data
          setData(defaultData);
        }
      } catch (err) {
        console.error('Failed to fetch forecast:', err);
        setError('Using cached forecast data');
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
    // Refresh every 60 seconds
    const interval = setInterval(fetchForecast, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading forecast data...</span>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradOptimistic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" stroke="#5a6380" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#5a6380" fontSize={12} tickLine={false} axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#8b95b0' }} />
          <Area type="monotone" dataKey="actual" name="Actual" stroke="#4f8cff" strokeWidth={2.5}
            fill="url(#gradActual)" dot={{ r: 4, fill: '#4f8cff', strokeWidth: 0 }}
          />
          <Area type="monotone" dataKey="conservative" name="Conservative" stroke="#f87171" strokeWidth={1.5}
            strokeDasharray="6 4" fill="none"
          />
          <Area type="monotone" dataKey="base" name="Base" stroke="#a78bfa" strokeWidth={2}
            fill="url(#gradBase)"
          />
          <Area type="monotone" dataKey="optimistic" name="Optimistic" stroke="#34d399" strokeWidth={1.5}
            strokeDasharray="6 4" fill="url(#gradOptimistic)"
          />
        </AreaChart>
      </ResponsiveContainer>
      {error && (
        <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '11px', color: '#fb923c' }}>
          {error}
        </div>
      )}
    </div>
  );
}
