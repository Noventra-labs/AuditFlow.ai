import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinancePilot — AI Financial Co-Pilot for SMEs',
  description: 'Multi-agent AI system automating invoice processing, bank reconciliation, tax compliance, forecasting, and reporting for Southeast Asian SMEs.',
  keywords: ['finance', 'AI', 'automation', 'invoice', 'reconciliation', 'tax', 'SME', 'Southeast Asia'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
