'use client';

import React from 'react';

export default function AgentConsoleView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>

{/* Fixed Spines (SideNavBar Anchors) */}
<aside className="fixed left-0 top-0 h-full w-[52px] bg-[#10141a] flex flex-col items-center py-6 gap-8 overflow-y-auto z-50">
<div className="text-[#62df7d] font-black text-2xl mb-4">FP</div>
<nav className="flex flex-col gap-6 w-full items-center">
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded scale-95 active:scale-90">
<span className="material-symbols-outlined">grid_view</span>
</button>
<button className="text-[#62df7d] bg-[#1c2026] scale-110 p-2 rounded">
<span className="material-symbols-outlined">monitoring</span>
</button>
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">receipt_long</span>
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
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">settings</span>
</button>
</nav>
<div className="mt-auto">
<button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all duration-300 p-2 rounded">
<span className="material-symbols-outlined">help_outline</span>
</button>
</div>
</aside>
<aside className="fixed left-[52px] top-0 h-full w-[240px] bg-[#10141a] flex flex-col px-6 py-8 gap-6 z-40">
<div className="flex flex-col">
<span className="text-[#dfe2eb] font-bold text-lg tracking-tight">Context</span>
<span className="text-[#dfe2eb]/40 text-xs font-mono">Operational Focus</span>
</div>
<div className="flex flex-col gap-2">
<div className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors flex items-center gap-3 cursor-pointer">
<span className="material-symbols-outlined text-sm">corporate_fare</span>
<span className="text-sm font-medium">Entity Selector</span>
</div>
<div className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors flex items-center gap-3 cursor-pointer">
<span className="material-symbols-outlined text-sm">calendar_today</span>
<span className="text-sm font-medium">Fiscal 2024</span>
</div>
<div className="text-[#62df7d] font-semibold bg-[#1c2026]/50 px-3 py-2 rounded flex items-center gap-3 cursor-pointer">
<span className="material-symbols-outlined text-sm">event_note</span>
<span className="text-sm">Monthly Review</span>
</div>
<div className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors flex items-center gap-3 cursor-pointer">
<span className="material-symbols-outlined text-sm">history_edu</span>
<span className="text-sm font-medium">Audit Trail</span>
</div>
<div className="text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb] px-3 py-2 rounded transition-colors flex items-center gap-3 cursor-pointer">
<span className="material-symbols-outlined text-sm">ios_share</span>
<span className="text-sm font-medium">Export Settings</span>
</div>
</div>
<div className="mt-auto p-4 rounded-xl bg-surface-container-low">
<div className="flex items-center gap-2 mb-2">
<div className="w-2 h-2 rounded-full bg-primary pulsing-dot"></div>
<span className="text-[10px] uppercase tracking-widest text-primary font-bold">Network Stable</span>
</div>
<p className="text-[11px] text-on-surface-variant leading-relaxed">System healthy. Latency 14ms. 128 active nodes processing fiscal entities.</p>
</div>
</aside>
{/* Top Navigation Bar */}
<header className="fixed top-0 right-0 w-[calc(100%-292px)] h-16 bg-[#10141a]/80 backdrop-blur-xl flex items-center justify-between px-8 z-30">
<div className="flex items-center gap-4 flex-1">
<div className="bg-surface-container-low flex items-center px-4 py-2 rounded-lg w-full max-w-md">
<span className="material-symbols-outlined text-on-surface-variant text-sm mr-3">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface font-body" placeholder="Search commands or agents..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="hover:bg-[#1c2026] rounded-full p-2 transition-all text-on-surface-variant">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="hover:bg-[#1c2026] rounded-full p-2 transition-all text-on-surface-variant">
<span className="material-symbols-outlined">sensors</span>
</button>
<button className="hover:bg-[#1c2026] rounded-full p-2 transition-all text-on-surface-variant">
<span className="material-symbols-outlined">contrast</span>
</button>
<div className="h-8 w-8 rounded-lg overflow-hidden bg-surface-container-highest">
<img alt="User" data-alt="minimalist geometric abstract avatar with green and charcoal tones matching the financial console aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSfUMtRpmthZVO_UQnXfTq_s2Tm1d54EubmSGfehobCvbrQ7p0GTPxXwGzJSGrrWJ3AMXkuCo15qnV2XpNg1Rb3Ia2wdxU5j8TbQZ1UMiYP5L4_hFndBDsDQcARlsJcuh5LPKojjyTTWAV_lO2S0lkok1Eq_DdPBzWVsNc70beYZx0QOGa18j2xr7BHBWrYqgbRrmAOK9yMY_NixjGIJsAlQ-3oVsAqQVDbMbNspJ7LIbNwBeJB39pOlLUd4Bf0Y8z9XF5cG85Cc31"/>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-[292px] mt-16 p-8 h-[calc(100vh-64px)] overflow-y-auto grid grid-cols-12 gap-6">
{/* Header Actions Section */}
<div className="col-span-12 flex items-center justify-between mb-2">
<div>
<h1 className="text-3xl font-display text-on-surface leading-none mb-1">Agent Console</h1>
<p className="text-xs text-on-surface-variant font-mono uppercase tracking-[0.2em]">Operational Level: Tier 1 Sovereign</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-error border border-error/30 hover:bg-error/10 transition-colors rounded">
                    Pause All Agents
                </button>
<button className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container hover:bg-primary transition-colors rounded">
                    Resume All
                </button>
<div className="w-px h-6 bg-surface-container-high mx-2"></div>
<button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded">
<span className="material-symbols-outlined text-sm">delete_sweep</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded">
<span className="material-symbols-outlined text-sm">terminal</span>
</button>
</div>
</div>
{/* Agent Status Grid (3x2) */}
<div className="col-span-8 grid grid-cols-3 gap-4">
{/* Agent Card */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden">
<div className="absolute inset-0 opacity-10 pointer-events-none">
<svg className="w-full h-full" viewBox="0 0 200 100">
<path d="M0,80 L20,70 L40,85 L60,60 L80,65 L100,40 L120,45 L140,20 L160,25 L180,5 L200,10" fill="none" stroke="#62df7d" strokeWidth="2"></path>
</svg>
</div>
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Invoice</h3>
<div className="text-2xl font-display text-on-surface">99.2%</div>
</div>
<div className="w-3 h-3 bg-primary rounded-full pulsing-dot"></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-primary">12ms</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-on-surface">0.02%</span>
</div>
</div>
</div>
{/* Agent Card 2 */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden">
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Recon</h3>
<div className="text-2xl font-display text-on-surface">94.8%</div>
</div>
<div className="w-3 h-3 bg-primary rounded-full pulsing-dot"></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-primary">45ms</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-on-surface">0.14%</span>
</div>
</div>
</div>
{/* Agent Card 3 */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden">
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Tax</h3>
<div className="text-2xl font-display text-on-surface">100%</div>
</div>
<div className="w-3 h-3 bg-primary rounded-full pulsing-dot"></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-primary">8ms</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-on-surface">0.00%</span>
</div>
</div>
</div>
{/* Agent Card 4 */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden">
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Forecast</h3>
<div className="text-2xl font-display text-on-surface-variant italic opacity-50 underline decoration-dotted">Offline</div>
</div>
<div className="w-3 h-3 bg-surface-variant rounded-full"></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-on-surface-variant">—</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-on-surface-variant">—</span>
</div>
</div>
</div>
{/* Agent Card 5 */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden border border-tertiary-container/20">
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Report</h3>
<div className="text-2xl font-display text-tertiary">Degraded</div>
</div>
<div className="w-3 h-3 bg-tertiary-container rounded-full pulsing-dot" style={{'animationDuration': '0.5s'}}></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-tertiary">1420ms</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-tertiary">4.2%</span>
</div>
</div>
</div>
{/* Agent Card 6 */}
<div className="bg-surface-container p-5 rounded-lg flex flex-col justify-between h-44 relative overflow-hidden">
<div className="flex justify-between items-start z-10">
<div>
<h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Audit</h3>
<div className="text-2xl font-display text-on-surface">Active</div>
</div>
<div className="w-3 h-3 bg-primary rounded-full pulsing-dot"></div>
</div>
<div className="flex flex-col gap-1 z-10">
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Latency</span>
<span className="text-xs font-mono text-primary">22ms</span>
</div>
<div className="flex justify-between items-end">
<span className="text-[10px] text-on-surface-variant uppercase font-mono">Error Rate</span>
<span className="text-xs font-mono text-on-surface">0.01%</span>
</div>
</div>
</div>
</div>
{/* Right Side Panel: Performance Metrics */}
<div className="col-span-4 bg-surface-container-low p-6 rounded-lg flex flex-col gap-6">
<h3 className="text-xs font-mono uppercase tracking-[0.3em] text-on-surface-variant">Throughput Index</h3>
<div className="flex flex-col gap-4">
<div className="flex flex-col gap-2">
<div className="flex justify-between text-[10px] font-mono text-on-surface-variant uppercase">
<span>Tokens / Sec</span>
<span className="text-on-surface">4,281</span>
</div>
<div className="h-8 flex items-end gap-1">
<div className="bg-primary/20 h-2 w-full"></div>
<div className="bg-primary/30 h-4 w-full"></div>
<div className="bg-primary/40 h-6 w-full"></div>
<div className="bg-primary/60 h-3 w-full"></div>
<div className="bg-primary h-8 w-full"></div>
<div className="bg-primary/80 h-5 w-full"></div>
<div className="bg-primary/40 h-2 w-full"></div>
<div className="bg-primary h-7 w-full"></div>
</div>
</div>
<div className="flex flex-col gap-2">
<div className="flex justify-between text-[10px] font-mono text-on-surface-variant uppercase">
<span>Concurrent Jobs</span>
<span className="text-on-surface">12</span>
</div>
<div className="h-8 flex items-end gap-1">
<div className="bg-secondary/40 h-3 w-full"></div>
<div className="bg-secondary/40 h-3 w-full"></div>
<div className="bg-secondary h-6 w-full"></div>
<div className="bg-secondary h-6 w-full"></div>
<div className="bg-secondary/40 h-3 w-full"></div>
<div className="bg-secondary/20 h-1 w-full"></div>
<div className="bg-secondary h-5 w-full"></div>
<div className="bg-secondary h-5 w-full"></div>
</div>
</div>
</div>
<div className="mt-4 pt-6 border-t border-surface-container-high">
<div className="flex items-center justify-between mb-4">
<span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Action Queue</span>
<span className="text-[10px] font-mono bg-surface-container-highest px-2 py-0.5 rounded text-primary">Live</span>
</div>
<div className="space-y-4">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-xs text-primary mt-0.5">task_alt</span>
<div className="flex flex-col">
<span className="text-xs font-medium">Reconciling Q3 Ledger</span>
<span className="text-[10px] font-mono text-on-surface-variant">In Progress - 84%</span>
</div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-xs text-on-surface-variant mt-0.5">hourglass_empty</span>
<div className="flex flex-col">
<span className="text-xs font-medium text-on-surface-variant">Exporting Audit Logs</span>
<span className="text-[10px] font-mono text-on-surface-variant">Queued</span>
</div>
</div>
</div>
</div>
<div className="mt-auto">
<button className="w-full py-3 bg-surface-container-high text-xs font-mono uppercase tracking-widest text-on-surface hover:bg-surface-bright transition-all flex items-center justify-center gap-2 rounded">
<span className="material-symbols-outlined text-sm">history</span>
                    View Session Archive
                </button>
</div>
</div>
{/* Bottom Full Width Area: Live Event Stream */}
<div className="col-span-12 bg-[#0a0e14] rounded-lg border border-surface-container-high h-64 flex flex-col overflow-hidden">
<div className="bg-surface-container-low px-4 py-2 border-b border-surface-container-high flex items-center justify-between">
<div className="flex items-center gap-4">
<span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">Live Terminal Stream</span>
<span className="text-[10px] font-mono text-on-surface-variant">TTY: console01/agents</span>
</div>
<div className="flex gap-2">
<div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
</div>
</div>
<div className="p-4 font-mono text-[11px] overflow-y-auto space-y-1 flex-1 leading-relaxed">
<div className="flex gap-4">
<span className="text-on-surface-variant">[14:22:01.042]</span>
<span className="text-primary">[AGENT/INVOICE]</span>
<span className="text-on-surface">Scanning PDF document #INV-2024-0012</span>
<span className="text-secondary ml-auto">CONF: 0.998</span>
</div>
<div className="flex gap-4">
<span className="text-on-surface-variant">[14:22:01.215]</span>
<span className="text-primary">[AGENT/INVOICE]</span>
<span className="text-on-surface">Extracted line items: 4 unique entries. Mapping to vendor profile...</span>
<span className="text-secondary ml-auto">CONF: 0.992</span>
</div>
<div className="flex gap-4">
<span className="text-on-surface-variant">[14:22:02.109]</span>
<span className="text-tertiary-container">[AGENT/RECON]</span>
<span className="text-tertiary">WARNING: Ledger mismatch detected in Entity 0x4A2 - Offset 204.12 USD</span>
<span className="text-tertiary ml-auto">CONF: 0.812</span>
</div>
<div className="flex gap-4">
<span className="text-on-surface-variant">[14:22:03.551]</span>
<span className="text-on-secondary-container">[AGENT/TAX]</span>
<span className="text-on-surface">Validating VAT compliance for UK-based transactions. All passed.</span>
<span className="text-secondary ml-auto">CONF: 1.000</span>
</div>
<div className="flex gap-4 bg-primary/5 -mx-4 px-4 py-0.5">
<span className="text-on-surface-variant">[14:22:04.012]</span>
<span className="text-primary">[AGENT/AUDIT]</span>
<span className="text-primary">AUTO-FIX: Applying remediation for Entity 0x4A2. Balancing account...</span>
<span className="text-secondary ml-auto">CONF: 0.945</span>
</div>
<div className="flex gap-4 opacity-70">
<span className="text-on-surface-variant">[14:22:05.188]</span>
<span className="text-on-tertiary-container">[AGENT/REPORT]</span>
<span className="text-on-surface">Generating fiscal summary for Monthly Review cycle...</span>
<span className="text-on-surface-variant ml-auto">CONF: 0.920</span>
</div>
<div className="flex gap-4">
<span className="text-on-surface-variant">[14:22:05.612]</span>
<span className="text-primary">[AGENT/INVOICE]</span>
<span className="text-on-surface">Success. Archive stored in DB/002/2024.</span>
<span className="text-secondary ml-auto">CONF: 0.999</span>
</div>
<div className="animate-pulse text-primary font-bold">_</div>
</div>
</div>
</main>


    </>
  );
}
