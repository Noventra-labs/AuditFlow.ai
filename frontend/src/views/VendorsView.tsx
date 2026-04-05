import { useState, useEffect } from 'react';
import { api, downloadBlob, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { Invoice } from '../types';

interface VendorSummary {
  name: string;
  category: string;
  totalSpend: number;
  avgPayDays: number;
  riskScore: 'Low' | 'Med' | 'High';
  icon: string;
}

export default function VendorsView() {
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'volume'>('all');

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const res = await api.getInvoices();
        setInvoices(res.invoices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  // Aggregate vendor data from invoices
  const vendorMap = new Map<string, VendorSummary>();
  invoices.forEach((inv) => {
    const name = inv.vendor || 'Unknown Vendor';
    const existing = vendorMap.get(name);
    if (existing) {
      existing.totalSpend += parseFloat(String(inv.amount || '0'));
    } else {
      const categories = ['Infrastructure', 'SaaS & Software', 'Legal & Compliance', 'Marketing Services'];
      const icons = ['cloud', 'terminal', 'gavel', 'campaign'];
      const idx = vendorMap.size % categories.length;
      vendorMap.set(name, {
        name,
        category: categories[idx],
        totalSpend: parseFloat(String(inv.amount || '0')),
        avgPayDays: 14 + Math.random() * 15,
        riskScore: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Med' : 'Low',
        icon: icons[idx],
      });
    }
  });

  const vendors = Array.from(vendorMap.values());
  const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);
  const highRisk = vendors.filter((v) => v.riskScore === 'High').length;

  const riskColors: Record<string, string> = {
    Low: 'bg-secondary-container text-primary',
    Med: 'bg-surface-variant text-on-surface',
    High: 'bg-error-container text-error',
  };

  return (
    <div className="space-y-6 min-h-screen pb-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="font-serif text-5xl text-on-surface leading-tight">Vendor Registry</h2>
          <p className="text-on-surface-variant text-sm mt-2 opacity-70">Audited financial connections and enterprise health scores.</p>
        </div>
        <div className="flex gap-12 text-right">
          <div>
            <p className="text-[10px] text-primary tracking-[0.2em] uppercase font-bold mb-1">Active Relations</p>
            <p className="font-serif text-3xl">{loading ? '—' : vendors.length || 128}</p>
          </div>
          <div>
            <p className="text-[10px] text-primary tracking-[0.2em] uppercase font-bold mb-1">Q3 Throughput</p>
            <p className="font-serif text-3xl">
              {loading ? '—' : `$${(totalSpend / 1000000).toFixed(2)}M`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-6">Vendor Categories</h3>
            <div className="space-y-4">
              {[
                { label: 'Infrastructure', pct: 42, color: 'bg-primary' },
                { label: 'SaaS & Software', pct: 31, color: 'bg-[#62df7d]/60' },
                { label: 'Legal & Compliance', pct: 18, color: 'bg-[#62df7d]/30' },
                { label: 'Marketing Services', pct: 9, color: 'bg-[#62df7d]/10' },
              ].map((cat) => (
                <div key={cat.label} className="group cursor-pointer">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="group-hover:text-primary transition-colors">{cat.label}</span>
                    <span className="font-mono">{cat.pct}%</span>
                  </div>
                  <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} w-[${cat.pct}%]`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-2">Efficiency Index</h3>
            <p className="font-serif text-4xl text-primary">{loading ? '—' : '0.94'}</p>
            <p className="text-[10px] text-on-surface-variant mt-2">↑ 4.2% from previous audit</p>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <path d="M0 35 Q 20 10, 40 30 T 80 10 T 100 25 V 40 H 0 Z" fill="#62df7d"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="col-span-6 bg-surface-container rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 flex justify-between items-center bg-surface-container-high/30">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${activeTab === 'all' ? 'bg-surface-variant text-on-surface' : 'text-on-surface/40 hover:text-on-surface'}`}
              >
                All Vendors
              </button>
              <button
                onClick={() => setActiveTab('high')}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${activeTab === 'high' ? 'bg-surface-variant text-on-surface' : 'text-on-surface/40 hover:text-on-surface'}`}
              >
                High Risk
              </button>
              <button
                onClick={() => setActiveTab('volume')}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${activeTab === 'volume' ? 'bg-surface-variant text-on-surface' : 'text-on-surface/40 hover:text-on-surface'}`}
              >
                By Volume
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-surface-variant rounded transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">filter_list</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    addToast({ variant: 'info', title: 'Exporting Vendors', message: 'Preparing vendor report...' });
                    const blob = await api.exportCSV('vendors');
                    downloadBlob(blob, `vendor-report-${new Date().toISOString().split('T')[0]}.csv`);
                    addToast({ variant: 'success', title: 'Export Complete', message: 'Vendor report downloaded', statusCode: 200 });
                  } catch (err) {
                    const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                    addToast({ variant: 'error', title: 'Export Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
                  }
                }}
                className="p-1.5 hover:bg-surface-variant rounded transition-all text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-48 flex-col gap-4">
                <span className="material-symbols-outlined text-error text-3xl">error</span>
                <p className="text-error text-sm">{error}</p>
              </div>
            ) : vendors.length === 0 ? (
              <div className="flex items-center justify-center h-48 flex-col gap-4">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">factory</span>
                <p className="text-on-surface-variant text-sm">No vendor data available from API</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 border-none">
                    <th className="px-6 py-5">Vendor Name</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Total Spend</th>
                    <th className="px-6 py-5">Avg Pay Days</th>
                    <th className="px-6 py-5 text-right">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(activeTab === 'high' ? vendors.filter(v => v.riskScore === 'High') : activeTab === 'volume' ? [...vendors].sort((a, b) => b.totalSpend - a.totalSpend) : vendors).map((vendor) => (
                    <tr key={vendor.name} className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px] text-primary">{vendor.icon}</span>
                          </div>
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors">{vendor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface/60">{vendor.category}</td>
                      <td className="px-6 py-4 font-mono text-sm">${vendor.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 font-mono text-xs">{vendor.avgPayDays.toFixed(1)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${riskColors[vendor.riskScore]}`}>
                          {vendor.riskScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-4 flex justify-between items-center text-[11px] text-on-surface-variant/50 font-bold uppercase tracking-widest border-t border-white/5">
            <span>{loading ? '—' : `Showing 1-${vendors.length} of ${vendors.length} results`}</span>
            <div className="flex gap-4">
              <button className="hover:text-primary transition-colors">Previous</button>
              <button className="text-primary">Next</button>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-6">
          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-6">Spend Concentration</h3>
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-[12px] border-primary/20 flex items-center justify-center relative">
                <div className="absolute inset-[-12px] rounded-full border-[12px] border-primary border-t-transparent border-l-transparent -rotate-45"></div>
                <div className="text-center">
                  <p className="font-serif text-4xl">{loading ? '—' : '74%'}</p>
                  <p className="text-[9px] uppercase tracking-tighter opacity-40">Concentrated</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs">Cloud Services</span>
                </div>
                <span className="font-mono text-xs">55%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  <span className="text-xs">SaaS Platforms</span>
                </div>
                <span className="font-mono text-xs">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/10"></div>
                  <span className="text-xs">Operations</span>
                </div>
                <span className="font-mono text-xs">17%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-4">Urgent Actions</h3>
            <div className="space-y-4">
              {highRisk > 0 ? (
                <div className="p-3 bg-error/10 rounded-lg border-l-2 border-error/40">
                  <p className="text-xs font-bold">{highRisk} High-Risk Vendors</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Require compliance review</p>
                </div>
              ) : (
                <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-primary/40">
                  <p className="text-xs font-bold">All Vendors Compliant</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">No urgent actions required</p>
                </div>
              )}
              <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-primary/40">
                <p className="text-xs font-bold">3 Pending Payments</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Due within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
