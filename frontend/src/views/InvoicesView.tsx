import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { SkeletonTableRow } from '../components/SkeletonLoader';
import type { Invoice } from '../types';
import type { UploadProgress } from '../types';

const STATUS_OPTIONS = ['Reconciled', 'Processing', 'Needs Review', 'Overdue', 'Voided', 'AI Extracted'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export default function InvoicesView() {
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [sortCol, setSortCol] = useState<string>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionBarVisible, setActionBarVisible] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; invoice: Invoice } | null>(null);
  const [arAgingFilter, setArAgingFilter] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const res = await api.getInvoices(filterStatus || undefined);
        setInvoices(res.invoices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices');
        addToast({ variant: 'error', title: 'Load Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message, statusCode: err instanceof ApiError ? err.statusCode : undefined });
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [filterStatus]);

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Listen for AR aging filter from ForecastView
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setArAgingFilter(detail.filter);
      addToast({ variant: 'info', title: 'AR Aging Filter', message: `Filtered to: ${detail.label}`, statusCode: 200 });
    };
    window.addEventListener('ar-filter-change', handler);
    return () => window.removeEventListener('ar-filter-change', handler);
  }, []);

  async function processFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      addToast({ variant: 'error', title: 'Unsupported File', message: `${file.name}: accepted formats are PDF, JPG, PNG only` });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      addToast({ variant: 'error', title: 'File Too Large', message: `${file.name} exceeds 50MB limit` });
      return;
    }

    const fileId = `upload-${Date.now()}-${Math.random()}`;
    setUploadQueue((prev) => [...prev, { file_id: fileId, filename: file.name, progress: 0, status: 'uploading' }]);
    setUploading(true);

    try {
      // Simulate progress
      for (let p = 0; p <= 80; p += 20) {
        await new Promise((r) => setTimeout(r, 200));
        setUploadQueue((prev) =>
          prev.map((f) => (f.file_id === fileId ? { ...f, progress: p } : f))
        );
      }

      const result = await api.uploadInvoice(file);
      setUploadQueue((prev) =>
        prev.map((f) => (f.file_id === fileId ? { ...f, progress: 100, status: 'done', invoice_id: result.invoice_id } : f))
      );
      addToast({ variant: 'success', title: 'Upload Complete', message: `Invoice ${result.invoice_id} created from ${file.name}`, statusCode: 200 });

      const res = await api.getInvoices(filterStatus || undefined);
      setInvoices(res.invoices);
    } catch (err) {
      setUploadQueue((prev) =>
        prev.map((f) => (f.file_id === fileId ? { ...f, status: 'error', error: String(err) } : f))
      );
      addToast({ variant: 'error', title: 'Upload Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message, statusCode: err instanceof ApiError ? err.statusCode : undefined });
    } finally {
      setTimeout(() => {
        setUploadQueue((prev) => prev.filter((f) => f.file_id !== fileId));
        setUploading(uploadQueue.length > 1);
      }, 3000);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(processFile);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  async function handleInvoiceClick(invoice: Invoice) {
    setSelectedInvoice(invoice);
    try {
      const detail = await api.getInvoice(invoice.id);
      setSelectedInvoice({ ...invoice, ...detail.invoice });
    } catch {
      // keep basic data
    }
  }

  function closeDrawer() {
    setSelectedInvoice(null);
  }

  function handleContextMenu(e: React.MouseEvent, invoice: Invoice) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, invoice });
  }

  async function handleContextAction(action: string, invoice: Invoice) {
    setContextMenu(null);
    if (action === 'view') handleInvoiceClick(invoice);
    else if (action === 'copy') {
      await navigator.clipboard.writeText(invoice.id);
      addToast({ variant: 'success', title: 'Copied', message: `Invoice ID ${invoice.id} copied to clipboard` });
    } else if (action === 'export_csv') {
      try {
        const blob = await api.exportCSV('invoices');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `invoice-${invoice.id}.csv`; a.click();
        URL.revokeObjectURL(url);
        addToast({ variant: 'success', title: 'Export Complete', message: `Invoice ${invoice.id} exported` });
      } catch (err) {
        addToast({ variant: 'error', title: 'Export Failed', message: (err as Error).message });
      }
    } else if (action === 'flag') {
      setInvoices((prev) =>
        prev.map((inv) => inv.id === invoice.id ? { ...inv, status: 'Needs Review' } : inv)
      );
      addToast({ variant: 'info', title: 'Flagged', message: `Invoice ${invoice.id} flagged for review` });
    }
  }

  // Duplicate detection: flag invoices with same vendor, same amount, similar date
  function getDuplicateWarning(invoice: Invoice) {
    return invoices.find((other) =>
      other.id !== invoice.id &&
      other.vendor === invoice.vendor &&
      other.amount === invoice.amount &&
      other.date &&
      invoice.date &&
      Math.abs((new Date(other.date).getTime() - new Date(invoice.date).getTime()) / (1000 * 60 * 60 * 24)) <= 7
    );
  }

  // Sorting
  const sorted = [...invoices].sort((a, b) => {
    let va: string | number = '';
    let vb: string | number = '';
    if (sortCol === 'amount') { va = parseFloat(String(a.amount || '0')); vb = parseFloat(String(b.amount || '0')); }
    else if (sortCol === 'date') { va = a.date || ''; vb = b.date || ''; }
    else if (sortCol === 'due_date') { va = a.due_date || ''; vb = b.due_date || ''; }
    else if (sortCol === 'vendor') { va = a.vendor || ''; vb = b.vendor || ''; }
    else if (sortCol === 'status') { va = a.status || ''; vb = b.status || ''; }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter((inv) => {
    if (arAgingFilter) {
      const status = (inv.status || '').toLowerCase();
      if (arAgingFilter === 'current') return status !== 'overdue';
      if (arAgingFilter === 'overdue_1_30') return status === 'overdue';
      if (arAgingFilter === 'overdue_31_60') return status === 'overdue';
      if (arAgingFilter === 'overdue_61_90') return status === 'overdue';
      if (arAgingFilter === 'overdue_90_plus') return status === 'overdue';
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (inv.vendor || '').toLowerCase().includes(q) ||
      (inv.id || '').toLowerCase().includes(q) ||
      String(inv.amount || '').includes(q) ||
      (inv.status || '').toLowerCase().includes(q)
    );
  });

  const statusColors: Record<string, string> = {
    'matched': 'bg-primary/10 text-primary border-primary/20',
    'approved': 'bg-primary/10 text-primary border-primary/20',
    'pending': 'bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20',
    'overdue': 'bg-error/10 text-error border-error/20',
    'review': 'bg-tertiary/10 text-tertiary border-tertiary/20',
    'processing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'reconciled': 'bg-primary/10 text-primary border-primary/20',
    'needs review': 'bg-tertiary/10 text-tertiary border-tertiary/20',
    'voided': 'bg-surface-container-high text-on-surface-variant border-surface-container-high',
    'ai extracted': 'bg-secondary/10 text-secondary border-secondary/20',
  };

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      setActionBarVisible(next.size > 0);
      return next;
    });
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-instrument text-4xl italic text-on-surface">Ledger Invoices</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage and audit institutional payables</p>
        </div>
        <div className="flex gap-3">
          {arAgingFilter && (
            <button
              onClick={() => {
                sessionStorage.removeItem('ar_aging_filter');
                setArAgingFilter(null);
                addToast({ variant: 'info', title: 'Filter Cleared', message: 'AR aging filter removed', statusCode: 200 });
              }}
              className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">filter_alt</span>
              AR: {sessionStorage.getItem('ar_aging_label') || arAgingFilter}
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <Link to="/invoices/vendors" className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">factory</span> Vendors
          </Link>
          <Link to="/invoices/batches" className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">grid_view</span> Batch Processing
          </Link>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-on-primary-container px-6 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-primary/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">upload</span> Upload Invoice
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            ref={searchRef}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant"
            placeholder="Search vendor, invoice number, amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
        <button
          onClick={() => setAdvancedOpen((o) => !o)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            advancedOpen ? 'bg-primary-container text-on-primary-container border-primary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-sm mr-1">tune</span>
          Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {advancedOpen && (
        <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/10 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary/30 appearance-none"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s.toLowerCase().replace(' ', '_')}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Issue Date From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Issue Date To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary/30" />
                <span className="text-on-surface-variant">–</span>
                <input type="number" placeholder="Max" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary/30" />
              </div>
            </div>
          </div>
          {(filterStatus || dateFrom || dateTo || amountMin || amountMax) && (
            <div className="flex gap-2 flex-wrap">
              {filterStatus && <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold flex items-center gap-1">{filterStatus}<button onClick={() => setFilterStatus('')} className="ml-1">×</button></span>}
              {dateFrom && <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold flex items-center gap-1">From: {dateFrom}<button onClick={() => setDateFrom('')} className="ml-1">×</button></span>}
              {dateTo && <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold flex items-center gap-1">To: {dateTo}<button onClick={() => setDateTo('')} className="ml-1">×</button></span>}
              {(amountMin || amountMax) && <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">${amountMin || '0'} – ${amountMax || '∞'}</span>}
              <button onClick={() => { setFilterStatus(''); setDateFrom(''); setDateTo(''); setAmountMin(''); setAmountMax(''); }} className="text-xs text-error hover:underline ml-2">Clear all</button>
            </div>
          )}
        </div>
      )}

      {/* Hero: Upload Zone with Glow Animation */}
      <section
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 shadow-[0_0_24px_rgba(98,223,125,0.2)]'
            : 'border-primary/30 bg-surface-container-low hover:border-primary/50 hover:bg-surface-container-low/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />

        {/* Progress / queue overlay */}
        {uploadQueue.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 top-auto h-full flex flex-col justify-center px-8 z-10 bg-surface-container-low/95">
            {uploadQueue.map((f) => (
              <div key={f.file_id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-on-surface truncate max-w-xs">{f.filename}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {f.status === 'done' && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                    {f.status === 'error' && <span className="material-symbols-outlined text-error text-sm">error</span>}
                    {f.status !== 'done' && f.status !== 'error' && (
                      <span className="text-[10px] font-mono text-on-surface-variant">{f.progress}%</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadQueue((prev) => prev.filter((u) => u.file_id !== f.file_id)); }}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${f.status === 'error' ? 'bg-error' : f.status === 'done' ? 'bg-primary' : 'bg-primary'}`}
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!uploading || uploadQueue.length === 0 ? (
          <div className="flex flex-col items-center gap-3 z-10">
            <div className={`p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform ${isDragOver ? 'pulse-accent shadow-[0_0_20px_rgba(98,223,125,0.3)]' : ''}`}>
              <span className="material-symbols-outlined text-3xl">cloud_upload</span>
            </div>
            <div className="text-center">
              <p className="text-on-surface font-semibold">Drop invoices here or click to upload</p>
              <p className="text-on-surface-variant text-xs mt-1">Supports PDF, JPG, PNG (Max 50MB)</p>
            </div>
          </div>
        ) : null}
      </section>

      {/* Table Section */}
      <section className="bg-surface-container rounded-xl overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} cols={8} />)}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 flex-col gap-4">
            <span className="material-symbols-outlined text-error text-4xl">error</span>
            <p className="text-error text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 flex-col gap-4">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">receipt_long</span>
            <p className="text-on-surface-variant text-sm">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                  <th className="w-10 px-4 py-4">
                    <input type="checkbox" className="accent-primary" onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(filtered.map(i => i.id)));
                      else setSelectedIds(new Set());
                      setActionBarVisible(e.target.checked && filtered.length > 0);
                    }} />
                  </th>
                  {[
                    { col: 'id', label: 'Invoice #' },
                    { col: 'vendor', label: 'Vendor' },
                    { col: 'date', label: 'Issue Date' },
                    { col: 'due_date', label: 'Due Date' },
                    { col: 'amount', label: 'Amount' },
                    { col: 'status', label: 'Status' },
                    { col: 'confidence', label: 'Confidence' },
                  ].map(({ col, label }) => (
                    <th
                      key={col}
                      onClick={() => { setSortCol(col); setSortDir(sortCol === col && sortDir === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest cursor-pointer hover:text-on-surface"
                    >
                      {label} {sortCol === col && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((invoice) => {
                  const duplicate = getDuplicateWarning(invoice);
                  return (
                    <tr
                      key={invoice.id}
                      onContextMenu={(e) => handleContextMenu(e, invoice)}
                      className={`hover:bg-surface-container-highest/30 transition-colors cursor-pointer group ${selectedIds.has(invoice.id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(invoice.id); }}>
                        <input type="checkbox" className="accent-primary" checked={selectedIds.has(invoice.id)} onChange={() => {}} />
                      </td>
                      <td className="px-4 py-3" onClick={() => handleInvoiceClick(invoice)}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-primary text-sm tracking-tight">{invoice.id}</span>
                          {duplicate && (
                            <button
                              title="Potential duplicate detected"
                              className="text-amber-400 hover:text-amber-300"
                              onClick={(e) => { e.stopPropagation(); addToast({ variant: 'warning', title: 'Duplicate Warning', message: `Invoice ${invoice.id} may be a duplicate of ${duplicate.id}` }); }}
                            >
                              <span className="material-symbols-outlined text-sm">warning</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-sm" onClick={() => handleInvoiceClick(invoice)}>{invoice.vendor || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant" onClick={() => handleInvoiceClick(invoice)}>{invoice.date || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant" onClick={() => handleInvoiceClick(invoice)}>{invoice.due_date || '—'}</td>
                      <td className="px-4 py-3 font-mono text-sm text-right text-on-surface font-semibold" onClick={() => handleInvoiceClick(invoice)}>
                        {invoice.amount ? `$${parseFloat(invoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-4 py-3" onClick={() => handleInvoiceClick(invoice)}>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[invoice.status?.toLowerCase()] || statusColors.pending}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={() => handleInvoiceClick(invoice)}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(invoice.confidence ?? 0) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-mono">{invoice.confidence ? `${Math.round(invoice.confidence * 100)}%` : '—'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sticky Action Bar for batch selection */}
      {actionBarVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-container-high border border-outline-variant shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6">
          <span className="text-sm font-bold text-on-surface">{selectedIds.size} selected</span>
          <button
            onClick={async () => {
              try {
                addToast({ variant: 'info', title: 'Reconciling', message: `Reconciling ${selectedIds.size} invoice(s)...` });
                const result = await api.triggerReconciliation();
                addToast({ variant: 'success', title: 'Reconciliation Complete', message: result.status, statusCode: 200 });
                setSelectedIds(new Set());
                setActionBarVisible(false);
              } catch (err) {
                addToast({ variant: 'error', title: 'Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message, statusCode: err instanceof ApiError ? err.statusCode : undefined });
              }
            }}
            className="px-4 py-2 bg-amber-500 text-on-primary-container font-bold rounded-lg text-sm hover:opacity-90"
          >
            Reconcile Selected
          </button>
          <button
            onClick={async () => {
              try {
                const blob = await api.exportCSV('invoices');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `invoices-selected-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                addToast({ variant: 'success', title: 'Export Complete', message: `${selectedIds.size} invoice(s) exported`, statusCode: 200 });
              } catch (err) {
                addToast({ variant: 'error', title: 'Export Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message, statusCode: err instanceof ApiError ? err.statusCode : undefined });
              }
            }}
            className="px-4 py-2 bg-surface text-on-surface font-semibold rounded-lg text-sm border border-outline-variant"
          >
            Export CSV
          </button>
          <button onClick={() => { setSelectedIds(new Set()); setActionBarVisible(false); }} className="p-2 hover:bg-surface rounded-lg text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-[200] bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl py-1 min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {[
            { icon: 'visibility', label: 'View Detail', action: 'view' },
            { icon: 'content_copy', label: 'Copy Invoice ID', action: 'copy' },
            { icon: 'ios_share', label: 'Export this row as CSV', action: 'export_csv' },
            { icon: 'flag', label: 'Flag for Review', action: 'flag' },
          ].map((item) => (
            <button
              key={item.action}
              onClick={() => handleContextAction(item.action, contextMenu.invoice)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-base text-on-surface-variant">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Detail Drawer — 360px per spec */}
      {selectedInvoice && (
        <>
          <div onClick={closeDrawer} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45]" />
          <aside className="fixed top-0 right-0 h-full w-[360px] bg-surface-container-low shadow-2xl z-50 flex flex-col border-l border-outline-variant/10 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Document Preview</span>
              <button onClick={closeDrawer} className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* PDF Preview area */}
            <div className="p-5 border-b border-outline-variant/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">PDF Preview</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-surface-container rounded text-on-surface-variant"><span className="material-symbols-outlined text-sm">zoom_in</span></button>
                  <button className="p-1 hover:bg-surface-container rounded text-on-surface-variant"><span className="material-symbols-outlined text-sm">print</span></button>
                </div>
              </div>
              <div className="bg-[#2a2d33] rounded h-[200px] flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">description</span>
                  <p className="text-[10px] text-on-surface-variant/30 mt-2 font-mono">PDF Preview</p>
                </div>
              </div>
            </div>

            {/* Extracted Fields */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <h3 className="font-instrument text-xl italic mb-1">Review Invoice</h3>
                <p className="text-[10px] font-mono text-primary uppercase tracking-tighter">
                  Confidence: {selectedInvoice.confidence ? `${Math.round(selectedInvoice.confidence * 100)}%` : '—'}
                </p>
              </div>

              {[
                { label: 'Vendor Name', key: 'vendor', type: 'text' },
                { label: 'Invoice Number', key: 'invoice_number', type: 'text' },
                { label: 'Issue Date', key: 'date', type: 'date' },
                { label: 'Due Date', key: 'due_date', type: 'date' },
                { label: 'Amount', key: 'amount', type: 'text' },
                { label: 'Tax Amount', key: 'tax_amount', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type={type}
                      className="flex-1 bg-surface-container-low border-none rounded p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary/40"
                      defaultValue={String(selectedInvoice[key as keyof Invoice] || '')}
                    />
                    <button className="text-on-surface-variant hover:text-primary p-1">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Notes</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded p-2.5 text-sm focus:ring-1 focus:ring-primary/40"
                  rows={3}
                  placeholder="Add notes..."
                />
              </div>

              {/* Override indicator */}
              {selectedInvoice.manually_overridden && (
                <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Manually overridden
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-outline-variant/10 space-y-2">
              <button className="w-full bg-primary text-on-primary-container font-bold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button">
                <span className="material-symbols-outlined text-lg">check_circle</span> Approve for Ledger
              </button>
              <button className="w-full bg-surface-container text-on-surface border border-outline-variant/20 font-semibold py-3 rounded-lg hover:bg-surface-container-high transition-all" type="button">
                Save Draft
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
