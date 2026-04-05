export default function HelpView() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* Left: Help Topics Nav */}
      <div className="w-[380px] shrink-0 flex flex-col border-r border-white/5">
        <div className="p-8">
          <h2 className="font-serif text-4xl mb-6 leading-tight text-on-surface">Support<br /><span className="italic text-on-surface/40">Intelligence</span></h2>
          <div className="relative mb-10 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30 group-focus-within:text-primary transition-colors text-lg">search</span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary/30 placeholder:text-on-surface/20 transition-all"
              placeholder="Query documentation..."
              type="text"
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface/30 font-bold mb-4">Help Topics</p>
          <nav className="space-y-2">
            {[
              { icon: 'rocket_launch', label: 'Onboarding', desc: 'Getting started guides' },
              { icon: 'description', label: 'Invoices', desc: 'Invoice management' },
              { icon: 'balance', label: 'Tax Compliance', desc: 'Multi-jurisdiction tax' },
              { icon: 'rebase_edit', label: 'Reconciliation', desc: 'Ledger matching' },
              { icon: 'timeline', label: 'Forecast', desc: 'Capital projections' },
              { icon: 'terminal', label: 'Agent Console', desc: 'AI agent monitoring' },
            ].map((topic) => (
              <button
                key={topic.label}
                className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg group hover:bg-surface-container-high transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-lg">{topic.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-on-surface block">{topic.label}</span>
                    <span className="text-[10px] text-on-surface/30">{topic.desc}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface/20">chevron_right</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Status Monitor */}
        <div className="mt-auto p-8 border-t border-white/5 bg-surface-container-lowest/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-on-surface/40">Status Monitor</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(98,223,125,0.6)]"></span>
              <span className="text-[10px] font-bold text-primary">Live</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-2xl font-light text-on-surface">99.98%</p>
              <p className="text-[10px] text-on-surface/30">Uptime Reliability</p>
            </div>
            <div className="flex gap-0.5 items-end h-8">
              {[
                { h: '4', op: '20' },
                { h: '6', op: '40' },
                { h: '5', op: '30' },
                { h: '8', op: '100' },
                { h: '7', op: '60' },
              ].map((bar, i) => (
                <div key={i} className="w-1 bg-primary" style={{ height: `${bar.h}px`, opacity: Number(bar.op) / 100 }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Main Content */}
      <div className="flex-1 overflow-y-auto p-12">
        {/* Hero */}
        <header className="max-w-4xl mb-16">
          <h3 className="font-serif text-6xl text-on-surface mb-8 tracking-tight">How can we assist your analysis?</h3>
          <div className="flex flex-wrap gap-3">
            {['Tax Jurisdictions', 'KYC Protocol', 'API Rate Limits', 'Reconciliation Rules'].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-surface-container text-on-surface/60 text-xs font-medium border border-white/5 cursor-pointer hover:border-primary/20 hover:text-primary transition-colors">{tag}</span>
            ))}
          </div>
        </header>

        {/* Featured Article */}
        <div className="grid grid-cols-12 gap-6 mb-12 max-w-5xl">
          <div className="col-span-8 group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden h-[340px] flex flex-col justify-end p-8 transition-all hover:scale-[1.01] glass-panel">
              <img
                alt="Market Analysis"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoQ0QnHy-SUniNC-HMHjt0KMtWQvrf7vtz_4dZP_-43G-yu2GTrA6Z4Ih0uol3NXd_hcjuJbuAq1xJsXZW0crouFK8kTbcZWHVMW7UjHQwfDUelzbU3YQpysjxmWLe_M02q8MLH78sq1Smu87o4B97gV2kXpXJTkSUGRZ7CDRa9oiajOoBlmT9EDLTwVK6Mc10ffgarQr5duNP3P3mz4ZWOrgeRBfRHC6PPwRmd2iGWGsWRJS8JBW1aALcqqPF1VPPqa99cdKJICU"
              />
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-primary mb-2 block uppercase tracking-widest">Guide &bull; 12 min read</span>
                <h4 className="font-serif text-3xl mb-4 group-hover:text-primary transition-colors">Mastering Sovereign Forecast Models</h4>
                <p className="text-on-surface/60 text-sm max-w-lg mb-6 leading-relaxed">Learn how to leverage our proprietary neural engines to simulate 10-year fiscal trajectories with 94% statistical confidence.</p>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface group/btn">
                  Read Analysis
                  <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Side Widgets */}
          <div className="col-span-4 space-y-6">
            <div className="bg-surface-container rounded-xl p-6 border border-white/5">
              <h5 className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold mb-6">System Health</h5>
              <div className="space-y-4">
                {[
                  { label: 'API Latency', value: '24ms', ok: true },
                  { label: 'Processing Hub', value: 'Nominal', ok: true },
                  { label: 'Vault Security', value: 'Active', ok: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-on-surface/70">{row.label}</span>
                    <span className="font-mono text-xs text-primary">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-surface-container-lowest rounded-lg">
                <p className="text-[10px] text-on-surface/40 mb-1">Last Audit</p>
                <p className="font-mono text-xs font-medium">04:22:11 GMT-0</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 relative overflow-hidden group hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-primary/10 rotate-12">person_search</span>
              <h5 className="text-xs font-bold text-primary mb-2 uppercase tracking-tight">Need expert help?</h5>
              <p className="text-xs text-on-surface/60 mb-4 leading-relaxed">Direct connection to a Senior Financial Analyst is available for Platinum accounts.</p>
              <button className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                Open Secure Line
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Articles */}
        <div className="grid grid-cols-3 gap-6 mb-12 max-w-5xl">
          {[
            {
              icon: 'security',
              title: 'Compliance Guard v4.2',
              desc: 'Understanding the latest EU taxonomy updates and automated reporting triggers for cross-border transactions.',
            },
            {
              icon: 'account_tree',
              title: 'Smart Ledger Mapping',
              desc: 'Guide on configuring the AuditFlow API to mirror complex multi-entity corporate structures for real-time ledger sync.',
            },
            {
              icon: 'hub',
              title: 'Invoice Automation Hub',
              desc: 'Deploying headless invoicing workflows using our serverless terminal to eliminate manual reconciliations.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-surface-container-highest rounded flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">{card.icon}</span>
              </div>
              <h6 className="text-lg font-semibold mb-3 text-on-surface">{card.title}</h6>
              <p className="text-xs text-on-surface/50 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Whitepapers */}
        <div className="pt-12 border-t border-white/5 max-w-5xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] text-on-surface/30 uppercase tracking-[0.3em]">Documentation Archives</span>
              <h4 className="font-serif text-4xl mt-2 text-on-surface">Whitepapers &amp; Technical Specs</h4>
            </div>
            <button className="px-6 py-2 border border-white/10 rounded-full text-xs font-medium hover:bg-white/5 transition-colors">View All Archive</button>
          </div>
          <div className="space-y-4">
            {[
              { num: '001', title: 'Algorithmic Risk Management: The 2024 Protocol', meta: 'Version 1.0.4 &bull; PDF &bull; 4.2 MB' },
              { num: '002', title: 'Neural Network Forecasting: Statistical Bounds', meta: 'Version 0.9.8 &bull; PDF &bull; 1.8 MB' },
            ].map((paper) => (
              <div key={paper.num} className="flex items-center justify-between p-6 bg-surface-container-lowest/50 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-6">
                  <span className="font-mono text-on-surface/20">{paper.num}</span>
                  <div>
                    <h5 className="text-sm font-semibold group-hover:text-primary transition-colors text-on-surface">{paper.title}</h5>
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-1">{paper.meta}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface/20 group-hover:text-on-surface">download</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB: Talk to Analyst */}
      <button className="fixed bottom-8 right-8 z-[60] bg-primary text-on-primary-container px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 group hover:scale-105 transition-transform">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
        <span className="text-sm font-bold uppercase tracking-widest">Talk to an Analyst</span>
      </button>
    </div>
  );
}
