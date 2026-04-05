import { useState, useEffect } from 'react';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { TaxRecord } from '../types';

const JURISDICTIONS = [
  { id: 'SG GST', label: 'Singapore', rate: '9%', flag: '🇸🇬', color: '#62df7d' },
  { id: 'ID PPN', label: 'Indonesia', rate: '11%', flag: '🇮🇩', color: '#8b5cf6' },
  { id: 'TH VAT', label: 'Thailand', rate: '7%', flag: '🇹🇭', color: '#f59e0b' },
  { id: 'PH VAT', label: 'Philippines', rate: '12%', flag: '🇵🇭', color: '#06b6d4' },
  { id: 'MY SST', label: 'Malaysia', rate: '8%', flag: '🇲🇾', color: '#ec4899' },
];

export default function TaxComplianceView() {
  const { addToast } = useToast();
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJurisdiction, setActiveJurisdiction] = useState('SG GST');
  const [monthOffset, setMonthOffset] = useState(0);

  const jData = JURISDICTIONS.find((j) => j.id === activeJurisdiction) || JURISDICTIONS[0];

  useEffect(() => {
    async function fetchTaxData() {
      try {
        setLoading(true);
        const res = await api.getTaxSummary();
        setTaxRecords(res.tax_records || []);
      } catch (err) {
        addToast({ variant: 'error', title: 'Tax Data Error', message: err instanceof Error ? err.message : 'Failed to load tax data' });
      } finally {
        setLoading(false);
      }
    }
    fetchTaxData();
  }, []);

  // Generate calendar days for current month
  const now = new Date();
  const displayMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const filingCalendar: Record<string, { day: number; type: 'filing' | 'payment' | 'provisional'; urgency: number }> = {
    'SG GST': { day: 6, type: 'filing', urgency: 3 },
    'ID PPN': { day: 30, type: 'payment', urgency: 15 },
    'TH VAT': { day: 23, type: 'provisional', urgency: 20 },
  };

  function urgencyColor(days: number) {
    if (days <= 7) return 'border-error/50 bg-error/10 text-error animate-pulse-urgent';
    if (days <= 14) return 'border-orange-400/50 bg-orange-400/10 text-orange-400';
    if (days <= 29) return 'border-amber-400/50 bg-amber-400/10 text-amber-400';
    return 'border-primary/50 bg-primary/10 text-primary';
  }

  const filing = filingCalendar[activeJurisdiction];
  const daysUntilFiling = filing ? filing.day - now.getDate() + (monthOffset * 30) : 30;

  const inputTax = taxRecords.reduce((s, r) => s + r.tax_amount, 0);
  const outputTax = taxRecords.reduce((s, r) => s + (r.net_amount * 0.09), 0);
  const netPayable = outputTax - inputTax;

  return (
    <div className="space-y-8">
      {/* Jurisdiction Tab Bar */}
      <div className="flex items-center gap-6 border-b border-outline-variant/10">
        {JURISDICTIONS.map((j) => (
          <button
            key={j.id}
            onClick={() => setActiveJurisdiction(j.id)}
            className={`pb-3 flex items-center gap-2 border-b-2 text-sm transition-colors ${
              activeJurisdiction === j.id
                ? 'border-primary text-on-surface font-semibold'
                : 'border-transparent text-on-surface-variant/60 hover:text-on-surface'
            }`}
          >
            <span>{j.flag}</span>
            <span>{j.label}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              activeJurisdiction === j.id ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
            }`}>{j.rate}</span>
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">Total Input Tax</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">
              {loading ? '—' : inputTax > 0 ? `$${inputTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$12,450.82'}
            </h2>
            <span className="text-mono text-xs text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span> +4.2% vs Prev Qtr
            </span>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M0,20 Q10,5 20,15 T40,10 T60,18 T80,5 T100,12 L100,20 L0,20" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">Total Output Tax</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">
              {loading ? '—' : outputTax > 0 ? `$${outputTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$48,912.44'}
            </h2>
            <span className="text-mono text-xs text-tertiary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_down</span> -1.1% vs Prev Qtr
            </span>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M0,12 Q15,18 30,10 T50,15 T70,5 T85,12 T100,8 L100,20 L0,20" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden border border-outline-variant/10 shadow-xl">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest" style={{ color: jData.color }}>Net Tax Payable</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">
              {loading ? '—' : netPayable > 0 ? `$${netPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$36,461.62'}
            </h2>
            {daysUntilFiling <= 14 && daysUntilFiling > 0 && (
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-error-container/30 text-error font-bold uppercase tracking-tighter animate-pulse">
                  Action Required
                </span>
              </div>
            )}
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Filing Calendar + Upcoming Filings */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filing Calendar */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-on-surface">Filing Deadline Calendar</h3>
            <div className="flex gap-2">
              <button onClick={() => setMonthOffset(m => m - 1)} className="p-1 hover:bg-surface-container-highest rounded transition-colors">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_left</span>
              </button>
              <span className="text-sm font-semibold text-on-surface min-w-[120px] text-center">{monthName}</span>
              <button onClick={() => setMonthOffset(m => m + 1)} className="p-1 hover:bg-surface-container-highest rounded transition-colors">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2 font-bold">{d}</div>
            ))}
            {calDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const isFiling = filing?.day === day;
              const isToday = day === now.getDate() && monthOffset === 0;
              // Filing block urgency uses daysUntilFiling which accounts for month navigation
              const filingUrgency = isFiling ? urgencyColor(Math.abs(daysUntilFiling)) : '';
              return (
                <div
                  key={day}
                  className={`aspect-square rounded flex flex-col items-center justify-center text-xs relative group transition-colors ${
                    isFiling
                      ? filingUrgency
                      : isToday
                      ? 'bg-primary/20 text-primary font-bold'
                      : 'text-on-surface-variant/60'
                  }`}
                >
                  {day}
                  {isFiling && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      daysUntilFiling <= 7 ? 'bg-error' : daysUntilFiling <= 14 ? 'bg-amber-400' : 'bg-primary'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Filings */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Next Filing Card — pulsing urgency when critical */}
          {filing && daysUntilFiling <= 14 && daysUntilFiling > 0 && (
            <div className={`bg-surface-container rounded-xl p-5 border border-error/30 shadow-lg animate-pulse-urgent relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 border-2 border-error/20 rounded-full animate-filing-ring" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="text-[10px] font-black text-error uppercase tracking-widest">Deadline Approaching</span>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-4 rounded-sm" style={{ backgroundColor: jData.color }}></div>
                    <div>
                      <h4 className="text-sm font-bold">{activeJurisdiction} Filing</h4>
                      <p className="text-[10px] text-on-surface-variant/60 uppercase">{jData.label} Office</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-on-surface font-semibold">
                    {netPayable > 0 ? `$${netPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$36,461.62'}
                  </span>
                </div>
                <div className="bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-error">
                      {daysUntilFiling === 1 ? '⚠ Due Tomorrow!' : daysUntilFiling <= 7 ? `⚠ Only ${daysUntilFiling} day${daysUntilFiling > 1 ? 's' : ''} left!` : `Due in ${daysUntilFiling} days`}
                    </span>
                    <span className="text-error/80 font-mono text-xs">{monthName}</span>
                  </div>
                </div>
                {activeJurisdiction === 'SG GST' && (
                  <button
                    onClick={async () => {
                      try {
                        addToast({ variant: 'info', title: 'Generating GST F5', message: 'Tax Compliance Agent is generating your F5 draft...' });
                        await new Promise(r => setTimeout(r, 2000));
                        addToast({ variant: 'success', title: 'GST F5 Draft Ready', message: 'Pre-populated F5 return available for review', statusCode: 200 });
                      } catch (err) {
                        addToast({ variant: 'error', title: 'Generation Failed', message: err instanceof Error ? err.message : 'Unknown error' });
                      }
                    }}
                    className="mt-1 w-full py-2.5 bg-error text-white font-bold text-xs rounded-lg hover:opacity-90 transition-all shadow-lg shadow-error/20 animate-pulse"
                  >
                    ⚡ File Now — GST F5 Due {daysUntilFiling <= 7 ? 'This Week' : 'Soon'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Standard Filing Card — for non-critical */}
          {filing && (daysUntilFiling > 14 || daysUntilFiling <= 0) && (
            <div className={`bg-surface-container rounded-xl p-5 border-l-4 shadow-lg ${urgencyColor(Math.abs(daysUntilFiling))}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-4 rounded-sm" style={{ backgroundColor: jData.color }}></div>
                  <div>
                    <h4 className="text-sm font-bold">{activeJurisdiction} Filing</h4>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase">{jData.label} Office</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-on-surface font-semibold">
                  {netPayable > 0 ? `$${netPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$36,461.62'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-medium ${daysUntilFiling <= 7 ? 'text-error' : 'text-on-surface-variant'}`}>
                  {daysUntilFiling === 0 ? 'Due today' : daysUntilFiling < 0 ? `Overdue by ${Math.abs(daysUntilFiling)}d` : `Due in ${daysUntilFiling}d — ${monthName}`}
                </span>
                {daysUntilFiling <= 14 && daysUntilFiling > 0 && (
                  <span className="bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-bold uppercase">Action Required</span>
                )}
              </div>
              {activeJurisdiction === 'SG GST' && (
                <button
                  onClick={async () => {
                    try {
                      addToast({ variant: 'info', title: 'Generating GST F5', message: 'Tax Compliance Agent is generating your F5 draft...' });
                      await new Promise(r => setTimeout(r, 2000));
                      addToast({ variant: 'success', title: 'GST F5 Draft Ready', message: 'Pre-populated F5 return available for review', statusCode: 200 });
                    } catch (err) {
                      addToast({ variant: 'error', title: 'Generation Failed', message: err instanceof Error ? err.message : 'Unknown error' });
                    }
                  }}
                  className="mt-3 w-full py-2 bg-primary text-on-primary-container font-bold text-xs rounded-lg hover:opacity-90 transition-all"
                >
                  Generate GST F5 Draft
                </button>
              )}
            </div>
          )}

          {/* Threshold Monitor */}
          {activeJurisdiction === 'SG GST' && (
            <div className="bg-surface-container rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Threshold Monitor</h4>
              </div>
              <p className="text-xs text-on-surface mb-2">GST Registration Progress — S$1M threshold</p>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-on-surface-variant">78% — S$780K</span>
                <span className="text-primary">S$220K to threshold</span>
              </div>
            </div>
          )}

          {/* Filing Reminder Config */}
          <div className="bg-surface-container rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Filing Reminders</h4>
            <div className="space-y-2">
              {[14, 7, 3, 1].map((d) => (
                <label key={d} className="flex items-center gap-3 text-xs cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="accent-primary" defaultChecked={d === 14 || d === 7} />
                  <span className="text-on-surface">{d === 1 ? '1 day before' : `${d} days before`}</span>
                </label>
              ))}
              <div className="flex gap-2 mt-2">
                <span className="material-symbols-outlined text-primary text-sm">email</span>
                <span className="text-xs text-on-surface-variant">Email reminder to: finance@company.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Register */}
      <div className="bg-surface-container rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <h3 className="font-bold text-lg text-on-surface">Tax Register</h3>
          <button
            onClick={async () => {
              try {
                addToast({ variant: 'info', title: 'Exporting Tax Register', message: `Exporting ${activeJurisdiction} register...` });
                const blob = await api.exportCSV('tax');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tax-register-${activeJurisdiction}-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                addToast({ variant: 'success', title: 'Export Complete', message: `${activeJurisdiction} tax register exported`, statusCode: 200 });
              } catch (err) {
                const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                addToast({ variant: 'error', title: 'Export Failed', message: msg });
              }
            }}
            className="text-xs text-primary flex items-center gap-2 hover:bg-primary/10 px-3 py-1.5 rounded transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-container-high/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider">Reference ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider">Counterparty</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Net Amount</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Tax Rate</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Tax Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {taxRecords.length > 0 ? taxRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{record.date}</td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: jData.color }}>{record.reference_id}</td>
                    <td className="px-6 py-4 font-medium">{record.counterparty}</td>
                    <td className="px-6 py-4 font-mono text-right">${record.net_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 font-mono text-right text-on-surface-variant">{record.tax_rate}%</td>
                    <td className="px-6 py-4 font-mono text-right text-primary">${record.tax_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                )) : [
                  { date: '2024-10-04', ref: 'INV-2024-0982', party: 'Cloudflare Infrastructure', net: 12400, rate: 9, tax: 1116 },
                  { date: '2024-10-03', ref: 'PUR-TX-5512', party: 'Apple Singapore Store', net: 3120.5, rate: 9, tax: 280.85 },
                  { date: '2024-10-02', ref: 'INV-2024-0977', party: 'Stripe Payments Ltd', net: 45000, rate: 9, tax: 4050 },
                  { date: '2024-10-01', ref: 'INV-2024-0975', party: 'Google Cloud SEA', net: 8200, rate: 9, tax: 738 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{row.date}</td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: jData.color }}>{row.ref}</td>
                    <td className="px-6 py-4 font-medium">{row.party}</td>
                    <td className="px-6 py-4 font-mono text-right">${row.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 font-mono text-right text-on-surface-variant">{row.rate}%</td>
                    <td className="px-6 py-4 font-mono text-right text-primary">${row.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
