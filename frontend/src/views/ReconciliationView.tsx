import { useState, useEffect, useRef } from 'react';
import { api, ApiError } from '../lib/api';
import { useToast } from '../context/ToastContext';
import type { LedgerEntry, BankTransaction } from '../types';

const VARIANCE_REASONS = [
  'Exact match',
  'Partial payment',
  'Currency conversion variance',
  'Different settlement date',
  'Other',
];

const MATCH_CONFIDENCE_COLOR = (c: number) =>
  c >= 90 ? 'text-primary' : c >= 70 ? 'text-amber-400' : c >= 50 ? 'text-orange-400' : 'text-error';

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; life: number }[] = [];
    const colors = ['#62df7d', '#D4AF37', '#f59e0b', '#06b6d4', '#ec4899'];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
    let frame = 0;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.015;
        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 6, 6);
        }
      });
      frame++;
      if (frame < 120) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[300] pointer-events-none" />;
}

export default function ReconciliationView() {
  const { addToast } = useToast();
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [dragInvoice, setDragInvoice] = useState<LedgerEntry | null>(null);
  const [matchMode, setMatchMode] = useState<string | null>(null);
  const [draggedOverTx, setDraggedOverTx] = useState<string | null>(null);
  const [showVariance, setShowVariance] = useState(false);
  const [selectedPair, setSelectedPair] = useState<{ invoice: LedgerEntry; tx: BankTransaction } | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ invoiceId: string; txId: string; confidence: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [varianceReason, setVarianceReason] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.getLedger();
        setLedgerEntries(res.entries || []);
        // Mock bank transactions
        setBankTransactions(
          (res.entries || [])
            .filter((e: LedgerEntry) => e.type === 'credit')
            .map((e: LedgerEntry, i: number) => ({
              id: `tx-${i}`,
              date: e.date,
              description: e.description,
              credit: e.amount,
              amount: e.amount,
              currency: 'SGD',
              matched_invoice_id: undefined,
              match_confidence: 0,
              match_status: 'unmatched' as const,
            }))
        );
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  async function handleAutoReconcile() {
    try {
      setReconciling(true);
      setProgress(0);
      addToast({ variant: 'info', title: 'Reconciliation Started', message: 'Running AI matching engine...' });
      // Simulate progress
      for (let p = 0; p <= 100; p += 10) {
        await new Promise((r) => setTimeout(r, 200));
        setProgress(p);
      }
      const result = await api.triggerReconciliation();
      const matched = result.matched_count || 0;
      const needsReview = result.unmatched_count || 0;
      if (matched > 0 && needsReview === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      addToast({ variant: 'success', title: 'Reconciliation Complete', message: `${matched} auto-matched, ${needsReview} need review`, statusCode: 200 });
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
      addToast({ variant: 'error', title: 'Reconciliation Failed', message: msg });
    } finally {
      setReconciling(false);
      setProgress(0);
    }
  }

  function handleDragStart(e: React.DragEvent, invoice: LedgerEntry) {
    setDragInvoice(invoice);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent, tx: BankTransaction) {
    e.preventDefault();
    // Highlight if amount within 5% tolerance
    if (dragInvoice) {
      const diff = Math.abs(tx.amount - Math.abs(dragInvoice.amount));
      const pct = diff / Math.abs(dragInvoice.amount);
      if (pct <= 0.05) {
        e.dataTransfer.dropEffect = 'move';
        setDraggedOverTx(tx.id);
      } else {
        e.dataTransfer.dropEffect = 'none';
        setDraggedOverTx(null);
      }
    }
  }

  function handleDrop(e: React.DragEvent, tx: BankTransaction) {
    e.preventDefault();
    setDraggedOverTx(null);
    if (dragInvoice) {
      const diff = Math.abs(tx.amount - Math.abs(dragInvoice.amount));
      const variancePct = diff / Math.abs(dragInvoice.amount);
      if (variancePct > 0.01) {
        setSelectedPair({ invoice: dragInvoice, tx });
        setShowVariance(true);
      } else {
        confirmMatch(dragInvoice, tx, 97);
      }
    }
    setDragInvoice(null);
  }

  function handleDragEnd() {
    setDragInvoice(null);
    setDraggedOverTx(null);
  }

  function confirmMatch(invoice: LedgerEntry, tx: BankTransaction, confidence: number) {
    setMatchedPairs((prev) => [...prev, { invoiceId: invoice.id, txId: tx.id, confidence }]);
    setLedgerEntries((prev) => prev.filter((e) => e.id !== invoice.id));
    setBankTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    addToast({ variant: 'success', title: 'Match Confirmed', message: `${invoice.description} matched to ${tx.description}`, statusCode: 200 });
  }

  function handleMatchClick(invoice: LedgerEntry, tx: BankTransaction) {
    const diff = Math.abs(tx.amount - Math.abs(invoice.amount));
    const variancePct = diff / Math.abs(invoice.amount);
    if (variancePct > 0.01) {
      setSelectedPair({ invoice, tx });
      setShowVariance(true);
    } else {
      confirmMatch(invoice, tx, 97);
    }
  }

  function handleVarianceConfirm() {
    if (!selectedPair || !varianceReason) return;
    const { invoice, tx } = selectedPair;
    const confidence = 88;
    confirmMatch(invoice, tx, confidence);
    setShowVariance(false);
    setVarianceReason('');
    setSelectedPair(null);
    addToast({ variant: 'success', title: 'Match Confirmed', message: `Variance explanation recorded: ${varianceReason}`, statusCode: 200 });
  }

  const unmatchedDebits = ledgerEntries.filter((e) => e.type === 'debit');
  const unmatchedCredits = bankTransactions.filter((t) => !t.matched_invoice_id);
  const totalItems = (ledgerEntries.length || 1422);
  const matchedCount = matchedPairs.length;
  const matchRate = totalItems > 0 ? Math.round((matchedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-bold text-3xl tracking-tight text-on-surface">Reconciliation</h1>
          <p className="text-on-surface-variant text-sm mt-1">Match invoices to bank transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                addToast({ variant: 'info', title: 'Exporting', message: 'Preparing reconciliation report...' });
                const blob = await api.exportCSV('ledger');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `reconciliation-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                addToast({ variant: 'success', title: 'Export Complete', message: 'Report downloaded', statusCode: 200 });
              } catch (err) {
                const msg = err instanceof ApiError ? `${err.statusCode}: ${err.detail}` : (err as Error).message;
                addToast({ variant: 'error', title: 'Export Failed', message: msg });
              }
            }}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">ios_share</span> Export Report
          </button>
          <button
            onClick={() => { setShowWizard(true); setWizardStep(1); }}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span> Import Bank Statement
          </button>
          <button
            onClick={handleAutoReconcile}
            disabled={reconciling}
            className="px-5 py-2.5 rounded-md text-sm font-bold text-on-primary-container bg-primary hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50"
          >
            {reconciling ? (
              <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Reconciling... {progress}%</>
            ) : (
              <><span className="material-symbols-outlined text-sm">auto_awesome</span> Auto-Reconcile All</>
            )}
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-5 gap-px bg-outline-variant/10 rounded-xl overflow-hidden border border-outline-variant/10">
        {[
          { label: 'Total Invoices', value: totalItems.toLocaleString() },
          { label: 'Matched', value: matchedCount.toLocaleString(), sub: `${matchRate}%`, color: 'text-primary' },
          { label: 'Unmatched', value: String(unmatchedDebits.length), color: 'text-tertiary' },
          { label: 'Needs Review', value: '0', color: 'text-amber-400' },
          { label: 'Unreconciled Value', value: `$${(matchedPairs.length > 0 ? 0 : 142880).toLocaleString('en-US', { minimumFractionDigits: 0 })}` },
        ].map((m) => (
          <div key={m.label} className="bg-surface-container px-6 py-4">
            <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">{m.label}</p>
            <div className="flex items-end gap-2">
              <p className={`font-instrument text-3xl ${m.color || 'text-on-surface'}`}>{m.value}</p>
              {m.sub && <p className={`${m.color || 'text-primary'}/60 text-xs font-mono mb-1.5`}>{m.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Split Panel */}
      <div className="grid grid-cols-[1fr_40px_1fr] gap-0 rounded-xl overflow-hidden border border-outline-variant/10">
        {/* Unmatched Invoices (left) */}
        <div className="bg-surface-container rounded-l-xl p-6 h-[480px] flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Unmatched Invoices</h3>
            <span className="text-[10px] bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-full font-mono">{unmatchedDebits.length} PENDING</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : unmatchedDebits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">check_circle</span>
                <p className="text-sm text-on-surface-variant">All invoices matched</p>
              </div>
            ) : (
              unmatchedDebits.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, entry)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setMatchMode(matchMode === entry.id ? null : entry.id)}
                  className={`p-4 bg-surface-container-low rounded-lg border transition-all cursor-pointer group ${
                    matchMode === entry.id ? 'border-amber-500/50 ring-1 ring-amber-500/20' :
                    dragInvoice?.id === entry.id ? 'opacity-40 border-primary/30' :
                    'border-transparent hover:border-outline/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-tighter">{entry.id}</p>
                      <p className="text-sm font-semibold text-on-surface mt-0.5">{entry.description || 'Unknown'}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 font-mono">{entry.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-on-surface">${Math.abs(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {matchMode === entry.id ? (
                          <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">Click a transaction to match</span>
                        ) : (
                          <>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">DRAG TO MATCH</span>
                            <span className="material-symbols-outlined text-[12px] text-on-surface-variant/40 group-hover:text-primary transition-colors">drag_indicator</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connector */}
        <div className="bg-surface-container flex flex-col justify-around py-12 relative">
          <div className="flex flex-col items-center gap-3 text-amber-500/30">
            <span className="material-symbols-outlined text-base">link</span>
            <span className="material-symbols-outlined text-base">link</span>
            <span className="material-symbols-outlined text-base">link</span>
          </div>
        </div>

        {/* Bank Transactions (right) */}
        <div className="bg-surface-container rounded-r-xl p-6 h-[480px] flex flex-col border-l border-outline-variant/10">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Bank Transactions</h3>
            <span className="text-[10px] bg-primary-container/20 text-primary px-2 py-0.5 rounded-full font-mono">{unmatchedCredits.length} UNMATCHED</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : unmatchedCredits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-2">account_balance</span>
                <p className="text-sm text-on-surface-variant">All transactions matched</p>
              </div>
            ) : (
              unmatchedCredits.slice(0, 10).map((tx) => {
                const isHighlighted = draggedOverTx === tx.id;
                const confidence = dragInvoice ? Math.min(97, Math.round(100 - (Math.abs(tx.amount - Math.abs(dragInvoice.amount)) / Math.abs(dragInvoice.amount) * 100))) : 0;
                return (
                  <div
                    key={tx.id}
                    onDragOver={(e) => handleDragOver(e, tx)}
                    onDrop={(e) => handleDrop(e, tx)}
                    onClick={() => {
                      if (matchMode) {
                        const inv = unmatchedDebits.find((en) => en.id === matchMode);
                        if (inv) handleMatchClick(inv, tx);
                      }
                    }}
                    className={`p-4 bg-surface-container-low rounded-lg border-r-2 transition-all cursor-pointer ${
                      isHighlighted ? 'border-amber-500 bg-amber-500/5' :
                      draggedOverTx === tx.id ? 'border-amber-500/50' :
                      matchMode ? 'border-amber-500/20 hover:border-amber-500/40' :
                      'border-amber-500/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{tx.description || 'Unknown'}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-mono">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-on-surface">${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        {confidence > 0 && (
                          <span className={`text-[10px] font-mono font-bold ${MATCH_CONFIDENCE_COLOR(confidence)}`}>{confidence}% match</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Variance Confirmation Modal */}
      {showVariance && selectedPair && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => { setShowVariance(false); setVarianceReason(''); }} />
          <div className="relative bg-surface-container border border-outline-variant rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="font-instrument text-xl italic mb-1">Confirm Variance</h3>
            <p className="text-xs text-on-surface-variant mb-6">Amounts differ by more than 1% or SGD 1. Select a variance explanation:</p>
            <div className="space-y-1">
              {VARIANCE_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setVarianceReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm mb-1 ${
                    varianceReason === reason ? 'bg-primary/10 border border-primary/20 text-primary' : 'hover:bg-surface-container-high'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowVariance(false); setVarianceReason(''); }}
                className="flex-1 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVarianceConfirm}
                disabled={!varianceReason}
                className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary-container font-bold text-sm hover:opacity-90 disabled:opacity-50"
              >
                Confirm Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Import Wizard */}
      {showWizard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setShowWizard(false)} />
          <div className="relative bg-surface-container border border-outline-variant rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-instrument text-2xl italic">Import Bank Statement</h3>
              <button onClick={() => setShowWizard(false)} className="p-1 hover:bg-surface-container-high rounded"><span className="material-symbols-outlined">close</span></button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    wizardStep > s ? 'border-primary bg-primary text-on-primary-container' :
                    wizardStep === s ? 'border-amber-500 text-amber-500' :
                    'border-outline text-outline'
                  }`}>
                    {wizardStep > s ? '✓' : s}
                  </div>
                  <span className={`text-xs font-bold ${wizardStep === s ? 'text-amber-500' : 'text-outline'}`}>
                    {s === 1 ? 'Upload' : s === 2 ? 'Map Columns' : 'Preview'}
                  </span>
                  {s < 3 && <div className="w-8 h-px bg-outline-variant mx-1" />}
                </div>
              ))}
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">cloud_upload</span>
                  <p className="text-sm font-semibold text-on-surface">Drop CSV, OFX, or QFX file</p>
                  <p className="text-xs text-on-surface-variant mt-1">Supports DBS, OCBC, UOB, BCA, Mandiri, SCB, BPI, BDO, Maybank</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4">
                  <p className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Accepted Formats</p>
                  <div className="flex gap-2 flex-wrap">
                    {['CSV', 'OFX', 'QFX'].map((f) => <span key={f} className="px-2 py-1 bg-surface text-[10px] font-mono rounded border border-outline-variant">{f}</span>)}
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant">Map your CSV columns to the required fields:</p>
                {['Date', 'Description', 'Debit', 'Credit', 'Balance'].map((field) => (
                  <div key={field} className="flex items-center gap-4">
                    <span className="text-sm font-mono text-on-surface w-24">{field}</span>
                    <select className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm appearance-none">
                      <option>Select column...</option>
                      <option>Column A</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant">Preview (first 10 rows):</p>
                <div className="bg-surface-container-low rounded-lg overflow-hidden">
                  {[
                    { date: '2024-11-01', desc: 'AWS Asia Pacific', debit: '4,280.00', credit: '', balance: '142,820.00' },
                    { date: '2024-11-02', desc: 'Stripe Payout', debit: '', credit: '12,450.00', balance: '155,270.00' },
                  ].map((row, i) => (
                    <div key={i} className="flex gap-4 px-4 py-2 border-b border-outline-variant/5 last:border-0">
                      <span className="font-mono text-xs w-24 text-on-surface-variant">{row.date}</span>
                      <span className="font-mono text-xs flex-1 text-on-surface">{row.desc}</span>
                      <span className="font-mono text-xs text-error w-20 text-right">{row.debit}</span>
                      <span className="font-mono text-xs text-primary w-20 text-right">{row.credit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {wizardStep > 1 && (
                <button onClick={() => setWizardStep((s) => s - 1)} className="flex-1 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container-high transition-colors">
                  Back
                </button>
              )}
              {wizardStep < 3 ? (
                <button onClick={() => setWizardStep((s) => s + 1)} className="flex-1 py-2.5 rounded-lg bg-amber-500 text-on-primary-container font-bold text-sm hover:opacity-90">
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowWizard(false);
                    addToast({ variant: 'success', title: 'Import Complete', message: 'Bank transactions imported successfully', statusCode: 200 });
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary-container font-bold text-sm hover:opacity-90"
                >
                  Confirm Import
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation History */}
      <details
        className="group bg-surface-container rounded-xl border border-outline-variant/5"
        open={showHistory}
        onToggle={(e) => setShowHistory((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">history</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Reconciled History</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant">{matchedPairs.length} pairs reconciled</span>
            <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
          </div>
        </summary>
        <div className="px-6 pb-4 border-t border-outline-variant/10">
          {matchedPairs.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-4">No reconciled pairs yet.</p>
          ) : (
            matchedPairs.map((pair) => (
              <div key={pair.invoiceId} className="py-4 flex items-center justify-between border-b border-outline-variant/10 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{pair.invoiceId}</p>
                    <p className="text-xs text-on-surface-variant">Matched to {pair.txId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`font-mono text-sm ${MATCH_CONFIDENCE_COLOR(pair.confidence)}`}>{pair.confidence}%</span>
                  <button
                    onClick={() => {
                      setMatchedPairs((prev) => prev.filter((p) => p.invoiceId !== pair.invoiceId));
                      addToast({ variant: 'info', title: 'Match Undone', message: 'The match has been reversed' });
                    }}
                    className="text-xs text-error font-semibold hover:underline"
                  >
                    Undo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </details>
    </div>
  );
}
