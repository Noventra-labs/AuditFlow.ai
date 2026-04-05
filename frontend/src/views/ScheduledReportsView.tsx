import { useState } from 'react';

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextRun: string;
  recipients: number;
  lastStatus: 'active' | 'paused' | 'error';
}

const SCHEDULES: ScheduledReport[] = [
  { id: 'SCH-001', name: 'Daily Cash Position', type: 'Cash Flow', frequency: 'daily', nextRun: 'Today 6:00 PM', recipients: 3, lastStatus: 'active' },
  { id: 'SCH-002', name: 'Weekly AR Aging', type: 'A/R Aging', frequency: 'weekly', nextRun: 'Monday 8:00 AM', recipients: 5, lastStatus: 'active' },
  { id: 'SCH-003', name: 'Monthly P&L Report', type: 'P&L', frequency: 'monthly', nextRun: 'Nov 1, 2024 9:00 AM', recipients: 8, lastStatus: 'active' },
  { id: 'SCH-004', name: 'Quarterly Board Pack', type: 'Board Pack', frequency: 'quarterly', nextRun: 'Dec 31, 2024', recipients: 12, lastStatus: 'paused' },
  { id: 'SCH-005', name: 'GST Filing Summary', type: 'Tax', frequency: 'quarterly', nextRun: 'Oct 31, 2024', recipients: 2, lastStatus: 'error' },
  { id: 'SCH-006', name: 'Vendor Payment Digest', type: 'AP Summary', frequency: 'weekly', nextRun: 'Friday 5:00 PM', recipients: 4, lastStatus: 'active' },
];

const freqColors = {
  daily: 'bg-primary/10 text-primary',
  weekly: 'bg-secondary/10 text-secondary',
  monthly: 'bg-tertiary/10 text-tertiary',
  quarterly: 'bg-amber-500/10 text-amber-500',
};

export default function ScheduledReportsView() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'error'>('all');
  const [schedules, setSchedules] = useState(SCHEDULES);

  const filtered = schedules.filter((s) => filter === 'all' || s.lastStatus === filter);

  function toggleStatus(id: string) {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, lastStatus: s.lastStatus === 'active' ? 'paused' : 'active' } : s))
    );
  }

  function deleteSchedule(id: string) {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  const statusBadge = (status: ScheduledReport['lastStatus']) => {
    const colors = { active: 'bg-primary/10 text-primary', paused: 'bg-outline/10 text-outline', error: 'bg-error/10 text-error' };
    const labels = { active: 'Active', paused: 'Paused', error: 'Error' };
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${colors[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-on-surface">Scheduled Reports</h1>
          <p className="text-sm text-on-surface-variant mt-1">Automate report generation and distribution</p>
        </div>
        <button className="bg-primary text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          New Schedule
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Schedules', value: schedules.length, icon: 'schedule' },
          { label: 'Active', value: schedules.filter((s) => s.lastStatus === 'active').length, color: 'text-primary' },
          { label: 'Paused', value: schedules.filter((s) => s.lastStatus === 'paused').length, color: 'text-outline' },
          { label: 'Errors', value: schedules.filter((s) => s.lastStatus === 'error').length, color: 'text-error' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container p-4 rounded-xl">
            <p className="text-[10px] text-outline uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-serif ${stat.color || 'text-on-surface'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'paused', 'error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
              filter === f ? 'bg-primary text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="bg-surface-container rounded-xl overflow-hidden divide-y divide-outline/5">
        {filtered.map((schedule) => (
          <div key={schedule.id} className="p-6 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">schedule</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-bold text-on-surface">{schedule.name}</h3>
                  {statusBadge(schedule.lastStatus)}
                </div>
                <div className="flex items-center gap-4 text-[11px] mono-data text-outline">
                  <span>{schedule.type}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${freqColors[schedule.frequency]}`}>
                    {schedule.frequency}
                  </span>
                  <span>Next: {schedule.nextRun}</span>
                  <span>{schedule.recipients} recipients</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStatus(schedule.id)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${
                  schedule.lastStatus === 'active'
                    ? 'border-outline/20 text-outline hover:bg-outline/10'
                    : 'border-primary/20 text-primary hover:bg-primary/10'
                }`}
              >
                {schedule.lastStatus === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={() => deleteSchedule(schedule.id)}
                className="p-2 hover:bg-error/10 rounded text-outline hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-outline text-4xl mb-4">schedule</span>
            <p className="text-on-surface-variant">No schedules found</p>
          </div>
        )}
      </div>
    </div>
  );
}
