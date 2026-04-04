import { Link } from 'react-router-dom';

export default function ReportsView() {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Generator Wizard */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <section className="bg-surface-container p-6 rounded-xl border-l-2 border-gold/30">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-instrument text-3xl italic">Reports Overview</h1>
          </div>
          <div className="space-y-6">
            <Link to="/reports/generate" className="w-full bg-primary text-on-primary-container font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform">
              Report Wizard <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/reports/library" className="w-full bg-surface-container-high text-on-surface hover:text-primary py-2 text-xs flex items-center justify-center gap-2 transition-colors rounded">
                <span className="material-symbols-outlined text-sm">inventory_2</span> Library
              </Link>
              <Link to="/reports/drafts" className="w-full bg-surface-container-high text-on-surface hover:text-primary py-2 text-xs flex items-center justify-center gap-2 transition-colors rounded">
                <span className="material-symbols-outlined text-sm">edit_document</span> Drafts
              </Link>
              <Link to="/reports/archive" className="w-full bg-surface-container-high text-on-surface hover:text-primary py-2 text-xs flex items-center justify-center gap-2 transition-colors rounded">
                <span className="material-symbols-outlined text-sm">archive</span> Archive
              </Link>
              <Link to="/reports/scheduled" className="w-full bg-surface-container-high text-on-surface hover:text-primary py-2 text-xs flex items-center justify-center gap-2 transition-colors rounded">
                <span className="material-symbols-outlined text-sm">schedule</span> Scheduled
              </Link>
            </div>

            <div className="hidden">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 block mb-3">Select Document Type</label>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-primary/20 group hover:bg-surface-container-high transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gold">account_balance_wallet</span>
                    <div>
                      <p className="text-sm font-semibold">Profit &amp; Loss</p>
                      <p className="text-[10px] text-on-surface-variant">Full fiscal performance summary</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                </button>
                <button className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant group hover:bg-surface-container-high transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">group_work</span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface/80">Board Pack</p>
                      <p className="text-[10px] text-on-surface-variant">Executive summary &amp; charts</p>
                    </div>
                  </div>
                </button>
                <button className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant group hover:bg-surface-container-high transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">balance</span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface/80">Balance Sheet</p>
                      <p className="text-[10px] text-on-surface-variant">Snapshot of assets &amp; liabilities</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 block mb-3">Reporting Period</label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-xs font-medium bg-surface-container-highest rounded text-on-surface">Monthly</button>
                <button className="flex-1 py-2 text-xs font-medium bg-surface-container-low text-on-surface-variant rounded hover:bg-surface-container-highest">Quarterly</button>
                <button className="flex-1 py-2 text-xs font-medium bg-surface-container-low text-on-surface-variant rounded hover:bg-surface-container-highest">Annual</button>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary-container font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform">
              Generate Now <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </button>
            <button className="w-full text-on-surface/60 hover:text-on-surface py-2 text-xs flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-sm">schedule</span> Schedule Recurring Report
            </button>
            </div>
          </div>
        </section>

        <section className="bg-surface-container p-6 rounded-xl">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 mb-4">Report Library</h3>
          <div className="space-y-3">
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10 group cursor-pointer hover:bg-surface-container-highest transition-all relative">
              <div className="absolute -top-2 -right-1 bg-gold text-[8px] font-black px-2 py-0.5 rounded-full text-on-primary-container shadow-md">GOLD</div>
              <Link to="/reports/view" className="aspect-[3/4] bg-surface-bright rounded mb-3 flex items-center justify-center overflow-hidden block">
                <img className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkoYKMxCIB4KE8SZzw46ZiUQYq_KHf2B5QfwpBgil35UjbScHOL5SmYXt3OvO4w9PyzpVpfShcJ4iVWcL1GsyNXg-DXzHCqmoV8VBcWlYkC4YZ_1byly1NqTwHKvKJoUExtUZAhKDYXm4hiZwkieJEsPVOMawHv3mVpbkS37fXnkHRdbvVxLEiOTcGIOp35kytOvnogNTIL6Hc4_QbGkH9uaz7nvRvju8UyKBhyG1MI41ZXX6StsiW_4LFnRzvCsH2pTBtLyVszFLV" alt="Q3 Fiscal Audit" />
              </Link>
              <p className="text-[11px] font-bold leading-tight line-clamp-1">Q3 Fiscal Audit</p>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">OCT 24, 2023</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10 group cursor-pointer hover:bg-surface-container-highest transition-all">
              <div className="aspect-[3/4] bg-surface-bright rounded mb-3 flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb77HpULwf-BbmneotaApzfKHJeQZ4Ppdi41MV3MKiWdCMsVtMNgpEsgsZJzbIpQIs9Q160O0ofroY8ywK-fkDVzCkRuyhkZ-SLej7OvZmIDMPVE0vmXtO35V-S9hiBM6tSnB9ffEVNnv_3fFgNSKkNNheUOBYAbfVkNMRElOgjAG_OTWNH88pGXJYQ1tTrPd7FmE33CjJPnADTgs8g82JPL2iudJsFvlyALgSaC2zqIh1IaU_mNhS0MWZ10Y3cJt4TDayakOkCAS-" alt="Venture Debt Overview" />
              </div>
              <p className="text-[11px] font-bold leading-tight line-clamp-1">Venture Debt Overview</p>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">SEP 12, 2023</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10 group cursor-pointer hover:bg-surface-container-highest transition-all">
              <div className="aspect-[3/4] bg-surface-bright rounded mb-3 flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPIXwlJj8SLZojYl_8B61O8dTJpJ9lVGRSbDT_tQOWNyktQcxSeZZS-T9CMyEu8EvI2UmPMl2GgiSNlGW90amjd0nzKnEKxzzjYmSUD4WoWXfLbi3j3wqgvXa418nW4-s38bIwFxvivRKd3Vcz5BWYbFRJ4w92qf3CbzhkqoDr2K8_5zXj_4yYhangEG3Q8Z0AOX2bySmVhppAEihCuBZV7EBfVoLq3AohPLPORyhQjrxWj2VbS7qDN6ACFAtImODZptdxk8PAsJcE" alt="Board Meeting Pack" />
              </div>
              <p className="text-[11px] font-bold leading-tight line-clamp-1">Board Meeting Pack</p>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">AUG 05, 2023</p>
            </div>
          </div>
        </section>
      </div>

      {/* Center/Right Column: Report Preview */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-surface-container-low rounded-xl p-8 min-h-full flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full"></div>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-highest p-3 rounded-lg text-gold">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Preview: FY24_Profit_Loss_v2.pdf</h2>
                <p className="text-xs text-on-surface-variant font-mono uppercase tracking-tighter">Rendered 2 minutes ago • Confidential</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest hover:bg-surface-bright rounded-lg text-xs font-semibold transition-all">
                <span className="material-symbols-outlined text-sm">download</span> Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest hover:bg-surface-bright rounded-lg text-xs font-semibold transition-all">
                <span className="material-symbols-outlined text-sm">mail</span> Email Report
              </button>
            </div>
          </div>

          {/* Editorial PDF Preview Area */}
          <div className="flex-1 bg-white shadow-lg rounded-sm mx-auto w-full max-w-[800px] overflow-hidden text-slate-900 flex flex-col">
            {/* Letterhead */}
            <div className="p-12 border-b-[8px] border-slate-900">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter mb-1">FINANCEPILOT</h3>
                  <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Sovereign Financial Analytics</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-900">REPORT ID: FP-2024-0082</p>
                  <p className="text-[10px] text-slate-500">FISCAL PERIOD: Q3 2024</p>
                </div>
              </div>
              <h4 className="text-6xl font-instrument italic mb-2">Profit &amp; Loss</h4>
              <p className="text-slate-500 font-medium tracking-wide">Consolidated Statement of Operations for Global Entities</p>
            </div>

            {/* Data Content */}
            <div className="p-12 space-y-10 flex-1">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Revenue Overview</p>
                  <p className="text-sm leading-relaxed text-slate-700 italic border-l-2 border-slate-200 pl-4">
                    Market conditions remained favorable throughout the reporting period. Core software licensing revenue saw a marked increase of 14.2% YoY.
                  </p>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex justify-between border-b border-slate-100 py-2">
                    <span className="text-xs font-bold text-slate-800">Total Net Sales</span>
                    <span className="text-xs font-mono font-bold">$12,482,000.00</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 py-2">
                    <span className="text-xs font-bold text-slate-800">Direct Costs</span>
                    <span className="text-xs font-mono font-bold">($4,291,550.00)</span>
                  </div>
                  <div className="flex justify-between py-2 mt-2 bg-slate-50 px-2 rounded">
                    <span className="text-xs font-black text-slate-900 uppercase">Gross Profit</span>
                    <span className="text-xs font-mono font-black">$8,190,450.00</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Operating Expenses Breakdown</p>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-left border-b-2 border-slate-900">
                      <th className="pb-2 font-black uppercase">Category</th>
                      <th className="pb-2 font-black uppercase">Actual (USD)</th>
                      <th className="pb-2 font-black uppercase">Budget (USD)</th>
                      <th className="pb-2 font-black uppercase text-right">Variance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-medium">Research &amp; Development</td>
                      <td className="py-3 font-mono">1,200,450</td>
                      <td className="py-3 font-mono">1,150,000</td>
                      <td className="py-3 font-mono text-right text-red-600">+4.38%</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Sales &amp; Marketing</td>
                      <td className="py-3 font-mono">845,000</td>
                      <td className="py-3 font-mono">900,000</td>
                      <td className="py-3 font-mono text-right text-emerald-600">-6.11%</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">General Administrative</td>
                      <td className="py-3 font-mono">420,000</td>
                      <td className="py-3 font-mono">420,000</td>
                      <td className="py-3 font-mono text-right text-slate-400">0.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-20 mt-auto flex justify-between items-end grayscale">
                <div className="w-32 h-1 bg-slate-900"></div>
                <div className="text-[8px] text-slate-300 font-mono text-right">
                  PAGE 1 OF 24 <br/>
                  GENERATED BY FINANCEPILOT AI ENGINE <br/>
                  AUTHENTICATION TOKEN: 0x882...AF91
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
