import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import DashboardView from './views/DashboardView';
import InvoicesView from './views/InvoicesView';
import VendorsView from './views/VendorsView';
import BatchProcessingView from './views/BatchProcessingView';
import ReportsView from './views/ReportsView';
import ReportsLibraryView from './views/ReportsLibraryView';
import DraftReportsView from './views/DraftReportsView';
import ArchiveReportsView from './views/ArchiveReportsView';
import ScheduledReportsView from './views/ScheduledReportsView';
import ReportGeneratorView from './views/ReportGeneratorView';
import DocumentViewerView from './views/DocumentViewerView';
import ForecastView from './views/ForecastView';
import TaxComplianceView from './views/TaxComplianceView';
import ReconciliationView from './views/ReconciliationView';
import AgentConsoleView from './views/AgentConsoleView';
import HelpView from './views/HelpView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardView />} />
          <Route path="invoices">
            <Route index element={<InvoicesView />} />
            <Route path="vendors" element={<VendorsView />} />
            <Route path="batches" element={<BatchProcessingView />} />
          </Route>
          <Route path="reports">
            <Route index element={<ReportsView />} />
            <Route path="library" element={<ReportsLibraryView />} />
            <Route path="drafts" element={<DraftReportsView />} />
            <Route path="archive" element={<ArchiveReportsView />} />
            <Route path="scheduled" element={<ScheduledReportsView />} />
            <Route path="generate" element={<ReportGeneratorView />} />
            <Route path="view" element={<DocumentViewerView />} />
          </Route>
            <Route path="forecast" element={<ForecastView />} />
          <Route path="tax-compliance" element={<TaxComplianceView />} />
          <Route path="reconciliation" element={<ReconciliationView />} />
          <Route path="agent-console" element={<AgentConsoleView />} />
          <Route path="help" element={<HelpView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
