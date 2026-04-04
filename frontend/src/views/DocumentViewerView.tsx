import { Link } from 'react-router-dom';

export default function DocumentViewerView() {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-12 bg-surface-container-lowest flex flex-col items-center">
      <div className="max-w-[850px] w-full bg-white text-[#1a1c21] shadow-2xl min-h-[1100px] p-20 relative flex flex-col">
        {/* Letterhead */}
        <div className="flex justify-between items-start border-b-[0.5px] border-slate-200 pb-12 mb-16">
          <div>
            <h1 className="font-serif text-4xl font-normal leading-none tracking-tight">Sovereign Asset Group</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 mt-2">Confidential Performance Audit</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-slate-400 uppercase">Document Ref: 882-QX-2024</p>
            <p className="font-mono text-[10px] text-slate-400 mt-1 uppercase">Date: October 24, 2024</p>
          </div>
        </div>

        {/* AI Generated Narrative Section */}
        <div className="mb-16 relative">
          <div className="absolute -left-10 top-0 flex items-center gap-1 bg-[#1ca64d]/10 text-[#003111] px-2 py-1 rounded-sm">
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">AI INSIGHT</span>
          </div>
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-6">Executive Summary</h2>
          <p className="font-serif text-2xl leading-relaxed text-slate-800 italic">
            "The portfolio demonstrated exceptional resilience throughout Q3, navigating volatility with a +4.2% margin expansion. Capital efficiency metrics remain in the upper decile of sovereign-grade benchmarks, specifically driven by optimized liquidity in emerging markets."
          </p>
        </div>

        {/* P&L Statement */}
        <div className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-8 flex justify-between items-center">
            <span>Consolidated Profit &amp; Loss</span>
            <span className="font-mono text-[9px] font-normal lowercase">Values in USD millions</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 pb-4 border-b border-slate-100">
              <div className="col-span-6">Account Category</div>
              <div className="col-span-3 text-right">Current Period</div>
              <div className="col-span-3 text-right">Variance</div>
            </div>

            <div className="grid grid-cols-12 py-3 group hover:bg-slate-50 transition-colors">
              <div className="col-span-6 text-sm font-medium">Total Operating Revenue</div>
              <div className="col-span-3 text-right font-mono font-medium text-sm">$ 1,240.40</div>
              <div className="col-span-3 text-right font-mono text-[#1ca64d] text-xs">+12.4%</div>
            </div>
            <div className="grid grid-cols-12 py-3 border-t border-slate-50">
              <div className="col-span-6 text-sm font-medium">Cost of Capital Services</div>
              <div className="col-span-3 text-right font-mono font-medium text-sm">($ 412.18)</div>
              <div className="col-span-3 text-right font-mono text-slate-400 text-xs">-2.1%</div>
            </div>
            <div className="grid grid-cols-12 py-3 border-t border-slate-50 bg-slate-50/50">
              <div className="col-span-6 text-sm font-bold">Gross Operating Margin</div>
              <div className="col-span-3 text-right font-mono font-bold text-sm">$ 828.22</div>
              <div className="col-span-3 text-right font-mono text-[#1ca64d] text-xs">+18.2%</div>
            </div>
            <div className="grid grid-cols-12 py-3 border-t border-slate-50">
              <div className="col-span-6 text-sm font-medium">Administrative &amp; Sovereign Fees</div>
              <div className="col-span-3 text-right font-mono font-medium text-sm">($ 184.10)</div>
              <div className="col-span-3 text-right font-mono text-[#ffb4ab] text-xs">+4.5%</div>
            </div>
            <div className="grid grid-cols-12 py-3 border-t border-slate-50">
              <div className="col-span-6 text-sm font-medium">Marketing &amp; Strategic Outreach</div>
              <div className="col-span-3 text-right font-mono font-medium text-sm">($ 56.40)</div>
              <div className="col-span-3 text-right font-mono text-slate-400 text-xs">0.0%</div>
            </div>

            <div className="mt-12 p-8 border-2 border-slate-900 flex justify-between items-center bg-[#1a1c21] text-white">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1">Quarterly Bottom Line</span>
                <span className="font-serif text-3xl">Net Attributable Income</span>
              </div>
              <div className="text-right">
                <span className="font-serif text-5xl text-amber-400">$ 587.72</span>
                <span className="font-mono text-[10px] block mt-1 text-[#62df7d]">+24.8% YoY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Page Number */}
        <div className="mt-auto pt-20 flex justify-between items-center text-[10px] text-slate-400">
          <p>© 2024 Sovereign Asset Group. For Authorized Eyes Only.</p>
          <p className="font-mono">PAGE 01 OF 12</p>
        </div>
      </div>
    </div>
  );
}
