import React, { useState } from 'react';
import DashboardView from './stitch/DashboardView';
import InvoicesView from './stitch/InvoicesView';
import ReconciliationView from './stitch/ReconciliationView';
import TaxComplianceView from './stitch/TaxComplianceView';
import ForecastView from './stitch/ForecastView';
import ReportsView from './stitch/ReportsView';
import AgentConsoleView from './stitch/AgentConsoleView';
import HelpView from './stitch/HelpView';
import CommandConsole from '@/components/CommandConsole';
import './index.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showCommandConsole, setShowCommandConsole] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView setActiveView={setActiveView} />;
      case 'invoices':
        return <InvoicesView setActiveView={setActiveView} />;
      case 'reconciliation':
        return <ReconciliationView setActiveView={setActiveView} />;
      case 'tax_compliance':
        return <TaxComplianceView setActiveView={setActiveView} />;
      case 'forecast':
        return <ForecastView setActiveView={setActiveView} />;
      case 'reports':
        return <ReportsView setActiveView={setActiveView} />;
      case 'help':
        return <HelpView setActiveView={setActiveView} />;
      case 'agent_console':
        return <AgentConsoleView setActiveView={setActiveView} />;
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  };

  const handleRunAIScan = () => {
    setIsScanning(true);
    setShowCommandConsole(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 100);
  };

  return (
    <>
      <div className="dark bg-background text-on-background min-h-screen relative">
        {renderView()}

        {/* Global Action Buttons */}
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
           {showCommandConsole && (
             <div className="absolute bottom-[100%] mb-4 right-0 w-[600px] h-[550px] bg-[#1c2026] border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in flex">
                <div className="flex justify-between items-center px-6 py-4 bg-[#10141a] border-b border-outline-variant/10">
                   <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">terminal</span>
                      <h3 className="font-bold text-on-surface">Agent Command Console</h3>
                   </div>
                   <button 
                      onClick={() => setShowCommandConsole(false)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                   >
                     <span className="material-symbols-outlined">close</span>
                   </button>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                  <CommandConsole initialCommand={isScanning ? "Run full analysis across all ledgers" : ""} />
                </div>
             </div>
           )}

           <div className="flex gap-4 self-end">
             <button 
               onClick={handleRunAIScan}
               className="h-14 px-6 rounded-full bg-primary hover:brightness-110 shadow-xl flex items-center justify-center text-on-primary font-bold tracking-widest uppercase text-xs transition-all ring-4 ring-primary/20"
               title="Run AI Scan"
             >
               <span className="material-symbols-outlined mr-2">magic_button</span>
               Run AI Scan
             </button>
             <button 
               onClick={() => setShowCommandConsole(!showCommandConsole)}
               className="w-14 h-14 rounded-full bg-[#1c2026] hover:bg-[#2d3137] border border-outline-variant/20 shadow-xl flex items-center justify-center text-primary transition-all group"
               title="Open Command Console"
             >
               <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                 {showCommandConsole ? 'close' : 'terminal'}
               </span>
             </button>
           </div>
        </div>
      </div>
    </>
  );
}
