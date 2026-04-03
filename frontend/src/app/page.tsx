'use client';

import { useState } from 'react';
import DashboardView from './stitch/DashboardView';
import InvoicesView from './stitch/InvoicesView';
import ReconciliationView from './stitch/ReconciliationView';
import TaxComplianceView from './stitch/TaxComplianceView';
import ForecastView from './stitch/ForecastView';
import ReportsView from './stitch/ReportsView';
import AgentConsoleView from './stitch/AgentConsoleView';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');

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
      case 'agent_console':
        return <AgentConsoleView setActiveView={setActiveView} />;
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body {
            background-color: #10141a;
            color: #dfe2eb;
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        .font-instrument { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="dark bg-background text-on-background min-h-screen">
        {renderView()}
      </div>
    </>
  );
}
