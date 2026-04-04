export default function TaxComplianceView() {
  return (
    <div className="space-y-8">
      {/* Jurisdiction Tab Bar */}
      <div className="flex items-center gap-8 border-b border-outline-variant/10">
        <button className="pb-3 border-b-2 border-[#8b5cf6] text-on-surface font-semibold text-sm">SG GST</button>
        <button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">ID PPN</button>
        <button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">TH VAT</button>
        <button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">PH VAT</button>
        <button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">MY SST</button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Tax */}
        <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">Total Input Tax</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">12,450.82</h2>
            <span className="text-mono text-xs text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span>
              +4.2% vs Prev Qtr
            </span>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 100 20">
              <path d="M0,20 Q10,5 20,15 T40,10 T60,18 T80,5 T100,12 L100,20 L0,20" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Output Tax */}
        <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">Total Output Tax</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">48,912.44</h2>
            <span className="text-mono text-xs text-tertiary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_down</span>
              -1.1% vs Prev Qtr
            </span>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M0,12 Q15,18 30,10 T50,15 T70,5 T85,12 T100,8 L100,20 L0,20" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Net Tax Payable */}
        <div className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden border border-outline-variant/10 shadow-xl">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#8b5cf6]">Net Tax Payable</span>
            <h2 className="text-4xl font-instrument text-on-surface mt-2">36,461.62</h2>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-error-container/30 text-error font-bold uppercase tracking-tighter">Action Required</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filing Calendar (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Filing Deadline Calendar</h3>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-surface-container-highest rounded transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <span className="text-sm font-semibold">October 2024</span>
              <button className="p-1 hover:bg-surface-container-highest rounded transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Sun</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Mon</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Tue</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Wed</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Thu</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Fri</div>
            <div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Sat</div>
            <div className="aspect-square bg-surface-container-low/30 rounded flex items-center justify-center text-xs opacity-20">26</div>
            <div className="aspect-square bg-surface-container-low/30 rounded flex items-center justify-center text-xs opacity-20">27</div>
            <div className="aspect-square bg-surface-container-low/30 rounded flex items-center justify-center text-xs opacity-20">28</div>
            <div className="aspect-square bg-surface-container-low/30 rounded flex items-center justify-center text-xs opacity-20">29</div>
            <div className="aspect-square bg-surface-container-low/30 rounded flex items-center justify-center text-xs opacity-20">30</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">1</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">2</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">3</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">4</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">5</div>
            <div className="aspect-square bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 rounded flex flex-col items-center justify-center text-xs relative group">
              6
              <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-1"></div>
            </div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">7</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">8</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">9</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">10</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">11</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">12</div>
            <div className="aspect-square bg-error-container/20 border border-error/40 rounded flex flex-col items-center justify-center text-xs relative">
              13
              <div className="w-1.5 h-1.5 bg-error rounded-full mt-1"></div>
            </div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">14</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">15</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">16</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">17</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">18</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">19</div>
            <div className="aspect-square bg-surface-container-low rounded flex items-center justify-center text-xs">20</div>
          </div>
        </div>

        {/* Upcoming Filings (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-container rounded-xl p-5 border-l-4 border-error shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                <div>
                  <h4 className="text-sm font-bold">GST F5 Filing</h4>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase">Singapore Division</p>
                </div>
              </div>
              <span className="font-mono text-sm text-on-surface font-semibold">36,461.62</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-error font-medium">Due: Oct 13, 2024</span>
              <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-5 border-l-4 border-orange-400">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-white border border-gray-800 rounded-sm"></div>
                <div>
                  <h4 className="text-sm font-bold">PPN Monthly</h4>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase">Indonesia Office</p>
                </div>
              </div>
              <span className="font-mono text-sm text-on-surface font-semibold">1,240.00</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-orange-400 font-medium">Due: Oct 30, 2024</span>
              <span className="bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">DRAFT</span>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-5 opacity-60">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                <div>
                  <h4 className="text-sm font-bold">SST Return</h4>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase">Malaysia HQ</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">check_circle</span>
            </div>
            <p className="text-[10px] text-primary mt-2">FILED: SEPT 28, 2024</p>
          </div>
        </div>
      </div>

      {/* Tax Register Table */}
      <div className="bg-surface-container rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <h3 className="font-bold text-lg">Tax Register Ledger</h3>
          <button className="text-xs text-primary flex items-center gap-2 hover:bg-primary/10 px-3 py-1.5 rounded transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Tax Register
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider">Reference ID</th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider">Counterparty</th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Net Amount</th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Tax Rate</th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant/60 text-xs uppercase tracking-wider text-right">Tax Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <tr className="hover:bg-surface-container-highest/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">2024-10-04</td>
                <td className="px-6 py-4 font-mono text-xs text-[#8b5cf6]">INV-2024-0982</td>
                <td className="px-6 py-4 font-medium">Cloudflare Infrastructure</td>
                <td className="px-6 py-4 font-mono text-right">12,400.00</td>
                <td className="px-6 py-4 font-mono text-right text-on-surface-variant">9%</td>
                <td className="px-6 py-4 font-mono text-right text-primary">1,116.00</td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">2024-10-03</td>
                <td className="px-6 py-4 font-mono text-xs text-[#8b5cf6]">PUR-TX-5512</td>
                <td className="px-6 py-4 font-medium">Apple Singapore Store</td>
                <td className="px-6 py-4 font-mono text-right">3,120.50</td>
                <td className="px-6 py-4 font-mono text-right text-on-surface-variant">9%</td>
                <td className="px-6 py-4 font-mono text-right text-tertiary">280.85</td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">2024-10-02</td>
                <td className="px-6 py-4 font-mono text-xs text-[#8b5cf6]">INV-2024-0977</td>
                <td className="px-6 py-4 font-medium">Stripe Payments Ltd</td>
                <td className="px-6 py-4 font-mono text-right">45,000.00</td>
                <td className="px-6 py-4 font-mono text-right text-on-surface-variant">9%</td>
                <td className="px-6 py-4 font-mono text-right text-primary">4,050.00</td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">2024-10-01</td>
                <td className="px-6 py-4 font-mono text-xs text-[#8b5cf6]">INV-2024-0975</td>
                <td className="px-6 py-4 font-medium">Google Cloud SEA</td>
                <td className="px-6 py-4 font-mono text-right">8,200.00</td>
                <td className="px-6 py-4 font-mono text-right text-on-surface-variant">9%</td>
                <td className="px-6 py-4 font-mono text-right text-primary">738.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
