
export default function ScheduledReportsView() {
  return (
    <div className="space-y-8 flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-on-surface">Active Generation Schedules</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage automated reporting pipelines and stakeholder distribution.</p>
        </div>
        <div className="flex space-x-2">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-white transition-colors">grid_view</button>
          <button className="material-symbols-outlined p-2 text-primary">view_list</button>
        </div>
      </div>
      <div className="bg-surface-container rounded-xl overflow-hidden flex flex-col p-6 text-center text-on-surface-variant py-20">
        <p>Scheduled Reports view integrated.</p>
      </div>
    </div>
  );
}
