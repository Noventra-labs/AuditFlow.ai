import { Link } from 'react-router-dom';

export default function ReportGeneratorView() {
  return (
    <div className="pt-12 px-8 pb-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-6xl text-on-surface mb-2 tracking-tight">Report <span className="font-serif italic">Synthesis</span></h1>
          <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">ID: SR-2024-X901</p>
        </div>

        <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10"></div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-background flex items-center justify-center text-[#D4AF37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]">1</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Type</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-background flex items-center justify-center text-slate-500 font-bold">2</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Configure</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-background flex items-center justify-center text-slate-500 font-bold">3</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Generate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-surface-container p-8 rounded-lg transition-all duration-500 hover:bg-surface-container-high border-b-2 border-transparent hover:border-[#D4AF37] cursor-pointer">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#D4AF37] to-transparent pointer-events-none"></div>
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-6 group-hover:text-[#D4AF37] transition-colors">account_balance</span>
            <h3 className="font-serif text-3xl mb-2">P&amp;L Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">Consolidated income statement with variance analysis and margin tracking.</p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Live Data Feed
            </div>
          </div>

          <div className="group relative bg-surface-container-high p-8 rounded-lg ring-1 ring-[#D4AF37]/50 shadow-2xl transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#D4AF37] to-transparent pointer-events-none"></div>
            <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Recommended</div>
            <span className="material-symbols-outlined text-4xl text-[#D4AF37] mb-6">monitoring</span>
            <h3 className="font-serif text-3xl mb-2 text-on-surface">Board Pack</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">Comprehensive executive overview for quarterly stakeholders.</p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> Strategic Insights Active
            </div>
          </div>

          <div className="group relative bg-surface-container p-8 rounded-lg transition-all duration-500 hover:bg-surface-container-high border-b-2 border-transparent hover:border-[#D4AF37] cursor-pointer">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#D4AF37] to-transparent pointer-events-none"></div>
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-6 group-hover:text-[#D4AF37] transition-colors">public</span>
            <h3 className="font-serif text-3xl mb-2">Investor Update</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">Concise metrics and growth projection summary for equity holders.</p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span> Historical Comparison
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-between items-center px-4">
          <Link to="/reports" className="text-slate-400 hover:text-on-surface transition-all flex items-center gap-2 group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest">Cancel</span>
          </Link>
          <button className="bg-primary-container hover:bg-primary px-10 py-4 rounded-lg text-on-primary-container font-black text-sm tracking-widest uppercase transition-all flex items-center gap-3">
            Next Configuration
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
