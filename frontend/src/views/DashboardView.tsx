export default function DashboardView() {
  return (
    <div className="space-y-8 max-w-[1600px]">
      {/* 6-KPI Metric Strip */}
      <div className="grid grid-cols-6 gap-0.5 bg-outline-variant/10 overflow-hidden rounded-xl border border-outline-variant/10">
        <div className="bg-surface-container p-6 space-y-2">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Revenue (MTD)</p>
          <div className="text-2xl font-instrument text-on-surface">$1,482,900</div>
          <div className="text-[10px] font-mono text-primary">+12.4% vs prev</div>
        </div>
        <div className="bg-surface-container p-6 space-y-2">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Expenses (MTD)</p>
          <div className="text-2xl font-instrument text-on-surface">$942,150</div>
          <div className="text-[10px] font-mono text-error">+4.2% vs prev</div>
        </div>
        <div className="bg-surface-container p-6 space-y-2">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Net P&amp;L</p>
          <div className="text-2xl font-instrument text-primary">$284,750</div>
          <div className="text-[10px] font-mono text-primary-container">Target: $250k</div>
        </div>
        <div className="bg-surface-container p-6 space-y-2">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">AR Outstanding</p>
          <div className="text-2xl font-instrument text-on-surface">$412,000</div>
          <div className="text-[10px] font-mono text-on-surface-variant/60">Avg. 14 days</div>
        </div>
        <div className="bg-surface-container p-6 space-y-2 border-l-2 border-amber-500/40">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Cash Runway</p>
          <div className="text-2xl font-instrument text-amber-400">8.2 mo</div>
          <div className="text-[10px] font-mono text-amber-500/80">Critically Low</div>
        </div>
        <div className="bg-surface-container p-6 space-y-2">
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">GST Liability</p>
          <div className="text-2xl font-instrument text-on-surface">$64,310</div>
          <div className="text-[10px] font-mono text-on-surface-variant/60">Due Q3</div>
        </div>
      </div>

      {/* Central Chart & Quick Actions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Cash Flow Area Chart */}
        <div className="col-span-9 bg-surface-container p-8 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold">Cash Flow Velocity</h3>
              <p className="text-xs text-on-surface-variant">Real-time projection vs actual performance</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Income</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-error border border-error dashed"></span><span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Expenses</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-on-surface"></span><span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Net Flow</span></div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-1 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path className="opacity-80" d="M0,180 Q100,140 200,160 T400,100 T600,120 T800,40 T1000,60" fill="none" stroke="#62df7d" strokeWidth="2"></path>
              <path className="opacity-60" d="M0,200 Q100,220 200,190 T400,210 T600,180 T800,220 T1000,190" fill="none" stroke="#ffb4ab" strokeDasharray="4" strokeWidth="2"></path>
              <path className="opacity-40" d="M0,210 Q100,190 200,210 T400,180 T600,190 T800,170 T1000,180" fill="none" stroke="#dfe2eb" strokeWidth="1.5"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col justify-between opacity-5">
              <div className="border-t border-on-surface w-full"></div>
              <div className="border-t border-on-surface w-full"></div>
              <div className="border-t border-on-surface w-full"></div>
              <div className="border-t border-on-surface w-full"></div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-span-3 flex flex-col gap-4">
          <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">upload_file</span>
            Upload Invoice
          </button>
          <button className="w-full py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-all border border-outline-variant/10 flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">sync_alt</span>
            Run Reconciliation
          </button>
          <button className="w-full py-4 bg-transparent text-primary font-bold rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">ios_share</span>
            Export Summary
          </button>
          <div className="mt-auto p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-4">Integrations</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center">
                <img alt="Quickbooks" className="w-6 h-6 grayscale brightness-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqzCBpMyfctWQGsRFx6v9BI-pNxd78-9CEzSZfUqWVs8mIL6PiU-DTVuFpA7BbXWveBtpzb76nJC9z7vFWoqlm7xE1SC8XdI-OkJiugU7LxkqapFIRLLlPdg1U0ngPRZEIZ4gqxmIYkrlR3ahLqYL1lZRFjg6lbOKOKv8bBXrV9ZVkSmwSAa-sQzC_egFprWnc_NwP3vcb7gkstzbLMysYWUWCikUS2svEGkAbEFokYTVrEl-x7nC1gb87QcOXJ5wE9EezB_45LcLc" />
              </div>
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center">
                <img alt="Stripe" className="w-6 h-6 grayscale brightness-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAQ2gIZKQGo9JWhcLHe_fsWdcVVCkub6Rw9dPDot7k4EU_4FpwGUKcFo660lmDQVxqCP9PbG2lAubOmX-fSJgo-LCWWY7QYreqADJEOqiSQpB2qFV6qLYN9CAWg8sPDBCmPlfsQRjPATUS_b_4CCwU_2X3BkUjfFKoBh0lPYDOMjXV9vRGN01PuyroFS_5uFBdzty4_AGZMWXzSLXpw-vS894_YgR4R_RUVWI-CcU08T4DBz2C4x4c3GfW4oWNCIz-c52T2NfEoX2L" />
              </div>
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm">add</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Widgets Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Vendor Spend Donut */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Vendor Spend (Top 8)</h4>
            <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer">more_horiz</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[10px] border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-[10px] border-primary border-r-transparent border-b-transparent rotate-45"></div>
              <div className="text-center">
                <span className="block font-mono text-sm">$42k</span>
                <span className="text-[8px] uppercase text-on-surface-variant">AWS</span>
              </div>
            </div>
            <div className="flex-1 ml-6 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant">AWS Infrastructure</span>
                <span className="font-mono text-on-surface">$42,100</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant">OpenAI API</span>
                <span className="font-mono text-on-surface">$12,400</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant">Google Workspace</span>
                <span className="font-mono text-on-surface">$8,900</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant">Slack Inc.</span>
                <span className="font-mono text-on-surface">$4,200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Agent Activity Feed */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80">WebSocket Activity Log</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
          </div>
          <div className="font-mono text-[9px] space-y-2 overflow-y-auto h-32 hide-scrollbar">
            <p className="text-on-surface-variant/40">[14:22:10] <span className="text-primary">INFO:</span> Scanning Ledger for discrepancies...</p>
            <p className="text-on-surface-variant/40">[14:22:12] <span className="text-primary">INFO:</span> 124 invoices matched to bank feed.</p>
            <p className="text-on-surface-variant/40">[14:23:45] <span className="text-amber-500">WARN:</span> Vendor 'Cloud-X' tax ID mismatch.</p>
            <p className="text-on-surface-variant/40">[14:24:01] <span className="text-primary">INFO:</span> Generating Q3 forecast models...</p>
            <p className="text-on-surface-variant/40">[14:25:12] <span className="text-on-surface">SYS:</span> Waiting for user validation on $12k tx.</p>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Critical Deadlines</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-sm">event_busy</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold">Payroll Submission</p>
                  <p className="text-[9px] text-on-surface-variant">In 2 hours</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-error/20 text-error rounded-full">URGENT</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-sm">request_quote</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold">GST Filing Q3</p>
                  <p className="text-[9px] text-on-surface-variant">Oct 28, 2024</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-sm">pending_actions</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold">Audit Documentation</p>
                  <p className="text-[9px] text-on-surface-variant">Oct 31, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
