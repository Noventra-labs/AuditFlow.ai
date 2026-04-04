import { NavLink, Outlet } from 'react-router-dom';

const spineNavItems = [
  { path: '/', icon: 'grid_view', label: 'Dashboard' },
  { path: '/forecast', icon: 'monitoring', label: 'Forecast' },
  { path: '/invoices', icon: 'receipt_long', label: 'Invoices' },
  { path: '/tax-compliance', icon: 'account_balance', label: 'Tax' },
  { path: '/reports', icon: 'description', label: 'Reports' },
  { path: '/reconciliation', icon: 'verified_user', label: 'Reconciliation' },
  { path: '/agent-console', icon: 'settings', label: 'Agent Console' },
];

const contextNavItems = [
  { label: 'Entity Selector', icon: 'corporate_fare' },
  { label: 'Fiscal 2024', icon: 'calendar_today' },
  { label: 'Monthly Review', icon: 'event_note', active: true },
  { label: 'Audit Trail', icon: 'history_edu' },
  { label: 'Export Settings', icon: 'ios_share' },
];

export default function Layout() {
  return (
    <>
      {/* Spine Navigation (52px) */}
      <nav className="fixed left-0 top-0 h-full w-[52px] bg-[#10141a] flex flex-col items-center py-6 gap-8 overflow-y-auto z-50 border-r border-outline-variant/10">
        <div className="text-[#62df7d] font-black text-2xl">F</div>
        <div className="flex flex-col gap-6">
          {spineNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `p-2 rounded transition-all ${
                  isActive
                    ? 'text-[#62df7d] bg-[#1c2026] scale-110'
                    : 'text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50'
                }`
              }
              title={item.label}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-auto">
          <button className="text-[#dfe2eb]/40 hover:text-[#62df7d] hover:bg-[#1c2026]/50 transition-all p-2 rounded">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </nav>

      {/* Context Sidebar (240px) */}
      <aside className="fixed left-[52px] top-0 h-full w-[240px] bg-[#10141a] flex flex-col px-6 py-8 gap-6 z-40 border-r border-outline-variant/10">
        <div>
          <h2 className="text-[#dfe2eb] font-bold text-lg tracking-tight">Context</h2>
          <p className="text-[#dfe2eb]/40 text-[10px] uppercase tracking-widest font-bold">Operational Focus</p>
        </div>
        <div className="flex flex-col gap-2">
          {contextNavItems.map((item) => (
            <button
              key={item.label}
              className={`text-sm flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                item.active
                  ? 'text-[#62df7d] font-semibold bg-[#1c2026]'
                  : 'text-[#dfe2eb]/60 hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[292px] min-h-screen relative flex flex-col">
        {/* Top Nav Bar */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#10141a]/80 backdrop-blur-xl sticky top-0 z-30 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96 border border-outline-variant/5">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/50"
              placeholder="Search transactions, accounts, or entities..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-mono text-primary/80 uppercase tracking-tighter">AI Agent Active</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="hover:bg-[#1c2026] rounded-full p-2 transition-all relative">
                <span className="material-symbols-outlined text-[#dfe2eb]/70">notifications</span>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
              </button>
              <button className="hover:bg-[#1c2026] rounded-full p-2 transition-all">
                <span className="material-symbols-outlined text-[#dfe2eb]/70">sensors</span>
              </button>
              <button className="hover:bg-[#1c2026] rounded-full p-2 transition-all">
                <span className="material-symbols-outlined text-[#dfe2eb]/70">contrast</span>
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
              <img
                alt="User"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJoc3dbfORt1gHTuqacgTtIuR_jGfL0qjuEgjahQLRW-LhWX0wAgjPbHI4cc5alDnjJoJUamni2oBtTOI9PKKuo_DGdIkXoE3EH-BuMtXH-a2vvZWgRFwhFxymUqFx_mbykv-uiI1oEBknS2oQrIsmg2GkN6IQgfEamYKptRk9YPGXOItsir-yp_q-AywsDlkENzYxpATqY1PAJAfRS8WzlhSDX_ILDqQ4zDeCb49FDuILCCQpnil7NmUzgKjk4Btvaj32M2E1ipav"
              />
            </div>
          </div>
        </header>

        {/* Sticky Alert Banner */}
        <div className="sticky top-16 z-20 px-8 py-2.5 bg-amber-900/40 border-y border-amber-500/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-sm">warning</span>
            <span className="text-xs font-semibold text-amber-200">Cash runway &lt; 30 days — Actions required</span>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-amber-400 hover:text-amber-200 transition-colors">
            Resolve Now
          </button>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </>
  );
}
