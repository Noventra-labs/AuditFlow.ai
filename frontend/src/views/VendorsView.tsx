import { Link } from 'react-router-dom';

export default function VendorsView() {
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
            <p className="font-serif text-3xl">128</p>
          </div>
          <div>
            <p className="text-[10px] text-primary tracking-[0.2em] uppercase font-bold mb-1">Q3 Throughput</p>
            <p className="font-serif text-3xl">$1.42M</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-6">Vendor Categories</h3>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <div className="flex justify-between text-xs mb-2">
                  <span className="group-hover:text-primary transition-colors">Infrastructure</span>
                  <span className="font-mono">42%</span>
                </div>
                <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[42%]"></div>
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="flex justify-between text-xs mb-2">
                  <span className="group-hover:text-[#62df7d] transition-colors">SaaS &amp; Software</span>
                  <span className="font-mono">31%</span>
                </div>
                <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-[#62df7d]/60 w-[31%]"></div>
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="flex justify-between text-xs mb-2">
                  <span className="group-hover:text-[#62df7d] transition-colors">Legal &amp; Compliance</span>
                  <span className="font-mono">18%</span>
                </div>
                <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-[#62df7d]/30 w-[18%]"></div>
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="flex justify-between text-xs mb-2">
                  <span className="group-hover:text-[#62df7d] transition-colors">Marketing Services</span>
                  <span className="font-mono">9%</span>
                </div>
                <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-[#62df7d]/10 w-[9%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-xs font-bold tracking-widest text-on-surface/50 uppercase mb-2">Efficiency Index</h3>
            <p className="font-serif text-4xl text-primary">0.94</p>
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
              <button className="text-xs font-bold bg-surface-variant px-3 py-1.5 rounded text-on-surface">All Vendors</button>
              <button className="text-xs font-medium text-on-surface/40 px-3 py-1.5 hover:text-on-surface transition-colors">High Risk</button>
              <button className="text-xs font-medium text-on-surface/40 px-3 py-1.5 hover:text-on-surface transition-colors">By Volume</button>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-surface-variant rounded transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">filter_list</span>
              </button>
              <button className="p-1.5 hover:bg-surface-variant rounded transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
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
                <tr className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-primary">cloud</span>
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">CloudScale Systems</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface/60">Infra</td>
                  <td className="px-6 py-4 font-mono text-sm">$482,900.00</td>
                  <td className="px-6 py-4 font-mono text-xs">14.2</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container text-primary uppercase font-bold">Low</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Sterling &amp; Associates</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface/60">Legal</td>
                  <td className="px-6 py-4 font-mono text-sm">$124,000.00</td>
                  <td className="px-6 py-4 font-mono text-xs">28.0</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-error-container text-error uppercase font-bold">High</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">DevFlow Pro</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface/60">Software</td>
                  <td className="px-6 py-4 font-mono text-sm">$89,240.50</td>
                  <td className="px-6 py-4 font-mono text-xs">08.5</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container text-primary uppercase font-bold">Low</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-primary">database</span>
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Global Data Vault</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface/60">Infra</td>
                  <td className="px-6 py-4 font-mono text-sm">$62,100.00</td>
                  <td className="px-6 py-4 font-mono text-xs">12.0</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-variant text-on-surface uppercase font-bold">Med</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Nexus Networks</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface/60">Software</td>
                  <td className="px-6 py-4 font-mono text-sm">$45,000.00</td>
                  <td className="px-6 py-4 font-mono text-xs">15.0</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container text-primary uppercase font-bold">Low</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex justify-between items-center text-[11px] text-on-surface-variant/50 font-bold uppercase tracking-widest border-t border-white/5">
            <span>Showing 1-12 of 128 results</span>
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
                  <p className="font-serif text-4xl">74%</p>
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
              <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-primary/40">
                <p className="text-xs font-bold">CloudScale Invoices</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">3 pending payments due within 48h</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-error/40">
                <p className="text-xs font-bold">Sterling Compliance</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Service agreement renewal pending audit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
