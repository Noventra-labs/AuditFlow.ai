import { useState } from 'react';

interface ArchivedReport {
  id: string;
  title: string;
  type: string;
  archivedAt: string;
  archivedBy: string;
  period: string;
  size: string;
}

const ARCHIVED: ArchivedReport[] = [
  { id: 'FP-2024-0041', title: 'FY2023 Annual Report', type: 'Annual', archivedAt: 'Mar 15, 2024', archivedBy: 'System', period: 'FY2023', size: '12.0 MB' },
  { id: 'FP-2024-0033', title: 'Budget Variance Analysis', type: 'Variance', archivedAt: 'Feb 10, 2024', archivedBy: 'J. Carter', period: 'Q4 2023', size: '1.1 MB' },
  { id: 'FP-2023-0098', title: 'Q3 2023 Board Pack', type: 'Board Pack', archivedAt: 'Dec 31, 2023', archivedBy: 'System', period: 'Q3 2023', size: '4.8 MB' },
  { id: 'FP-2023-0082', title: 'FY2022 Annual Report', type: 'Annual', archivedAt: 'Mar 31, 2023', archivedBy: 'System', period: 'FY2022', size: '11.2 MB' },
  { id: 'FP-2023-0071', title: 'Tax Compliance Summary', type: 'Tax', archivedAt: 'Jan 15, 2023', archivedBy: 'Admin', period: 'FY2022', size: '2.9 MB' },
];

export default function ArchiveReportsView() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const years = ['all', '2024', '2023', '2022'];

  const filtered = ARCHIVED.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchYear = selectedYear === 'all' || r.archivedAt.includes(selectedYear);
    return matchSearch && matchYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-on-surface">Historical Archive</h1>
          <p className="text-sm text-on-surface-variant mt-1">{ARCHIVED.length} archived reports</p>
        </div>
        <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Archive
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-outline/10">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-xs text-on-surface placeholder:text-outline/40"
            placeholder="Search archived reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-surface-container rounded-lg p-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedYear === y ? 'bg-primary text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {y === 'all' ? 'All Years' : y}
            </button>
          ))}
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-surface-container rounded-xl p-6 hover:bg-surface-container-high transition-colors border border-outline/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-outline text-xl">archive</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-on-surface truncate">{report.title}</h3>
                <p className="text-[10px] mono-data text-outline mt-0.5">{report.id}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] mono-data text-outline">
                  <span>{report.type}</span>
                  <span>·</span>
                  <span>{report.period}</span>
                  <span>·</span>
                  <span>{report.size}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline/5">
                  <div className="text-[10px] mono-data text-outline/60">
                    <span>Archived {report.archivedAt}</span>
                    <span className="ml-2">by {report.archivedBy}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-surface-container-high rounded text-outline hover:text-primary transition-colors" title="View">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                    <button className="p-1.5 hover:bg-surface-container-high rounded text-outline hover:text-primary transition-colors" title="Restore">
                      <span className="material-symbols-outlined text-sm">unarchive</span>
                    </button>
                    <button className="p-1.5 hover:bg-error/10 rounded text-outline hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
            <p className="text-on-surface-variant">No archived reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
