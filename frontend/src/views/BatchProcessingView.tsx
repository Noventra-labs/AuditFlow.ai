
export default function BatchProcessingView() {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-on-surface">Batch Processing</h2>
          <p className="text-xs text-on-surface-variant font-label tracking-tight mt-1">Manage and monitor high-volume invoice ingestion.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-surface-container text-on-surface-variant px-4 py-2 text-sm font-medium rounded flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter
          </button>
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 text-sm font-bold rounded flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-xl">upload_file</span>
            New Batch
          </button>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl overflow-hidden flex flex-col p-6 text-center text-on-surface-variant py-20">
        <p>Batch Processing view integrated.</p>
      </div>
    </div>
  );
}
