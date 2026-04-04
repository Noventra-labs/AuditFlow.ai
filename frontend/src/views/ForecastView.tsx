export default function ForecastView() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary text-[10px] font-mono tracking-widest uppercase">Analysis Module / V0.1</span>
          <h1 className="text-4xl font-instrument text-on-surface leading-none mt-1">Capital Projection <span className="italic text-on-surface/40">2024-2025</span></h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span> RE-RUN FORECAST
          </button>
          <button className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg flex items-center gap-2 border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> CSV
          </button>
          <button className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg flex items-center gap-2 border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">mail</span> EMAIL INVESTORS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-8">
          {/* Hero Gauge & Stats */}
          <div className="bg-surface-container rounded-xl p-8 flex items-center gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
            {/* Runway Gauge */}
            <div className="relative w-[200px] h-[120px] flex justify-center items-center">
              <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 60">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#181c22" strokeLinecap="round" strokeWidth="8"></path>
                <path d="M 10 50 A 40 40 0 0 1 75 25" fill="none" stroke="#62df7d" strokeLinecap="round" strokeWidth="8" className="drop-shadow-[0_0_8px_rgba(98,223,125,0.4)]"></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-5xl font-instrument text-on-surface leading-none">8.2<span className="text-xl italic opacity-40 ml-1">mo</span></span>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Current Cash Runway</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Liquidity Floor</span>
                <div className="text-2xl font-instrument">$2.42M</div>
                <div className="flex items-center gap-1 text-primary text-[10px] font-mono">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> +14.2%
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Net Monthly Burn</span>
                <div className="text-2xl font-instrument">$294K</div>
                <div className="flex items-center gap-1 text-error text-[10px] font-mono">
                  <span className="material-symbols-outlined text-[12px]">trending_down</span> -2.4%
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Inflow Accuracy</span>
                <div className="text-2xl font-instrument">98.4%</div>
                <div className="w-full bg-surface-container-high h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full w-[98.4%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Scenario Chart Area */}
          <div className="bg-surface-container rounded-xl p-8 h-[450px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold tracking-tight text-on-surface flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                PROJECTED NET ASSETS (12M)
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                  <span className="w-3 h-[1px] bg-primary border-t border-dashed border-primary"></span> OPTIMISTIC
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                  <span className="w-3 h-1 bg-primary"></span> BASE CASE
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                  <span className="w-3 h-[1px] bg-error border-t border-dashed border-error"></span> CONSERVATIVE
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-5">
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <path d="M0,280 L100,270 L200,285 L300,250 L400,240 L500,210 L600,190 L700,160 L800,130 L900,100 L1000,70 L1000,380 L900,350 L800,340 L700,330 L600,325 L500,320 L400,315 L300,310 L200,315 L100,300 L0,310 Z" fill="#62df7d" fillOpacity="0.05"></path>
                <path d="M0,290 L200,270 L400,220 L600,150 L800,90 L1000,40" fill="none" stroke="#62df7d" strokeDasharray="8,4" strokeWidth="2"></path>
                <path d="M0,300 L200,290 L400,260 L600,220 L800,180 L1000,140" fill="none" stroke="#62df7d" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(98,223,125,0.6)]"></path>
                <path d="M0,310 L200,315 L400,320 L600,330 L800,350 L1000,380" fill="none" stroke="#ffb4ab" strokeDasharray="8,4" strokeWidth="2"></path>
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between pt-4 text-[10px] font-mono text-on-surface-variant px-2">
                <span>AUG '24</span>
                <span>OCT '24</span>
                <span>DEC '24</span>
                <span>FEB '25</span>
                <span>APR '25</span>
                <span>JUN '25</span>
                <span>AUG '25</span>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* AR Aging */}
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">A/R Aging Report</h3>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">LIVE FEED</span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">Standard Terms (Net 30)</span>
                    <span className="font-mono text-sm">$842,000.00</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">Past Due (31-60)</span>
                    <span className="font-mono text-sm text-tertiary">$124,500.00</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">Critical (61+)</span>
                    <span className="font-mono text-sm text-error">$12,040.00</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Collection Velocity</span>
                    <span className="font-mono text-xs text-primary">84% (+2%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AP Schedule */}
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">A/P Payment Schedule</h3>
                <span className="text-[10px] font-mono text-on-surface/40">Q3 FIXED</span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">AWS Infrastructure</span>
                    <span className="font-mono text-sm">$42,100.00</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">Payroll (Sept Cycle)</span>
                    <span className="font-mono text-sm">$195,000.00</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/10 pb-3">
                    <span className="text-xs text-on-surface">Office Lease (HQ)</span>
                    <span className="font-mono text-sm">$12,800.00</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Total Commitments</span>
                    <span className="font-mono text-xs">$249,900.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: What-If Simulator */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-8">
          <div className="bg-surface-container-high rounded-xl p-8 h-full flex flex-col relative border border-outline-variant/5">
            <div className="mb-8">
              <h2 className="text-lg font-instrument text-on-surface mb-2">What-If Simulator</h2>
              <p className="text-xs text-on-surface-variant">Adjust variables to see real-time impact on your cash runway.</p>
            </div>
            <div className="space-y-10 flex-1">
              {/* Collection Rate Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-on-surface/60 tracking-wider">Collection Rate</label>
                  <span className="text-sm font-mono text-primary">84%</span>
                </div>
                <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue="84" />
                <div className="flex justify-between text-[10px] font-mono text-on-surface/30">
                  <span>40%</span>
                  <span>100%</span>
                </div>
              </div>
              {/* Growth Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-on-surface/60 tracking-wider">Revenue Growth</label>
                  <span className="text-sm font-mono text-primary">+12.5%</span>
                </div>
                <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue="45" />
                <div className="flex justify-between text-[10px] font-mono text-on-surface/30">
                  <span>-20%</span>
                  <span>+50%</span>
                </div>
              </div>
              {/* Churn Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-on-surface/60 tracking-wider">Customer Churn</label>
                  <span className="text-sm font-mono text-error">2.4%</span>
                </div>
                <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue="12" />
                <div className="flex justify-between text-[10px] font-mono text-on-surface/30">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>
              {/* Operational Optimization Toggle */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-on-surface/60 tracking-wider block">Operational Optimization</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-surface-container text-[10px] font-bold rounded-md border border-outline-variant/10 text-on-surface/40 hover:text-on-surface transition-colors">OFF</button>
                  <button className="py-2 bg-primary text-on-primary-container text-[10px] font-bold rounded-md">10% CUT</button>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-8 border-t border-outline-variant/10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-on-surface-variant font-semibold">Simulated Runway</span>
                <span className="text-3xl font-instrument text-primary">11.4<span className="text-sm opacity-40 ml-1">mo</span></span>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary-container font-black text-xs rounded-lg tracking-[0.2em] uppercase shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                COMMIT SCENARIO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
