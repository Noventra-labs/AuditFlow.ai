'use client';

import React from 'react';

export default function HelpView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>

{/*  SideNavBar Component  */}
<nav className="fixed left-0 top-0 h-full flex flex-col bg-[#0a0e14] dark:bg-[#0a0e14] h-full w-64 border-r-0 z-50">
<div className="p-8">
<h1 className="text-xl font-serif text-[#dfe2eb] dark:text-[#dfe2eb] mb-1">The Ledger</h1>
<p className="font-serif font-['Newsreader'] tracking-tight text-[#bdcaba] opacity-70 text-xs">Private Banking</p>
</div>
<div className="flex-1 px-4 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-[#bdcaba] opacity-70 hover:bg-[#1c2026] hover:text-[#dfe2eb] transition-colors scale-95 duration-150 rounded-md" href="#">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
<span className="font-serif font-['Newsreader'] tracking-tight">Terminal</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-[#bdcaba] opacity-70 hover:bg-[#1c2026] hover:text-[#dfe2eb] transition-colors scale-95 duration-150 rounded-md" href="#">
<span className="material-symbols-outlined" data-icon="query_stats">query_stats</span>
<span className="font-serif font-['Newsreader'] tracking-tight">Analytics</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-[#bdcaba] opacity-70 hover:bg-[#1c2026] hover:text-[#dfe2eb] transition-colors scale-95 duration-150 rounded-md" href="#">
<span className="material-symbols-outlined" data-icon="account_balance">account_balance</span>
<span className="font-serif font-['Newsreader'] tracking-tight">Ledger</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-[#bdcaba] opacity-70 hover:bg-[#1c2026] hover:text-[#dfe2eb] transition-colors scale-95 duration-150 rounded-md" href="#">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-serif font-['Newsreader'] tracking-tight">Archive</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-[#62df7d] font-bold bg-[#181c22] rounded-md" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-serif font-['Newsreader'] tracking-tight">Support</span>
</a>
</div>
<div className="p-6">
<button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-medium rounded-md text-sm mb-8">
                Quick Audit
            </button>
<div className="space-y-1">
<a className="flex items-center gap-3 px-4 py-2 text-[#bdcaba] opacity-70 hover:text-[#dfe2eb] transition-colors" href="#">
<span className="material-symbols-outlined text-sm" data-icon="settings">settings</span>
<span className="text-xs uppercase tracking-widest font-mono">Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-2 text-[#bdcaba] opacity-70 hover:text-[#dfe2eb] transition-colors" href="#">
<span className="material-symbols-outlined text-sm" data-icon="logout">logout</span>
<span className="text-xs uppercase tracking-widest font-mono">Logout</span>
</a>
</div>
</div>
</nav>
{/*  TopNavBar Component  */}
<header className="fixed top-0 right-0 left-64 flex justify-between items-center px-12 h-16 z-40 bg-[#10141a]/80 dark:bg-[#10141a]/80 backdrop-blur-xl border-b border-[#3e4a3d]/15 shadow-sm opacity-4">
<div className="flex items-center gap-8">
<span className="text-lg font-serif italic text-[#dfe2eb]">Help &amp; Support</span>
<div className="relative hidden lg:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" data-icon="search">search</span>
<input className="bg-surface-container-low border-none rounded-md pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 font-mono" placeholder="Quick find documentation..." type="text"/>
</div>
</div>
<div className="flex items-center gap-8">
<nav className="flex items-center gap-6">
<a className="text-[#62df7d] border-b-2 border-[#62df7d] font-mono font-['DM_Mono'] text-sm tracking-widest py-5 h-16 flex items-center" href="#">Guides</a>
<a className="text-[#bdcaba] hover:text-[#62df7d] font-mono font-['DM_Mono'] text-sm tracking-widest ease-in-out duration-300" href="#">API Reference</a>
<a className="text-[#bdcaba] hover:text-[#62df7d] font-mono font-['DM_Mono'] text-sm tracking-widest ease-in-out duration-300" href="#">Compliance</a>
</nav>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#bdcaba] cursor-pointer" data-icon="notifications">notifications</span>
<button className="px-4 py-1.5 border border-primary/20 text-primary rounded-md text-xs font-mono uppercase tracking-widest hover:bg-primary/5 transition-colors">
                    Contact Advisor
                </button>
<div className="h-8 w-8 rounded-full overflow-hidden bg-surface-container-highest">
<img alt="Support specialist" className="h-full w-full object-cover" data-alt="Professional portrait of a support specialist in business attire with a confident expression and soft office lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Nxv-PCbOYldAHBUt1hOsqniVx0rFlPJbPHrqqPXVNRLAlCkZqq1z1N2F79LfC7_D2cotSHC2J9fakY2n18lxLSa1wqigrnomiMYV7J1c3XJqG5LHuZHputfbsgFHmQCjJFbAc2nJwYJK0hnxv_bs3ULUuB1-8Ny8dcD2bWo0FP_Y0Arl9agboqnmDVr4hMiXEjAyXjk-FyraLppkCFON0wo4raA0XwF_aPOT64mAiRd3IT2ydurwNxi5n53MJdA-JBAGj3ZBanw"/>
</div>
</div>
</div>
</header>
{/*  Main Content Layout  */}
<main className="ml-64 pt-16 flex min-h-screen">
{/*  Center Content Canvas  */}
<div className="flex-1 px-12 py-16 max-w-5xl">
{/*  Search Header Section  */}
<section className="mb-20 text-center">
<h2 className="text-5xl font-serif -tracking-[0.02em] text-on-surface mb-8">How can we assist you today?</h2>
<div className="relative max-w-2xl mx-auto">
<input className="w-full bg-surface-container border-none rounded-md px-6 py-5 text-xl font-serif text-on-surface focus:ring-1 focus:ring-primary shadow-2xl placeholder:text-on-surface-variant/30" placeholder="Search the knowledge base..." type="text"/>
<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
<span className="text-xs font-mono text-on-surface-variant/50 border border-outline-variant/30 px-1.5 py-0.5 rounded">⌘ K</span>
</div>
</div>
</section>
{/*  Quick Links Bento-ish Grid  */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
<a className="group p-8 bg-surface-container-low rounded-md hover:bg-surface-container transition-colors relative overflow-hidden" href="#">
<div className="mb-12">
<span className="material-symbols-outlined text-primary text-3xl mb-4 block" data-icon="code">code</span>
<h3 className="text-xl font-serif text-on-surface group-hover:text-primary transition-colors">API Documentation</h3>
<p className="text-sm text-on-surface-variant mt-2">Complete endpoint documentation for high-frequency trading and data ingestion.</p>
</div>
<span className="text-xs font-mono text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        EXPLORE DOCS <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
<a className="group p-8 bg-surface-container-low rounded-md hover:bg-surface-container transition-colors relative overflow-hidden" href="#">
<div className="mb-12">
<span className="material-symbols-outlined text-primary text-3xl mb-4 block" data-icon="security">security</span>
<h3 className="text-xl font-serif text-on-surface group-hover:text-primary transition-colors">Security Protocol</h3>
<p className="text-sm text-on-surface-variant mt-2">Review our zero-trust architecture and multi-sig authorization frameworks.</p>
</div>
<span className="text-xs font-mono text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        READ PROTOCOLS <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
<a className="group p-8 bg-surface-container-low rounded-md hover:bg-surface-container transition-colors relative overflow-hidden" href="#">
<div className="mb-12">
<span className="material-symbols-outlined text-primary text-3xl mb-4 block" data-icon="verified_user">verified_user</span>
<h3 className="text-xl font-serif text-on-surface group-hover:text-primary transition-colors">Account Verification</h3>
<p className="text-sm text-on-surface-variant mt-2">Manage KYB/KYC certifications and institutional identity credentials.</p>
</div>
<span className="text-xs font-mono text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        VERIFY NOW <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
</section>
{/*  Video Tutorials  */}
<section className="mb-24">
<div className="flex justify-between items-end mb-8">
<div>
<h3 className="text-2xl font-serif text-on-surface">Instructional Series</h3>
<p className="text-sm text-on-surface-variant font-mono mt-1">CURATED VIDEO GUIDES FOR MASTERING THE LEDGER</p>
</div>
<a className="text-xs font-mono text-primary hover:underline" href="#">VIEW ALL TUTORIALS</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="space-y-4">
<div className="aspect-video bg-surface-container-high rounded-md overflow-hidden relative group cursor-pointer">
<img alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" data-alt="abstract architectural visualization of flowing light lines on a dark background representing high speed financial data" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNhshwgN2_hjdaXhUmdlD-B6tpMC24tNXy38eRTjP0LIH0B-8NrYwQ2ylaV3YDNqtSwQVypGgv8XDsFdjyxEKqrmxWW0c-OHZoaOwLGPRzNXDbEW5QBHee9guTfAISBuTQlNwfhFg7apKMnvkYj7IlYq_wK5NlzRreEnvcoJSEEeP1hcrN3HmJipbvZAqbdDyaacNqm55kIRKaH5UJjvUjoeV60iN018S2U4_CuZJa8zb1unfXGgIH_P1AWzhNy5jg0XQVXkfNKok"/>
<div className="absolute inset-0 flex items-center justify-center">
<span className="material-symbols-outlined text-5xl text-on-surface opacity-80 group-hover:scale-110 transition-transform" data-icon="play_circle">play_circle</span>
</div>
</div>
<div>
<h4 className="font-serif text-lg leading-tight">Getting Started with Ledger</h4>
<p className="text-xs font-mono text-on-surface-variant mt-1 uppercase">04:22 • INFRASTRUCTURE</p>
</div>
</div>
<div className="space-y-4">
<div className="aspect-video bg-surface-container-high rounded-md overflow-hidden relative group cursor-pointer">
<img alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" data-alt="close-up of digital security hardware token with blue led light in a dark high-tech environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6SwXHrvyRpnhkNQM-BfIlRBUPuAyXEae9u1Q6Up0W0s5imqDT6mnWm7E1uO-nrFJX7GbeL83IpmGbDb-9o1d8nJB7UZXZ8aD85iCawTH-H9Vnx83EE3zBaoUkA5JuHTjajYff-WrAoP49cQ_wXSdXIJoPyp1dnXZNgz9nZaNrmRrgsZLjCjv21gH7Sr0f3i_8LELnkpQkKTojpDnNjYm_7R-pd-3M5BtPRQP0DszQJmHFIl7B1hX-UBNXNe1UE8VJcy745iQGZIw"/>
<div className="absolute inset-0 flex items-center justify-center">
<span className="material-symbols-outlined text-5xl text-on-surface opacity-80 group-hover:scale-110 transition-transform" data-icon="play_circle">play_circle</span>
</div>
</div>
<div>
<h4 className="font-serif text-lg leading-tight">Setting up Multi-Factor</h4>
<p className="text-xs font-mono text-on-surface-variant mt-1 uppercase">03:15 • SECURITY</p>
</div>
</div>
<div className="space-y-4">
<div className="aspect-video bg-surface-container-high rounded-md overflow-hidden relative group cursor-pointer">
<img alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" data-alt="stylized dashboard showing intricate golden charts and data visualizations against a deep dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ80sQ6VGUyT1I-xZ7Zm2QAz6V1AU2JhrEPw244xjxIc_4kvj-be2K6iO-JbcdWoeIko0whB5Xr_bXB3Jq497pASSrBTks6Npj0YQJAC2Zk6YLcH-eoOTPHg7zhCxzdHItI_wsvQof7b74G0kxHgZtIus8rnL9OWi8K8nwa-JFUhHFqbnwAWfMG94qJNBFcI757p3aZNyA_RpTmRrIb1nau0rBV0IEWjzXba-0a8lhmArFgbvQEATlXg0hR8q6TcibW0E-ojZcVf4"/>
<div className="absolute inset-0 flex items-center justify-center">
<span className="material-symbols-outlined text-5xl text-on-surface opacity-80 group-hover:scale-110 transition-transform" data-icon="play_circle">play_circle</span>
</div>
</div>
<div>
<h4 className="font-serif text-lg leading-tight">Advanced Analytics</h4>
<p className="text-xs font-mono text-on-surface-variant mt-1 uppercase">12:45 • TERMINAL</p>
</div>
</div>
</div>
</section>
{/*  FAQ Section  */}
<section className="mb-24">
<h3 className="text-3xl font-serif text-on-surface mb-10">Common Inquiries</h3>
<div className="space-y-0.5">
<div className="bg-surface-container-low group">
<button className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-surface-container transition-colors">
<span className="font-serif text-lg">How are inter-ledger reconciliation cycles handled?</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="expand_more">expand_more</span>
</button>
</div>
<div className="bg-surface-container-low group">
<button className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-surface-container transition-colors">
<span className="font-serif text-lg">What are the protocols for high-value transactional tax filing?</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="expand_more">expand_more</span>
</button>
</div>
<div className="bg-surface-container-low group">
<button className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-surface-container transition-colors">
<span className="font-serif text-lg">Managing cross-border clearing for private equity?</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="expand_more">expand_more</span>
</button>
</div>
<div className="bg-surface-container-low group">
<button className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-surface-container transition-colors">
<span className="font-serif text-lg">Revoking institutional API tokens during an audit?</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="expand_more">expand_more</span>
</button>
</div>
</div>
</section>
</div>
{/*  Right Context Sidebar  */}
<aside className="w-80 bg-surface px-8 py-16 border-l border-outline-variant/10">
<div className="sticky top-32">
<h4 className="text-xs font-mono tracking-[0.2em] text-on-surface-variant/60 uppercase mb-8">Documentation Topics</h4>
<nav className="space-y-6">
<div>
<span className="text-xs font-mono text-primary block mb-3">01</span>
<a className="font-serif text-xl text-on-surface hover:text-primary transition-colors block" href="#">Authentication</a>
<p className="text-xs text-on-surface-variant mt-1 leading-relaxed">JWT, OAuth2, and Biometric signature integration.</p>
</div>
<div>
<span className="text-xs font-mono text-primary block mb-3">02</span>
<a className="font-serif text-xl text-on-surface hover:text-primary transition-colors block" href="#">Webhooks</a>
<p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Real-time event streaming for transaction updates.</p>
</div>
<div>
<span className="text-xs font-mono text-primary block mb-3">03</span>
<a className="font-serif text-xl text-on-surface hover:text-primary transition-colors block" href="#">Rate Limits</a>
<p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Tiered request quotas for institutional partners.</p>
</div>
<div>
<span className="text-xs font-mono text-primary block mb-3">04</span>
<a className="font-serif text-xl text-on-surface hover:text-primary transition-colors block" href="#">Exporting Data</a>
<p className="text-xs text-on-surface-variant mt-1 leading-relaxed">CSV, JSON, and PDF generation for tax compliance.</p>
</div>
</nav>
<div className="mt-20 p-6 bg-surface-container-highest rounded-md relative overflow-hidden group">
<div className="relative z-10">
<h5 className="font-serif text-lg mb-2">Need a human?</h5>
<p className="text-xs text-on-surface-variant mb-4">Dedicated advisors are available 24/7 for institutional accounts.</p>
<button className="w-full py-2 bg-on-surface text-surface text-[10px] font-mono tracking-widest uppercase rounded-sm hover:bg-primary transition-colors">
                            OPEN PRIORITY TICKET
                        </button>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="support_agent">support_agent</span>
</div>
</div>
</div>
</aside>
</main>
{/*  Modal Backdrop Placeholder (Search Overlay)  */}
<div className="hidden fixed inset-0 z-[60] bg-surface-container-lowest/90 backdrop-blur-md flex items-start justify-center pt-32">
<div className="w-full max-w-3xl px-6">
<div className="bg-surface-container-high rounded-xl p-4 shadow-2xl">
<input className="w-full bg-transparent border-none text-2xl font-serif text-on-surface placeholder:text-on-surface-variant/20 focus:ring-0" placeholder="Type to search everything..." type="text"/>
</div>
</div>
</div>

    </>
  );
}
