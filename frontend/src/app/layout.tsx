import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinancePilot — AI Financial Co-Pilot for SMEs',
  description: 'Multi-agent AI system automating invoice processing, bank reconciliation, tax compliance, forecasting, and reporting for Southeast Asian SMEs.',
  keywords: ['finance', 'AI', 'automation', 'invoice', 'reconciliation', 'tax', 'SME', 'Southeast Asia'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
