import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { Report } from '../types';

const REPORT_TYPE_COLORS: Record<string, string> = {
  'monthly': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
  'quarterly': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
  'tax': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
  'investor': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
  'annual': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
  'custom': 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
};

const MOCK_REPORTS: Report[] = [
  { id: 'FP-2024-0082', type: 'monthly', title: 'FY24 Profit & Loss', period: 'Q3 2024', generated_at: '2024-10-24', status: 'sent', recipient_count: 3, download_count: 12 },
  { id: 'FP-2024-0079', type: 'quarterly', title: 'Q3 Board Pack', period: 'Q3 2024', generated_at: '2024-10-20', status: 'sent', recipient_count: 5, download_count: 8 },
  { id: 'FP-2024-0071', type: 'investor', title: 'Investor Update — Q3', period: 'Q3 2024', generated_at: '2024-09-12', status: 'sent', recipient_count: 2, download_count: 4 },
  { id: 'FP-2024-0065', type: 'monthly', title: 'Cash Flow Analysis', period: 'Q2 2024', generated_at: '2024-08-30', status: 'draft', recipient_count: 0, download_count: 0 },
  { id: 'FP-2024-0058', type: 'tax', title: 'GST Return Summary', period: 'Q2 2024', generated_at: '2024-07-15', status: 'sent', recipient_count: 1, download_count: 6 },
  { id: 'FP-2024-0049', type: 'monthly', title: 'AR Aging Report', period: 'Q1 2024', generated_at: '2024-06-28', status: 'archived', recipient_count: 2, download_count: 3 },
  { id: 'FP-2024-0041', type: 'annual', title: 'FY2023 Annual Accounts', period: 'FY2023', generated_at: '2024-03-15', status: 'archived', recipient_count: 4, download_count: 20 },
  { id: 'FP-2024-0033', type: 'custom', title: 'Budget Variance Analysis', period: 'Q4 2023', generated_at: '2024-02-10', status: 'archived', recipient_count: 1, download_count: 2 },
];

const TYPE_LABELS: Record<string, string> = {
  monthly: 'P&L',
  quarterly: 'Board Pack',
  tax: 'GST Summary',
  investor: 'Investor Update',
  annual: 'Annual Accounts',
  custom: 'Custom',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  generated: 'bg-primary/10 text-primary border-primary/20',
  sent: 'bg-primary/10 text-primary border-primary/20',
  archived: 'bg-outline/10 text-outline border-outline/20',
};

export default function ReportsLibraryView() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = MOCK_REPORTS.filter((r) => {
    if (filter === 'all') return r.status !== 'archived'; // archived hidden by default per spec
    if (filter === 'published') return r.status === 'sent' || r.status === 'generated';
    return r.status === filter;
  }).filter((r) =>
    (r.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDownload(report: Report) {
    try {
      addToast({ variant: 'info', title: 'Preparing PDF', message: `Downloading ${report.title ?? 'report'}...` });
      const blob = await api.downloadPDF(report.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${(report.title ?? 'report').replace(/\s+/g, '_')}.pdf`; a.click();
      URL.revokeObjectURL(url);
      addToast({ variant: 'success', title: 'Download Complete', message: `${report.title ?? 'Report'} downloaded` });
    } catch (err) {
      addToast({ variant: 'error', title: 'Download Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message });
    }
  }

  async function handleResend(report: Report) {
    try {
      addToast({ variant: 'info', title: 'Re-sending', message: `Dispatching ${report.title}...` });
      await api.emailReport(report.id, ['board@company.com']);
      addToast({ variant: 'success', title: 'Report Sent', message: `Re-sent to board@company.com` });
    } catch (err) {
      addToast({ variant: 'error', title: 'Send Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-instrument italic text-on-surface">Report Library</h1>
          <p className="text-sm text-on-surface-variant mt-1">{filtered.length} reports — archived reports are hidden</p>
        </div>
        <button
          onClick={() => addToast({ variant: 'info', title: 'Generate Report', message: 'Navigate to Reports tab to use the generation wizard' })}
          className="bg-primary text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/10"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Generate Now
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
          {([
            { key: 'all', label: 'Active' },
            { key: 'published', label: 'Published' },
            { key: 'draft', label: 'Drafts' },
            { key: 'archived', label: 'Archive' },
          ] as { key: typeof filter; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
                filter === f.key ? 'bg-primary text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/40 w-48"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined text-sm">view_list</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-outline hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
          </button>
        </div>
      </div>

      {/* Report Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((report) => {
            const typeLabel = TYPE_LABELS[report.type] || report.type;
            const isHovered = hoveredId === report.id;
            return (
              <div
                key={report.id}
                className="relative bg-surface rounded-xl border border-outline-variant/10 overflow-hidden group hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredId(report.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Document Thumbnail / Card top */}
                <div className="relative h-[140px] bg-surface-container flex flex-col items-center justify-center overflow-hidden">
                  {/* Simulated document page */}
                  <div className="w-[80px] h-[100px] bg-white rounded-sm shadow-lg flex flex-col p-2 gap-1">
                    <div className="h-2 bg-slate-200 rounded-sm w-full" />
                    <div className="h-1 bg-slate-100 rounded-sm w-3/4" />
                    <div className="h-1 bg-slate-100 rounded-sm w-full" />
                    <div className="h-1 bg-slate-100 rounded-sm w-5/6" />
                    <div className="mt-auto h-2 bg-slate-300 rounded-sm w-full" />
                  </div>
                  {/* Drop shadow suggestion */}
                  <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)]" />

                  {/* Hover overlay */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-surface-container/90 flex items-center justify-center gap-3 animate-fade-in">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary-container text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download PDF
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleResend(report); }}
                        className="flex items-center gap-2 px-4 py-2 bg-surface text-on-surface text-xs font-semibold rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Re-send
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Type badge + status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${REPORT_TYPE_COLORS[report.type] || REPORT_TYPE_COLORS.custom}`}>
                      {typeLabel}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${STATUS_COLORS[report.status] || STATUS_COLORS.generated}`}>
                      {report.status === 'sent' ? 'Published' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-on-surface mb-1 leading-tight">{report.title}</h3>
                  <p className="text-[10px] font-mono text-on-surface-variant/60 mb-3">{report.id}</p>

                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                    <span className="font-mono">{report.period}</span>
                    <div className="flex items-center gap-3">
                      {(report.recipient_count ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">people</span>
                          {report.recipient_count}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">download</span>
                        {report.download_count || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-on-surface-variant/40 mt-1">
                    {report.generated_at ? new Date(report.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-surface-container rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Report', 'Type', 'Period', 'Generated', 'Recipients', 'Downloads', 'Status', ''].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filtered.map((report) => {
                const typeLabel = TYPE_LABELS[report.type] || report.type;
                return (
                  <tr
                    key={report.id}
                    className="hover:bg-surface-container-high/50 transition-colors cursor-pointer group"
                    onClick={() => addToast({ variant: 'info', title: 'Preview', message: 'Open DocumentViewer to preview this report' })}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container-high rounded flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#D4AF37] text-sm">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{report.title}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant/60">{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${REPORT_TYPE_COLORS[report.type] || REPORT_TYPE_COLORS.custom}`}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface">{report.period}</td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                      {report.generated_at ? new Date(report.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">{report.recipient_count || '—'}</td>
                    <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">{report.download_count || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_COLORS[report.status] || STATUS_COLORS.generated}`}>
                        {report.status === 'sent' ? 'Published' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                          className="p-1.5 hover:bg-surface-container-high rounded text-outline hover:text-primary transition-colors"
                          title="Download PDF"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleResend(report); }}
                          className="p-1.5 hover:bg-surface-container-high rounded text-outline hover:text-primary transition-colors"
                          title="Re-send"
                        >
                          <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-4">folder_open</span>
              <p className="text-on-surface-variant text-sm">No reports found</p>
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && viewMode === 'grid' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-4">folder_open</span>
          <p className="text-on-surface-variant text-sm">No reports found</p>
        </div>
      )}
    </div>
  );
}
