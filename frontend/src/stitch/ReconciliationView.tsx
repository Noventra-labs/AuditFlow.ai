'use client';

import React from 'react';

export default function ReconciliationView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>

{/* Fixed Spine (SideNavBar 1) */}
<nav className="fixed left-0 top-0 h-full w-[52px] bg-[#10141a] flex flex-col items-center py-6 gap-8 overflow-y-auto z-50">
<div className="text-[#62df7d] font-black text-2xl">FP</div>
<div className="flex flex-col gap-6">
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">grid_view</span>
</button>
<button className="text-[#62df7d] bg-[#1c2026] scale-110 p-2 rounded">
<span className="material-symbols-outlined">receipt_long</span>
</button>
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">monitoring</span>
</button>
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">account_balance</span>
</button>
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">description</span>
</button>
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">verified_user</span>
</button>
</div>
<div className="mt-auto">
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
</nav>
{/* Context Panel (SideNavBar 2) */}
<aside className="fixed left-[52px] top-0 h-full w-[240px] bg-[#10141a] flex flex-col px-6 py-8 gap-6 z-40">
<div>
<h2 className="text-[#dfe2eb] font-bold text-lg">Context</h2>
<p className="text-[#dfe2eb]/40 text-[10px] uppercase tracking-widest font-semibold mt-1">Operational Focus</p>
</div>
<div className="flex flex-col gap-1">
<button className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors text-left flex items-center gap-3">
<span className="material-symbols-outlined text-sm">corporate_fare</span>
<span className="text-sm">Entity Selector</span>
</button>
<button className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors text-left flex items-center gap-3">
<span className="material-symbols-outlined text-sm">calendar_today</span>
<span className="text-sm">Fiscal 2024</span>
</button>
<button className="text-[#62df7d] font-semibold bg-[#1c2026] px-3 py-2 rounded text-left flex items-center gap-3">
<span className="material-symbols-outlined text-sm">event_note</span>
<span className="text-sm">Ledger Review</span>
</button>
<button className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors text-left flex items-center gap-3">
<span className="material-symbols-outlined text-sm">history_edu</span>
<span className="text-sm">Audit Trail</span>
</button>
<button className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors text-left flex items-center gap-3">
<span className="material-symbols-outlined text-sm">ios_share</span>
<span className="text-sm">Export Settings</span>
</button>
</div>
</aside>
{/* Top Navigation */}
<header className="fixed top-0 right-0 w-[calc(100%-292px)] h-16 bg-[#10141a]/80 backdrop-blur-xl flex items-center justify-between px-8 z-30">
<div className="flex items-center bg-surface-container-low px-4 py-1.5 rounded-full w-96">
<span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-full p-0" placeholder="Quick search transactions..." type="text"/>
</div>
<div className="flex items-center gap-4">
<button className="hover:bg-[#1c2026] rounded-full p-2 transition-all text-[#dfe2eb]/70">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="hover:bg-[#1c2026] rounded-full p-2 transition-all text-[#dfe2eb]/70">
<span className="material-symbols-outlined">sensors</span>
</button>
<div className="h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
<img alt="User Profile" data-alt="Portrait of a professional man in a tailored dark suit, studio lighting, corporate portrait style, neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7pKQtTEWgGuK49A5vcrEc_fz-iERare74ruQC1fNXHjK3eaVRWfMTKU0dD1cPngKjRvTduvXXyTe24XWo49-Fs5schEeCbuxFlVsjh8Yd97CKnZtjK7s_-VwibwrGiW_eRoWItboOon-7OJf8149_IVIUIgSk40hlmfn0hv9SQF26jqzyE5SKZjM4kGbMW9oWIFpH74OrVBDnDzvW4FdOlwYLFuT4dGRobxlYeJmS0nx4DArWpxZs3O7EfUflVWkqd9CJBnm9xIqY"/>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="fixed top-16 right-0 w-[calc(100%-292px)] h-[calc(100vh-64px)] overflow-y-auto px-8 py-6 space-y-6">
{/* Header Actions */}
<div className="flex justify-between items-end">
<div>
<h1 className="font-headline font-bold text-3xl tracking-tight text-on-surface">Reconciliation Ledger</h1>
<p className="text-on-surface-variant text-sm mt-1">Surgical reconciliation of pending receivables and bank entries.</p>
</div>
<div className="flex gap-3">
<button className="px-5 py-2.5 rounded-md text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm">ios_share</span> Export Report
                </button>
<button className="px-5 py-2.5 rounded-md text-sm font-semibold text-on-surface bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-2 text-amber-500">
<span className="material-symbols-outlined text-sm">cloud_upload</span> Import Bank Statement
                </button>
<button className="px-5 py-2.5 rounded-md text-sm font-bold text-on-primary-container bg-primary hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': "'FILL' 1"}}>auto_awesome</span> Auto-Reconcile All
                </button>
</div>
</div>
{/* Reconciliation Summary Strip */}
<div className="grid grid-cols-5 gap-px bg-outline-variant/10 rounded-xl overflow-hidden border border-outline-variant/10">
<div className="bg-surface-container px-6 py-4">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">Total Items</p>
<p className="font-serif text-3xl text-on-surface">1,422</p>
</div>
<div className="bg-surface-container px-6 py-4">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">Matched</p>
<div className="flex items-end gap-2">
<p className="font-serif text-3xl text-primary">1,104</p>
<p className="text-primary/60 text-xs font-mono mb-1.5">77.6%</p>
</div>
</div>
<div className="bg-surface-container px-6 py-4">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">Unmatched</p>
<p className="font-serif text-3xl text-tertiary">276</p>
</div>
<div className="bg-surface-container px-6 py-4 border-r border-outline-variant/10">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">Needs Review</p>
<p className="font-serif text-3xl text-amber-400">42</p>
</div>
<div className="bg-surface-container px-6 py-4">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">Unreconciled Value</p>
<p className="font-serif text-3xl text-on-surface">$142,880<span className="text-lg opacity-40 italic">.00</span></p>
</div>
</div>
{/* Progress Widget */}
<div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
<span className="material-symbols-outlined text-xl">sync</span>
</div>
<div>
<h4 className="text-on-surface font-semibold">Active Reconciler Service</h4>
<p className="text-amber-500/80 text-xs font-mono uppercase">Reconciling 42 invoices... 18/42 complete</p>
</div>
</div>
<div className="text-right">
<p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Est. Completion</p>
<p className="text-on-surface font-mono">00:04:12</p>
</div>
</div>
<div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-amber-500 w-[42%] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)]"></div>
</div>
</div>
{/* Split Panel View */}
<div className="grid grid-cols-[1fr_40px_1fr] gap-0">
{/* Left: Unmatched Invoices */}
<div className="bg-surface-container rounded-l-xl p-6 h-[500px] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Unmatched Invoices</h3>
<span className="text-[10px] bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-full font-mono">276 PENDING</span>
</div>
<div className="flex-1 overflow-y-auto pr-2 space-y-3">
{/* Item 1 */}
<div className="p-4 bg-surface-container-low rounded group hover:bg-surface-container-high transition-all cursor-pointer relative">
<div className="flex justify-between items-start">
<div>
<p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-tighter">INV-2024-8841</p>
<p className="text-sm font-semibold text-on-surface">Stripe-Connect-Fees</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">2024.03.14</p>
</div>
<div className="text-right">
<p className="text-sm font-mono font-bold text-on-surface">$12,400.00</p>
<span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">CONFIDENCE: 92%</span>
</div>
</div>
</div>
{/* Item 2 */}
<div className="p-4 bg-surface-container-low rounded border-l-2 border-primary/40">
<div className="flex justify-between items-start">
<div>
<p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-tighter">INV-2024-8839</p>
<p className="text-sm font-semibold text-on-surface">Amazon AWS Cloud Serv.</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">2024.03.14</p>
</div>
<div className="text-right">
<p className="text-sm font-mono font-bold text-on-surface">$3,150.00</p>
<span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">CONFIDENCE: 98%</span>
</div>
</div>
</div>
{/* Item 3 */}
<div className="p-4 bg-surface-container-low rounded border-l-2 border-tertiary/40 opacity-70">
<div className="flex justify-between items-start">
<div>
<p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-tighter">INV-2024-8835</p>
<p className="text-sm font-semibold text-on-surface">Global Logistics Co.</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">2024.03.12</p>
</div>
<div className="text-right">
<p className="text-sm font-mono font-bold text-on-surface">$820.50</p>
<span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary/10 text-tertiary border border-tertiary/20">CONFIDENCE: 24%</span>
</div>
</div>
</div>
</div>
</div>
{/* Middle: Connectors */}
<div className="bg-surface-container flex flex-col justify-around py-12 relative">
<div className="reconciliation-connector w-full absolute top-[164px]"></div>
<div className="reconciliation-connector w-full absolute top-[284px]"></div>
<div className="flex flex-col items-center gap-16 z-10 text-amber-500/40">
<span className="material-symbols-outlined text-lg">link</span>
<span className="material-symbols-outlined text-lg">link</span>
</div>
</div>
{/* Right: Bank Transactions */}
<div className="bg-surface-container rounded-r-xl p-6 h-[500px] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Bank Transactions</h3>
<div className="flex gap-2">
<span className="text-[10px] bg-primary-container/20 text-primary px-2 py-0.5 rounded-full font-mono">1,104 SETTLED</span>
</div>
</div>
<div className="flex-1 overflow-y-auto pr-2 space-y-3">
{/* Item 1 */}
<div className="p-4 bg-surface-container-low rounded border-r-2 border-amber-500/40 group hover:bg-surface-container-high transition-all cursor-pointer">
<div className="flex justify-between items-start">
<div className="text-right order-2">
<p className="text-sm font-mono font-bold text-on-surface">$12,400.00</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1 uppercase tracking-widest">Ref: B-99321</p>
</div>
<div>
<p className="text-sm font-semibold text-on-surface">Incoming Wire: STRP-FEE-88</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">Chase Commercial Checking</p>
<p className="text-xs text-on-surface-variant font-mono">2024.03.15</p>
</div>
</div>
</div>
{/* Item 2 */}
<div className="p-4 bg-surface-container-low rounded border-r-2 border-primary/40">
<div className="flex justify-between items-start">
<div className="text-right order-2">
<p className="text-sm font-mono font-bold text-on-surface">$3,150.00</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1 uppercase tracking-widest">Ref: B-99318</p>
</div>
<div>
<p className="text-sm font-semibold text-on-surface">ACH DEBIT: AMZ AWS PAY</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">Wells Fargo Primary</p>
<p className="text-xs text-on-surface-variant font-mono">2024.03.14</p>
</div>
</div>
</div>
{/* Item 3 */}
<div className="p-4 bg-surface-container-low rounded opacity-70">
<div className="flex justify-between items-start">
<div className="text-right order-2">
<p className="text-sm font-mono font-bold text-on-surface">$5,000.00</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1 uppercase tracking-widest">Ref: B-99304</p>
</div>
<div>
<p className="text-sm font-semibold text-on-surface">TFR: INTERNAL SETTLE</p>
<p className="text-xs text-on-surface-variant mt-0.5 font-mono">Savings -&gt; Operational</p>
<p className="text-xs text-on-surface-variant font-mono">2024.03.14</p>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Reconciled History Accordion */}
<div className="space-y-3">
<div className="flex items-center justify-between">
<h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Reconciled History</h3>
<button className="text-xs text-primary font-bold hover:underline">Clear History</button>
</div>
<div className="bg-surface-container-low rounded-lg border border-outline-variant/10 overflow-hidden">
<div className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container/40">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary">check_circle</span>
<div>
<p className="text-sm font-bold text-on-surface">Batch REC-882 (Completed Today)</p>
<p className="text-xs text-on-surface-variant">124 items matched by AI-Engine 4.0</p>
</div>
</div>
<div className="flex items-center gap-6">
<p className="font-mono text-sm text-on-surface">$412,042.88</p>
<span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
</div>
</div>
</div>
<div className="bg-surface-container-low rounded-lg border border-outline-variant/10 overflow-hidden">
<div className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container/40">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary">check_circle</span>
<div>
<p className="text-sm font-bold text-on-surface">Batch REC-881 (Mar 14, 2024)</p>
<p className="text-xs text-on-surface-variant">88 items matched manually by J. Carter</p>
</div>
</div>
<div className="flex items-center gap-6">
<p className="font-mono text-sm text-on-surface">$92,100.12</p>
<span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
</div>
</div>
</div>
</div>
</main>
{/* Contextual FAB (Suppressed on Ledger/Settings per guidelines, but if it was needed it would go here) */}


    </>
  );
}
