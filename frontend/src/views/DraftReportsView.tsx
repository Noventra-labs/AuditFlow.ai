import { useState } from 'react';

interface DraftReport {
  id: string;
  title: string;
  type: string;
  lastEdited: string;
  autoSave: string;
  confidence: number;
}

const DRAFTS: DraftReport[] = [
  { id: 'DR-001', title: 'FY24 Q3 Consolidation', type: 'P&L', lastEdited: '2 hours ago', autoSave: '2 min ago', confidence: 94 },
  { id: 'DR-002', title: 'Annual Audit Summary', type: 'Audit Report', lastEdited: 'Yesterday', autoSave: '14 min ago', confidence: 87 },
  { id: 'DR-003', title: 'Cash Flow Projection H2', type: 'Cash Flow', lastEdited: '3 days ago', autoSave: '3 days ago', confidence: 78 },
  { id: 'DR-004', title: 'Board Presentation Draft', type: 'Board Pack', lastEdited: '1 week ago', autoSave: '1 week ago', confidence: 65 },
];

export default function DraftReportsView() {
  const [drafts, setDrafts] = useState(DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState<DraftReport | null>(null);

  function deleteDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (selectedDraft?.id === id) setSelectedDraft(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-on-surface">Report Staging</h1>
          <p className="text-sm text-on-surface-variant mt-1">AI-generated reports pending institutional verification</p>
        </div>
        <button className="bg-primary text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          New Draft
        </button>
      </div>

      {/* Drafts List */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => setSelectedDraft(draft)}
              className={`p-5 rounded-xl cursor-pointer border transition-all ${
                selectedDraft?.id === draft.id
                  ? 'bg-surface-container-high border-primary/30'
                  : 'bg-surface-container border-transparent hover:border-outline/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-surface-container-high rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">edit_document</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    draft.confidence >= 90 ? 'bg-primary/10 text-primary' :
                    draft.confidence >= 70 ? 'bg-amber-500/10 text-amber-500' :
                    'bg-error/10 text-error'
                  }`}>
                    {draft.confidence}% conf
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">{draft.title}</h3>
              <div className="flex items-center gap-3 text-[10px] mono-data text-outline">
                <span>{draft.type}</span>
                <span>·</span>
                <span>Edited {draft.lastEdited}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
                  <div className={`h-full rounded-full ${draft.confidence >= 90 ? 'bg-primary' : draft.confidence >= 70 ? 'bg-amber-500' : 'bg-error'}`}
                    style={{ width: `${draft.confidence}%` }}></div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); }}
                  className="ml-3 p-1 hover:bg-error/10 rounded text-outline hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
          {drafts.length === 0 && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-outline text-4xl mb-4">edit_document</span>
              <p className="text-on-surface-variant">No drafts in staging</p>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="col-span-7 bg-surface-container rounded-xl overflow-hidden border border-outline/5">
          {selectedDraft ? (
            <>
              <div className="p-6 border-b border-outline/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">{selectedDraft.title}</h2>
                  <p className="text-xs mono-data text-outline mt-1">{selectedDraft.id} · Auto-saved {selectedDraft.autoSave}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-semibold text-on-surface transition-colors">
                    Edit
                  </button>
                  <button className="bg-primary text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all">
                    Publish
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-surface-container-low rounded-xl p-8 min-h-[300px]">
                  <div className="text-center text-outline/60 text-sm">
                    <span className="material-symbols-outlined text-5xl mb-4 block">description</span>
                    <p>Report preview would render here</p>
                    <p className="text-xs mt-2">AI synthesis at {selectedDraft.confidence}% confidence</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-outline">
                  <span>Last edited {selectedDraft.lastEdited}</span>
                  <div className="flex gap-4">
                    <button className="hover:text-primary transition-colors">Validate Data</button>
                    <button className="hover:text-primary transition-colors">Re-run AI</button>
                    <button className="hover:text-error transition-colors">Discard</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-12">
              <span className="material-symbols-outlined text-outline text-5xl mb-4">touch_app</span>
              <p className="text-on-surface-variant text-sm">Select a draft to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
