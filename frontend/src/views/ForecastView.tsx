import { useState, useEffect } from 'react';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Skeleton, SkeletonChart } from '../components/SkeletonLoader';
import type { ForecastResponse } from '../types';

export default function ForecastView() {
  const { addToast } = useToast();
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [collectionRate, setCollectionRate] = useState(84);
  const [avgPayDays, setAvgPayDays] = useState(30);
  const [revenueGrowth, setRevenueGrowth] = useState(12.5);
  const [cashInjection, setCashInjection] = useState(0);
  const [runway, setRunway] = useState(11.4);
  const [scenarioVisible, setScenarioVisible] = useState({ conservative: true, base: true, optimistic: true });

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        const res = await api.getForecast();
        setForecast(res);
        if (res.forecast.runway_months) setRunway(res.forecast.runway_months);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchForecast();
  }, []);

  function recalc() {
    const base = 11.4;
    const delta = (collectionRate - 84) * 0.04 + (avgPayDays - 30) * -0.03 + revenueGrowth * 0.08 + (cashInjection / 100000);
    setRunway(Math.max(0, base + delta));
  }

  const runwayColor = runway < 3 ? 'text-error' : runway < 6 ? 'text-amber-400' : 'text-primary';
  const gaugeColor = runway < 3 ? '#ffb4ab' : runway < 6 ? '#f59e0b' : '#62df7d';
  const cashBalance = forecast?.forecast?.cash_balance ?? 2420000;

  const arAging = [
    { bucket: 'Current', amount: 842000, pct: 84 },
    { bucket: '1–30 Days Overdue', amount: 124500, pct: 12.4 },
    { bucket: '31–60 Days Overdue', amount: 89000, pct: 8.9 },
    { bucket: '61–90 Days Overdue', amount: 35000, pct: 3.5 },
    { bucket: '90+ Days', amount: 12000, pct: 1.2 },
  ];

  const apSchedule = [
    { group: 'Due This Week', amount: 24900, count: 3 },
    { group: 'Due Next Week', amount: 128400, count: 5 },
    { group: 'Due This Month', amount: 312000, count: 12 },
    { group: 'Due Next Month', amount: 188000, count: 8 },
  ];

  const assumptions = [
    { label: 'Fixed Monthly Costs', value: '$294,000', editable: true },
    { label: 'Expected New Revenue', value: '$48,000/mo', editable: true },
    { label: 'Next Tax Payment', value: 'Nov 30, 2024 — SGD 36,462', editable: false },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8 pb-16">
        <div className="flex justify-between items-end">
          <div className="space-y-2"><Skeleton height="2rem" width="200px" /><Skeleton height="1rem" width="300px" /></div>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-9 space-y-8">
            <Skeleton height="160px" />
            <SkeletonChart height="380px" />
            <div className="grid grid-cols-2 gap-8"><Skeleton height="300px" /><Skeleton height="300px" /></div>
          </div>
          <div className="col-span-12 xl:col-span-3"><Skeleton height="500px" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary text-[10px] font-mono tracking-widest uppercase">Analysis Module / V0.1</span>
          <h1 className="text-4xl font-instrument text-on-surface leading-none mt-1">Capital Projection <span className="italic text-on-surface/40">2024-2025</span></h1>
        </div>
        <div className="flex gap-3">
          <button onClick={async () => {
            try { setLoading(true); const r = await api.getForecast(); setForecast(r); if (r.forecast.runway_months) setRunway(r.forecast.runway_months); addToast({ variant: 'success', title: 'Forecast Updated', message: 'Latest projection loaded', statusCode: 200 }); }
            catch (err) { addToast({ variant: 'error', title: 'Failed', message: (err as Error).message }); }
            finally { setLoading(false); }
          }} className="px-5 py-2.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span> RE-RUN FORECAST
          </button>
          <button onClick={async () => {
            try { addToast({ variant: 'info', title: 'Exporting', message: 'Preparing CSV...' }); const blob = await api.exportCSV('ledger'); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `forecast-${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url); addToast({ variant: 'success', title: 'Exported', message: 'CSV downloaded', statusCode: 200 }); }
            catch (err) { const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message; addToast({ variant: 'error', title: 'Failed', message: msg }); }
          }} className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg flex items-center gap-2 border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> CSV
          </button>
          <button onClick={async () => {
            try { addToast({ variant: 'info', title: 'Sending', message: 'Dispatching to investors...' }); await api.emailReport('forecast', ['investors@company.com'], 'Capital Projection Report'); addToast({ variant: 'success', title: 'Sent', message: 'Investor report dispatched', statusCode: 200 }); }
            catch (err) { const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message; addToast({ variant: 'error', title: 'Failed', message: msg }); }
          }} className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg flex items-center gap-2 border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">mail</span> EMAIL INVESTORS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-8">
          {/* Hero Gauge */}
          <div className="bg-surface-container rounded-xl p-8 flex items-center gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            <div className="relative w-[200px] h-[120px] flex justify-center items-center shrink-0">
              <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 60">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#181c22" strokeLinecap="round" strokeWidth="8" />
                <path d={`M 10 50 A 40 40 0 0 1 ${Math.min(90, 10 + (runway / 12) * 80)} ${Math.max(10, 50 - (runway / 12) * 40)}`} fill="none" stroke={gaugeColor} strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className={`text-5xl font-instrument ${runwayColor} leading-none`}>{runway.toFixed(1)}<span className="text-xl italic opacity-40 ml-1">mo</span></span>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Current Runway</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Liquidity Floor</span>
                <div className="text-2xl font-instrument">${(cashBalance / 1000000).toFixed(2)}M</div>
                <div className="flex items-center gap-1 text-primary text-[10px] font-mono"><span className="material-symbols-outlined text-[12px]">trending_up</span> +14.2%</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Net Monthly Burn</span>
                <div className="text-2xl font-instrument">$294K</div>
                <div className="flex items-center gap-1 text-error text-[10px] font-mono"><span className="material-symbols-outlined text-[12px]">trending_down</span> -2.4%</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Inflow Accuracy</span>
                <div className="text-2xl font-instrument">98.4%</div>
                <div className="w-full bg-surface-container-high h-1 rounded-full mt-2 overflow-hidden"><div className="bg-primary h-full w-[98.4%]" /></div>
              </div>
            </div>
          </div>

          {/* Scenario Chart */}
          <div className="bg-surface-container rounded-xl p-8 h-[380px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold tracking-tight text-on-surface flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" /> PROJECTED NET ASSETS (90 DAYS)
              </h3>
              <div className="flex gap-4">
                {[
                  { key: 'optimistic', label: 'OPTIMISTIC', dashed: true, color: '#62df7d' },
                  { key: 'base', label: 'BASE CASE', dashed: false, color: '#62df7d' },
                  { key: 'conservative', label: 'CONSERVATIVE', dashed: true, color: '#ffb4ab' },
                ].map((s) => (
                  <button key={s.key} onClick={() => setScenarioVisible(v => ({ ...v, [s.key]: !v[s.key as keyof typeof v] }))}
                    className={`flex items-center gap-2 text-[10px] font-mono transition-opacity ${!scenarioVisible[s.key as keyof typeof scenarioVisible] ? 'opacity-30' : ''}`}>
                    <span className="w-3 h-[1px] border-t border-dashed" style={{ borderColor: s.color }}></span> {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <path d="M0,200 Q150,180 300,160 T600,100 T900,40 L1000,20 L1000,380 L900,350 L600,320 T300,280 Q150,260 0,240 Z" fill="#62df7d" fillOpacity="0.03" />
                {scenarioVisible.optimistic && <path d="M0,150 Q200,120 400,90 T800,30 T1000,10" fill="none" stroke="#62df7d" strokeDasharray="8,4" strokeWidth="2" />}
                {scenarioVisible.base && <path d="M0,220 Q200,200 400,170 T800,110 T1000,70" fill="none" stroke="#62df7d" strokeWidth="3" />}
                {scenarioVisible.conservative && <path d="M0,280 Q200,300 400,320 T800,350 T1000,370" fill="none" stroke="#ffb4ab" strokeDasharray="8,4" strokeWidth="2" />}
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between px-4 pt-4 text-[10px] font-mono text-on-surface-variant/40">
                {['Today', '15d', '30d', '45d', '60d', '75d', '90d'].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>

          {/* AR Aging + AP Schedule */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">A/R Aging Report</h3>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">LIVE FEED</span>
              </div>
              <div className="p-6 space-y-3">
                {arAging.map((row) => (
                  <div key={row.bucket} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          // Persist AR aging filter for InvoicesView to pick up
                          const filterKey = row.bucket === 'Current' ? 'current'
                            : row.bucket === '1–30 Days Overdue' ? 'overdue_1_30'
                            : row.bucket === '31–60 Days Overdue' ? 'overdue_31_60'
                            : row.bucket === '61–90 Days Overdue' ? 'overdue_61_90'
                            : 'overdue_90_plus';
                          sessionStorage.setItem('ar_aging_filter', filterKey);
                          sessionStorage.setItem('ar_aging_label', row.bucket);
                          window.dispatchEvent(new CustomEvent('ar-filter-change', { detail: { filter: filterKey, label: row.bucket } }));
                          addToast({ variant: 'info', title: 'Filter Applied', message: `Showing invoices: ${row.bucket}`, statusCode: 200 });
                        }}
                        className="text-xs text-left text-on-surface hover:text-primary transition-colors font-medium"
                      >
                        {row.bucket}
                      </button>
                      <span className="text-xs font-mono">${row.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.bucket === 'Current' ? 'bg-primary' : row.bucket === '1–30 Days Overdue' ? 'bg-amber-400' : row.bucket === '31–60 Days Overdue' ? 'bg-orange-400' : 'bg-error'}`} style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-on-surface-variant w-10 text-right">{row.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">A/P Payment Schedule</h3>
                <span className="text-[10px] font-mono text-on-surface/40">Q3 FIXED</span>
              </div>
              <div className="p-6 space-y-3">
                {apSchedule.map((row) => (
                  <div key={row.group} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-on-surface-variant">event</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-on-surface">{row.group}</p>
                        <p className="text-[10px] text-on-surface-variant">{row.count} payments</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm">${row.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">Total Commitments</span>
                  <span className="font-mono text-xs text-primary">$644,300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Forecast Assumptions</h3>
            <div className="space-y-3">
              {assumptions.map((a) => (
                <div key={a.label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-xs text-on-surface">{a.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{a.value}</span>
                    {a.editable && <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-xs">edit</span></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          <div className="bg-surface-container-high rounded-xl p-6 h-full flex flex-col border border-outline-variant/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-instrument text-on-surface">What-If Simulator</h2>
            </div>
            <div className="space-y-8 flex-1">
              {[
                { label: 'Collection Rate', value: collectionRate, suffix: '%', min: 40, max: 100, step: 1, setter: setCollectionRate, display: `${collectionRate}%` },
                { label: 'Avg Payment Days', value: avgPayDays, suffix: 'd', min: 15, max: 60, step: 1, setter: setAvgPayDays, display: `${avgPayDays}d` },
                { label: 'Revenue Growth', value: revenueGrowth, suffix: '%', min: -20, max: 50, step: 0.5, setter: setRevenueGrowth, display: `+${revenueGrowth}%` },
                { label: 'Cash Injection', value: cashInjection, suffix: '', min: 0, max: 2000000, step: 50000, setter: setCashInjection, display: `$${(cashInjection / 1000).toFixed(0)}K` },
              ].map((slider) => (
                <div key={slider.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-on-surface/60 tracking-wider">{slider.label}</label>
                    <span className="text-sm font-mono text-primary">{slider.display}</span>
                  </div>
                  <input
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={(e) => { slider.setter(parseFloat(e.target.value)); recalc(); }}
                  />
                  <div className="flex justify-between text-[10px] font-mono text-on-surface/30">
                    <span>{slider.min}{slider.suffix}</span>
                    <span>{slider.max}{slider.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-on-surface-variant font-semibold">Simulated Runway</span>
                <span className={`text-3xl font-instrument ${runway < 6 ? 'text-error' : 'text-primary'}`}>{runway.toFixed(1)}<span className="text-sm opacity-40 ml-1">mo</span></span>
              </div>
              <button
                onClick={() => addToast({ variant: 'success', title: 'Scenario Committed', message: `${runway.toFixed(1)} month runway saved to forecast engine`, statusCode: 200 })}
                className="w-full py-3.5 bg-primary text-on-primary-container font-black text-xs rounded-lg tracking-[0.15em] uppercase shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                COMMIT SCENARIO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
