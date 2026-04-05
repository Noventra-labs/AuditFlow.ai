import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, downloadBlob, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';

const REPORT_TYPES = [
  { id: 'monthly', label: 'P&L Statement', desc: 'Standard income statement with revenue, COGS, gross profit, operating expenses, and net profit', icon: 'account_balance_wallet' },
  { id: 'quarterly', label: 'Quarterly Board Pack', desc: 'Executive summary, key metrics, cash flow chart, vendor analysis, and 90-day forecast', icon: 'group_work' },
  { id: 'tax', label: 'GST Return Summary', desc: 'Quarterly tax register formatted for accountant review with all input and output tax transactions', icon: 'receipt_long' },
  { id: 'investor', label: 'Investor Update', desc: 'Runway gauge, revenue growth, burn rate, and AI-written quarterly narrative', icon: 'trending_up' },
  { id: 'annual', label: 'Annual Accounts', desc: 'Full-year P&L, balance sheet approximation, and cash flow statement', icon: 'bar_chart' },
];

export default function ReportsView() {
  const { addToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<{ session_id: string; status: string } | null>(null);
  const [selectedReportType, setSelectedReportType] = useState('monthly');
  const [wizardStep, setWizardStep] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState('board@company.com');
  const [currency, setCurrency] = useState('SGD');
  const [showWizard, setShowWizard] = useState(false);

  async function handleGenerateReport() {
    try {
      setGenerating(true);
      setWizardStep(3);
      addToast({ variant: 'info', title: 'Generating Report', message: 'Report Agent is querying financial data...' });
      const result = await api.generateReport(selectedReportType);
      addToast({ variant: 'success', title: 'Report Generated', message: `Session: ${result.session_id} — ready to preview`, statusCode: 200 });
      setGenerationResult(result);
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
      addToast({ variant: 'error', title: 'Generation Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
      setWizardStep(0);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Generator */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <section className="bg-surface-container p-6 rounded-xl border-l-2 border-gold/30">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-instrument text-3xl italic">Reports</h1>
          </div>

          {/* Quick Access */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { to: '/reports/generate', icon: 'auto_awesome', label: 'Wizard' },
              { to: '/reports/library', icon: 'inventory_2', label: 'Library' },
              { to: '/reports/drafts', icon: 'edit_document', label: 'Drafts' },
              { to: '/reports/scheduled', icon: 'schedule', label: 'Scheduled' },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to} className="bg-surface-container-high text-on-surface hover:text-primary py-2.5 px-3 text-xs flex items-center justify-center gap-2 transition-colors rounded-lg">
                <span className="material-symbols-outlined text-sm">{icon}</span> {label}
              </Link>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={() => { setShowWizard(true); setWizardStep(1); setGenerationResult(null); }}
            className="w-full bg-primary text-on-primary-container font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span> Generate Now
          </button>

          {/* Report Type Selection */}
          <div className="mt-6">
            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 block mb-3">Document Type</label>
            <div className="space-y-2">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReportType(type.id)}
                  className={`w-full flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border transition-colors text-left ${
                    selectedReportType === type.id ? 'border-primary/20' : 'border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-gold">{type.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{type.label}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-1">{type.desc}</p>
                  </div>
                  {selectedReportType === type.id && (
                    <span className="ml-auto material-symbols-outlined text-primary text-sm">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="bg-surface-container p-6 rounded-xl">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { title: 'FY24 Profit & Loss', id: 'FP-2024-0082', date: 'Oct 24, 2024', status: 'published' },
              { title: 'Q3 Board Pack', id: 'FP-2024-0079', date: 'Oct 20, 2024', status: 'published' },
            ].map((r) => (
              <div key={r.id} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold">{r.title}</p>
                    <p className="text-[9px] font-mono text-on-surface-variant mt-0.5">{r.id}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    r.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'
                  }`}>{r.status}</span>
                </div>
                <p className="text-[9px] font-mono text-on-surface-variant/60 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Center/Right Column: Preview */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-surface-container-low rounded-xl p-8 min-h-full flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full"></div>

          {showWizard ? (
            /* ── Report Generation Wizard ── */
            <div className="relative z-10">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
                {['Type', 'Configure', 'Generate'].map((label, i) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                      wizardStep > i + 1 ? 'border-primary bg-primary text-on-primary-container' :
                      wizardStep === i + 1 ? `border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]` :
                      'border-surface-container-high text-on-surface-variant'
                    }`}>
                      {wizardStep > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${wizardStep === i + 1 ? 'text-[#D4AF37]' : 'text-on-surface-variant'}`}>{label}</span>
                  </div>
                ))}
              </div>

              {wizardStep === 1 && (
                <div className="max-w-md mx-auto space-y-6">
                  <h2 className="font-instrument text-3xl italic">Select Report Type</h2>
                  <div className="space-y-3">
                    {REPORT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedReportType(type.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left ${
                          selectedReportType === type.id
                            ? 'border-primary/30 bg-primary-container/20 ring-1 ring-primary/20'
                            : 'border-outline-variant/10 bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl text-gold shrink-0">{type.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{type.label}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{type.desc}</p>
                        </div>
                        {selectedReportType === type.id && (
                          <span className="material-symbols-outlined text-primary">check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowWizard(false)} className="flex-1 py-3 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container-high transition-colors">Cancel</button>
                    <button onClick={() => setWizardStep(2)} className="flex-1 py-3 rounded-lg bg-primary text-on-primary-container font-bold text-sm hover:opacity-90 transition-all">Next — Configure</button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="max-w-md mx-auto space-y-6">
                  <h2 className="font-instrument text-3xl italic">Configure Report</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Recipient Email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/30"
                        placeholder="board@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none"
                      >
                        <option>SGD</option><option>USD</option><option>EUR</option><option>IDR</option><option>MYR</option><option>THB</option><option>PHP</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sections to Include</label>
                      <div className="space-y-2">
                        {['Executive Summary', 'Revenue Breakdown', 'Expense Analysis', 'Cash Flow', 'Tax Summary', 'AR/AP Aging'].map((sec) => (
                          <label key={sec} className="flex items-center gap-3 text-sm cursor-pointer">
                            <input type="checkbox" className="accent-primary" defaultChecked />
                            <span className="text-on-surface">{sec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-3 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container-high transition-colors">Back</button>
                    <button onClick={handleGenerateReport} disabled={generating} className="flex-1 py-3 rounded-lg bg-primary text-on-primary-container font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                      {generating ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="max-w-md mx-auto space-y-6 text-center py-8">
                  {generating ? (
                    <>
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <h2 className="font-instrument text-3xl italic">Generating...</h2>
                      <div className="space-y-2 text-sm text-on-surface-variant">
                        <p>Report Agent is querying your financial data…</p>
                        <p>Writing executive summary…</p>
                        <p>Formatting tables…</p>
                      </div>
                    </>
                  ) : generationResult ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                      <h2 className="font-instrument text-3xl italic">Report Ready</h2>
                      <p className="text-sm text-on-surface-variant">Session: {generationResult.session_id}</p>
                      <div className="flex gap-3 justify-center pt-4">
                        <button onClick={() => setShowWizard(false)} className="px-6 py-3 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container-high transition-colors">Close</button>
                        <button
                          onClick={async () => {
                            try {
                              addToast({ variant: 'info', title: 'Sending', message: 'Dispatching report...' });
                              await api.emailReport(generationResult.session_id, [recipientEmail]);
                              addToast({ variant: 'success', title: 'Report Sent', message: `Sent to ${recipientEmail}`, statusCode: 200 });
                            } catch (err) {
                              addToast({ variant: 'error', title: 'Send Failed', message: err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message });
                            }
                          }}
                          className="px-6 py-3 rounded-lg bg-primary text-on-primary-container font-bold text-sm hover:opacity-90 transition-all"
                        >
                          Send to {recipientEmail}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            /* ── Default Preview ── */
            <>
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-surface-container-highest p-3 rounded-lg text-gold">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">FY24_Profit_Loss_v2.pdf</h2>
                    <p className="text-xs text-on-surface-variant font-mono uppercase tracking-tighter">Rendered 2 minutes ago • Confidential</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        addToast({ variant: 'info', title: 'Downloading', message: 'Preparing PDF...' });
                        const blob = await api.downloadPDF('FP-2024-0082');
                        downloadBlob(blob, 'FY24_Profit_Loss_v2.pdf');
                        addToast({ variant: 'success', title: 'Download Complete', message: 'PDF downloaded successfully', statusCode: 200 });
                      } catch (err) {
                        const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                        addToast({ variant: 'error', title: 'Download Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest hover:bg-surface-bright rounded-lg text-xs font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">download</span> Download PDF
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        addToast({ variant: 'info', title: 'Sending Email', message: 'Dispatching report...' });
                        await api.emailReport('FP-2024-0082', [recipientEmail]);
                        addToast({ variant: 'success', title: 'Email Sent', message: `Report sent to ${recipientEmail}`, statusCode: 200 });
                      } catch (err) {
                        const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                        addToast({ variant: 'error', title: 'Email Failed', message: msg, statusCode: err instanceof ApiError ? err.statusCode : undefined });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest hover:bg-surface-bright rounded-lg text-xs font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span> Email Report
                  </button>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="flex-1 bg-white shadow-lg rounded-sm mx-auto w-full max-w-[800px] overflow-hidden text-slate-900 flex flex-col">
                <div className="p-12 border-b-[8px] border-slate-900">
                  <div className="flex justify-between items-start mb-16">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter mb-1">AUDITFLOW</h3>
                      <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Sovereign Financial Analytics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-900">REPORT ID: FP-2024-0082</p>
                      <p className="text-[10px] text-slate-500">FISCAL PERIOD: Q3 2024</p>
                    </div>
                  </div>
                  <h4 className="text-6xl font-instrument italic mb-2">Profit &amp; Loss</h4>
                  <p className="text-slate-500 font-medium tracking-wide">Consolidated Statement of Operations for Global Entities</p>
                </div>

                <div className="p-12 space-y-10 flex-1">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Revenue Overview</p>
                      <p className="text-sm leading-relaxed text-slate-700 italic border-l-2 border-slate-200 pl-4">
                        Market conditions remained favorable throughout the reporting period. Core software licensing revenue saw a marked increase of 14.2% YoY.
                      </p>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="flex justify-between border-b border-slate-100 py-2">
                        <span className="text-xs font-bold text-slate-800">Total Net Sales</span>
                        <span className="text-xs font-mono font-bold">$12,482,000.00</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-2">
                        <span className="text-xs font-bold text-slate-800">Direct Costs</span>
                        <span className="text-xs font-mono font-bold">($4,291,550.00)</span>
                      </div>
                      <div className="flex justify-between py-2 mt-2 bg-slate-50 px-2 rounded">
                        <span className="text-xs font-black text-slate-900 uppercase">Gross Profit</span>
                        <span className="text-xs font-mono font-black">$8,190,450.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-20 flex justify-between items-end text-[10px] text-slate-400">
                  <p>© 2024 Sovereign Asset Group. For Authorized Eyes Only.</p>
                  <p className="font-mono">PAGE 1 OF 24</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
