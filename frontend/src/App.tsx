import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import InvoicesView from './views/InvoicesView';
import ReconciliationView from './views/ReconciliationView';
import TaxComplianceView from './views/TaxComplianceView';
import ForecastView from './views/ForecastView';
import ReportsView from './views/ReportsView';
import AgentConsoleView from './views/AgentConsoleView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardView />} />
          <Route path="forecast" element={<ForecastView />} />
          <Route path="invoices" element={<InvoicesView />} />
          <Route path="tax-compliance" element={<TaxComplianceView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="reconciliation" element={<ReconciliationView />} />
          <Route path="agent-console" element={<AgentConsoleView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
