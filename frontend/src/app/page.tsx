'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCards from '@/components/MetricCards';
import CashFlowChart from '@/components/CashFlowChart';
import InvoiceTable from '@/components/InvoiceTable';
import AgentActivity from '@/components/AgentActivity';
import AlertsPanel from '@/components/AlertsPanel';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="dashboard-layout">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2>Financial Command Center</h2>
            <p className="subtitle">TechPulse Pte Ltd · Real-time AI insights</p>
          </div>
          <button className="btn btn-primary">
            <span>⚡</span> Run Full Analysis
          </button>
        </div>

        <MetricCards />

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Cash Flow Projection (90 Days)</span>
              <span className="card-badge badge-blue">Base Scenario</span>
            </div>
            <CashFlowChart />
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Agent Activity</span>
              <span className="card-badge badge-green">Live</span>
            </div>
            <AgentActivity />
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Invoices</span>
              <span className="card-badge badge-purple">{5} items</span>
            </div>
            <InvoiceTable />
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Active Alerts</span>
              <span className="card-badge badge-red">3 critical</span>
            </div>
            <AlertsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
