export default function InvoicesView() {
  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-instrument text-4xl italic text-on-surface">Ledger Invoices</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage and audit institutional payables</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span> Add Manually
          </button>
          <button className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">ios_share</span> Export CSV
          </button>
          <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-primary/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">upload</span> Upload Invoice
          </button>
        </div>
      </div>

      {/* Hero: Upload Zone */}
      <section className="w-full h-48 border-2 border-dashed border-primary/30 bg-surface-container-low rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
          </div>
          <div className="text-center">
            <p className="text-on-surface font-semibold">Drop invoices here to start parsing</p>
            <p className="text-on-surface-variant text-xs mt-1">Supports PDF, JPG, PNG (Max 20MB)</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
          <div className="h-full bg-primary animate-pulse" style={{ width: '65%' }}></div>
        </div>
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          <span className="text-[10px] font-mono text-primary uppercase tracking-tighter">Parsing... 65%</span>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-surface-container rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Invoice #</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vendor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Issue Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-highest/30 transition-colors cursor-pointer group bg-surface-container-highest/20">
                <td className="px-6 py-4 font-mono text-primary text-sm tracking-tight">INV-2024-0892</td>
                <td className="px-6 py-4 font-semibold text-sm">NVIDIA Institutional</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-10-12</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-11-12</td>
                <td className="px-6 py-4 font-mono text-sm text-right text-on-surface font-semibold">124,500.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Matched</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-[10px] font-mono">98%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-mono text-primary text-sm tracking-tight">INV-2024-0711</td>
                <td className="px-6 py-4 font-semibold text-sm">Cloudflare, Inc.</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-10-15</td>
                <td className="px-6 py-4 font-mono text-xs text-error">2024-10-30</td>
                <td className="px-6 py-4 font-mono text-sm text-right text-on-surface font-semibold">12,400.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error/10 text-error border border-error/20">Overdue</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-[10px] font-mono">94%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors cursor-pointer group border-l-2 border-tertiary">
                <td className="px-6 py-4 font-mono text-primary text-sm tracking-tight">INV-2024-0922</td>
                <td className="px-6 py-4 font-semibold text-sm">AWS - Compute Tier</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-11-01</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-12-01</td>
                <td className="px-6 py-4 font-mono text-sm text-right text-on-surface font-semibold">45,120.44</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">Review</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-[10px] font-mono">45%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-highest/30 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-mono text-primary text-sm tracking-tight">INV-2024-1002</td>
                <td className="px-6 py-4 font-semibold text-sm">Datadog Monitoring</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-11-03</td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">2024-12-03</td>
                <td className="px-6 py-4 font-mono text-sm text-right text-on-surface font-semibold">8,990.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-on-surface-variant/10 text-on-surface-variant border border-on-surface-variant/20">Pending</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                    </div>
                    <span className="text-[10px] font-mono">82%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Right Drawer: Detail Panel */}
      <aside className="fixed top-0 right-0 h-full w-[800px] bg-surface-container-low shadow-2xl z-50 flex transform transition-transform duration-300 translate-x-0 border-l border-outline-variant/10">
        <button className="absolute -left-12 top-6 w-10 h-10 bg-surface-container-low border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface hover:text-primary transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        {/* PDF Preview (Left side of drawer) */}
        <div className="flex-1 bg-surface-container-lowest p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Document Preview</span>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-surface-container rounded"><span className="material-symbols-outlined text-sm">zoom_in</span></button>
              <button className="p-1 hover:bg-surface-container rounded"><span className="material-symbols-outlined text-sm">print</span></button>
            </div>
          </div>
          <div className="flex-1 bg-[#2a2d33] rounded overflow-hidden relative shadow-inner">
            <img
              alt="Invoice PDF Preview"
              className="w-full h-full object-contain opacity-80 mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuEFlHjlx26kvoUrQf5vdmPGVVYmIyOZDW0UY4IILzlCmgcNYoaziWQ3x7VYjkiwawfG2HRLCfuz1pCvtmHnUyKhP4xa3iHctP3Wupqfr3J7Dv1HKcxXydplMkmYLdkQX6iwDCOnC__dr_zXojRb3Ku-QBPmLB-7-d262BWIaoJ0zwgU1PR1NqRA4lz1NNNYBKdY3aa81N_gCbb2vk-guMsdMXlHlMs15V5dI6-XWp2LfBc8-pxcbTTUn8l8DqDat8ygb1v98gDUo3"
            />
            <div className="absolute top-40 left-10 right-10 h-10 border-2 border-primary/40 bg-primary/5 flex items-center justify-center">
              <span className="text-[8px] font-mono text-primary uppercase">Parsed: Line Item 01 - Compute Clusters - $124,500.00</span>
            </div>
          </div>
        </div>
        {/* Editable Form (Right side of drawer, 360px) */}
        <div className="w-[360px] bg-surface-container-high p-8 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="font-instrument text-2xl italic">Review Invoice</h3>
            <p className="text-[10px] font-mono text-primary uppercase tracking-tighter">Confidence: 98.4% Accuracy</p>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vendor Name</label>
              <input className="w-full bg-surface-container-low border-none rounded p-3 text-sm font-semibold focus:ring-1 focus:ring-primary/40" type="text" defaultValue="NVIDIA Institutional" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount (USD)</label>
                <input className="w-full bg-surface-container-low border-none rounded p-3 text-sm font-mono focus:ring-1 focus:ring-primary/40" type="text" defaultValue="124,500.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tax Amount</label>
                <input className="w-full bg-surface-container-low border-none rounded p-3 text-sm font-mono focus:ring-1 focus:ring-primary/40" type="text" defaultValue="10,240.00" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">GL Account Code</label>
              <select className="w-full bg-surface-container-low border-none rounded p-3 text-sm focus:ring-1 focus:ring-primary/40 appearance-none">
                <option>5001 - Infrastructure Ops</option>
                <option>5022 - Research &amp; Development</option>
                <option>6040 - Marketing Services</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Notes</label>
              <textarea className="w-full bg-surface-container-low border-none rounded p-3 text-sm focus:ring-1 focus:ring-primary/40" rows={3} defaultValue="Monthly compute allocation for the Alpha-Gen project cluster."></textarea>
            </div>
            <div className="pt-6 space-y-3">
              <button className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2" type="button">
                <span className="material-symbols-outlined text-lg">check_circle</span> Approve for Ledger
              </button>
              <button className="w-full bg-surface-container text-on-surface border border-outline-variant/20 font-semibold py-3 rounded-lg hover:bg-surface-container-highest transition-all" type="button">
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </aside>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45] pointer-events-none opacity-0 transition-opacity"></div>
    </div>
  );
}
