'use client';

import React from 'react';

export default function TaxComplianceView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>

{/* Fixed Spine Navigation */}
<nav className="fixed left-0 top-0 h-full w-[52px] bg-[#10141a] flex flex-col items-center py-6 gap-8 overflow-y-auto z-50">
<div className="text-[#62df7d] font-black text-2xl">F</div>
<div className="flex flex-col gap-6">
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">grid_view</span>
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">monitoring</span>
<span className="material-symbols-outlined text-[#62df7d] bg-[#1c2026] scale-110 p-2 rounded transition-all cursor-pointer">receipt_long</span>
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">account_balance</span>
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">description</span>
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">verified_user</span>
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">settings</span>
</div>
<div className="mt-auto">
<span className="material-symbols-outlined text-[#dfe2eb]/40 hover:text-[#62df7d] transition-colors cursor-pointer">help_outline</span>
</div>
</nav>
{/* Contextual Sidebar */}
<aside className="fixed left-[52px] top-0 h-full w-[240px] bg-[#10141a] flex flex-col px-6 py-8 gap-6 z-40 border-r border-outline-variant/10">
<div className="flex flex-col gap-1">
<span className="text-[#dfe2eb] font-bold text-lg">Context</span>
<span className="text-[#dfe2eb]/60 text-sm tracking-tight">Operational Focus</span>
</div>
<nav className="flex flex-col gap-1">
<div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1c2026] text-[#dfe2eb]/60 cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">corporate_fare</span>
<span className="text-sm font-['Plus_Jakarta_Sans']">Entity Selector</span>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1c2026] text-[#dfe2eb]/60 cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">calendar_today</span>
<span className="text-sm font-['Plus_Jakarta_Sans']">Fiscal 2024</span>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded bg-[#1c2026] text-[#62df7d] font-semibold cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">event_note</span>
<span className="text-sm font-['Plus_Jakarta_Sans']">Monthly Review</span>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1c2026] text-[#dfe2eb]/60 cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">history_edu</span>
<span className="text-sm font-['Plus_Jakarta_Sans']">Audit Trail</span>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1c2026] text-[#dfe2eb]/60 cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">ios_share</span>
<span className="text-sm font-['Plus_Jakarta_Sans']">Export Settings</span>
</div>
</nav>
<div className="mt-auto space-y-4">
<button className="w-full bg-[#8b5cf6] text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">notifications_active</span>
                Set Filing Reminders
            </button>
<button className="w-full bg-surface-container text-primary py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm">auto_awesome</span>
                Generate Draft Filing
            </button>
</div>
</aside>
{/* Top AppBar */}
<header className="fixed top-0 right-0 w-[calc(100%-292px)] h-16 bg-[#10141a]/80 backdrop-blur-xl flex items-center justify-between px-8 z-30">
<div className="flex items-center gap-4">
<span className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight text-on-surface">Tax Compliance Portal</span>
<div className="bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-outline">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface-variant" placeholder="Search transactions..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#dfe2eb]/70 hover:bg-[#1c2026] rounded-full p-2 cursor-pointer transition-all">notifications</span>
<span className="material-symbols-outlined text-[#dfe2eb]/70 hover:bg-[#1c2026] rounded-full p-2 cursor-pointer transition-all">sensors</span>
<div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
<img className="w-full h-full object-cover" data-alt="professional male accountant portrait in suit against dark background soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA00tjAboPfHlUozV55IWhrGrP_7NRIwTT6XcNzBtgi_9hObB3OjaQEzye61gNmqh2YYW7k3EFJSqeG9zHAxo-hfw_4CvVrNlc3LYPfN8OPkjYRRVcyXqah_Vm7ZKeAyjC1Hz6vzE9t3SCkkOhyffRByVstiMBhJYIaft8yty-AEbq9UxDitolLUEMhIiHZ3r4RY46owytU50omRsfxQeslDjPDCoATV_dLNVtrEoHUnhUKYC0BFGa_RmDdxa_E_C2qZieJQAUtBu0U"/>
</div>
</div>
</header>
{/* Main Content Area */}
<main className="ml-[292px] pt-16 h-screen overflow-y-auto">
{/* Jurisdiction Tab Bar */}
<div className="sticky top-0 bg-background/95 backdrop-blur-md px-8 pt-6 pb-2 z-20">
<div className="flex items-center gap-8 border-b border-outline-variant/10">
<button className="pb-3 border-b-2 border-[#8b5cf6] text-on-surface font-semibold text-sm">SG GST</button>
<button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">ID PPN</button>
<button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">TH VAT</button>
<button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">PH VAT</button>
<button className="pb-3 text-on-surface-variant/60 hover:text-on-surface text-sm transition-colors">MY SST</button>
</div>
</div>
<div className="px-8 py-6 space-y-8">
{/* Summary Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Input Tax */}
<div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<span className="text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-on-surface-variant">Total Input Tax</span>
<h2 className="text-4xl font-serif text-on-surface mt-2">12,450.82</h2>
<span className="text-mono text-xs text-primary mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[10px]">trending_up</span>
                            +4.2% vs Prev Qtr
                        </span>
</div>
<div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
<svg className="w-full h-full preserve-3d" viewBox="0 0 100 20">
<path className="text-primary" d="M0,20 Q10,5 20,15 T40,10 T60,18 T80,5 T100,12 L100,20 L0,20" fill="currentColor"></path>
</svg>
</div>
</div>
{/* Output Tax */}
<div className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<span className="text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-on-surface-variant">Total Output Tax</span>
<h2 className="text-4xl font-serif text-on-surface mt-2">48,912.44</h2>
<span className="text-mono text-xs text-tertiary mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[10px]">trending_down</span>
                            -1.1% vs Prev Qtr
                        </span>
</div>
<div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
<svg className="w-full h-full" viewBox="0 0 100 20">
<path className="text-tertiary" d="M0,12 Q15,18 30,10 T50,15 T70,5 T85,12 T100,8 L100,20 L0,20" fill="currentColor"></path>
</svg>
</div>
</div>
{/* Net Tax Payable */}
<div className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden border border-outline-variant/10 shadow-xl">
<div className="relative z-10">
<span className="text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-[#8b5cf6]">Net Tax Payable</span>
<h2 className="text-4xl font-serif text-on-surface mt-2">36,461.62</h2>
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
{/* Days Header */}
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Sun</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Mon</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Tue</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Wed</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Thu</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Fri</div>
<div className="text-center text-[10px] uppercase text-on-surface-variant/40 pb-2">Sat</div>
{/* Grid Blocks (Simplified) */}
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
<div className="w-6 h-4 bg-red-600 rounded-sm"></div> {/* Placeholder for SG flag */}
<div>
<h4 className="text-sm font-bold">GST F5 Filing</h4>
<p className="text-[10px] text-on-surface-variant/60 uppercase">Singapore Division</p>
</div>
</div>
<span className="text-mono text-sm text-on-surface font-semibold">36,461.62</span>
</div>
<div className="flex justify-between items-center text-xs">
<span className="text-error font-medium">Due: Oct 13, 2024</span>
<span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
</div>
</div>
<div className="bg-surface-container rounded-xl p-5 border-l-4 border-orange-400">
<div className="flex justify-between items-start mb-3">
<div className="flex items-center gap-3">
<div className="w-6 h-4 bg-white border border-gray-800 rounded-sm"></div> {/* Placeholder for ID flag */}
<div>
<h4 className="text-sm font-bold">PPN Monthly</h4>
<p className="text-[10px] text-on-surface-variant/60 uppercase">Indonesia Office</p>
</div>
</div>
<span className="text-mono text-sm text-on-surface font-semibold">1,240.00</span>
</div>
<div className="flex justify-between items-center text-xs">
<span className="text-orange-400 font-medium">Due: Oct 30, 2024</span>
<span className="bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">DRAFT</span>
</div>
</div>
<div className="bg-surface-container rounded-xl p-5 opacity-60">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-6 h-4 bg-blue-600 rounded-sm"></div> {/* Placeholder for MY flag */}
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
<td className="px-6 py-4 text-mono text-xs">2024-10-04</td>
<td className="px-6 py-4 text-mono text-xs text-[#8b5cf6]">INV-2024-0982</td>
<td className="px-6 py-4 font-medium">Cloudflare Infrastructure</td>
<td className="px-6 py-4 text-mono text-right">12,400.00</td>
<td className="px-6 py-4 text-mono text-right text-on-surface-variant">9%</td>
<td className="px-6 py-4 text-mono text-right text-primary">1,116.00</td>
</tr>
<tr className="hover:bg-surface-container-highest/30 transition-colors">
<td className="px-6 py-4 text-mono text-xs">2024-10-03</td>
<td className="px-6 py-4 text-mono text-xs text-[#8b5cf6]">PUR-TX-5512</td>
<td className="px-6 py-4 font-medium">Apple Singapore Store</td>
<td className="px-6 py-4 text-mono text-right">3,120.50</td>
<td className="px-6 py-4 text-mono text-right text-on-surface-variant">9%</td>
<td className="px-6 py-4 text-mono text-right text-tertiary">280.85</td>
</tr>
<tr className="hover:bg-surface-container-highest/30 transition-colors">
<td className="px-6 py-4 text-mono text-xs">2024-10-02</td>
<td className="px-6 py-4 text-mono text-xs text-[#8b5cf6]">INV-2024-0977</td>
<td className="px-6 py-4 font-medium">Stripe Payments Ltd</td>
<td className="px-6 py-4 text-mono text-right">45,000.00</td>
<td className="px-6 py-4 text-mono text-right text-on-surface-variant">9%</td>
<td className="px-6 py-4 text-mono text-right text-primary">4,050.00</td>
</tr>
<tr className="hover:bg-surface-container-highest/30 transition-colors">
<td className="px-6 py-4 text-mono text-xs">2024-10-01</td>
<td className="px-6 py-4 text-mono text-xs text-[#8b5cf6]">INV-2024-0975</td>
<td className="px-6 py-4 font-medium">Google Cloud SEA</td>
<td className="px-6 py-4 text-mono text-right">8,200.00</td>
<td className="px-6 py-4 text-mono text-right text-on-surface-variant">9%</td>
<td className="px-6 py-4 text-mono text-right text-primary">738.00</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
{/* Visual Floating Gradient Overlay (Subtle Depth) */}
<div className="fixed top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
<div className="fixed bottom-0 left-[292px] w-1/4 h-1/4 bg-[#8b5cf6]/5 blur-[100px] pointer-events-none z-0"></div>


    </>
  );
}
