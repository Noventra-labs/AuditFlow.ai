-- FinancePilot Demo Seed Data
-- For development/testing purposes

-- Demo company
INSERT INTO companies (id, name, registration_number, country, currency, industry, stakeholder_emails)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'TechPulse Pte Ltd',
    '202400001K',
    'SG',
    'SGD',
    'Technology',
    ARRAY['cfo@techpulse.sg', 'founder@techpulse.sg']
) ON CONFLICT (id) DO NOTHING;

-- Demo vendors
INSERT INTO vendors (id, company_id, name, tax_id, email, country, currency, payment_terms, category) VALUES
    ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'AWS Singapore', 'SG-AWS-001', 'billing@aws.amazon.com', 'SG', 'USD', 30, 'Cloud Infrastructure'),
    ('aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'WeWork Southeast Asia', 'SG-WW-002', 'invoices@wework.com', 'SG', 'SGD', 15, 'Office Space'),
    ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Grab for Business', 'SG-GFB-003', 'corp-billing@grab.com', 'SG', 'SGD', 30, 'Transportation'),
    ('aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'PT Tokopedia', 'ID-TP-004', 'vendor@tokopedia.com', 'ID', 'IDR', 45, 'E-commerce'),
    ('aaaa0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Figma Inc', 'US-FIG-005', 'billing@figma.com', 'US', 'USD', 30, 'Design Tools')
ON CONFLICT (id) DO NOTHING;

-- Demo invoices (mix of statuses)
INSERT INTO invoices (id, company_id, vendor_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total, currency, status, confidence_score) VALUES
    ('bbbb0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaa0001-0000-0000-0000-000000000001', 'AWS-2024-0891', '2024-11-01', '2024-12-01', 4250.00, 340.00, 4590.00, 'USD', 'reconciled', 0.97),
    ('bbbb0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'aaaa0002-0000-0000-0000-000000000002', 'WW-SG-44821', '2024-11-15', '2024-11-30', 3200.00, 288.00, 3488.00, 'SGD', 'reconciled', 0.95),
    ('bbbb0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'aaaa0003-0000-0000-0000-000000000003', 'GFB-2024-1102', '2024-12-01', '2024-12-31', 890.50, 71.24, 961.74, 'SGD', 'parsed', 0.89),
    ('bbbb0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'aaaa0004-0000-0000-0000-000000000004', 'TP-INV-78234', '2024-12-05', '2025-01-19', 15600000.00, 1716000.00, 17316000.00, 'IDR', 'manual_review', 0.72),
    ('bbbb0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'aaaa0005-0000-0000-0000-000000000005', 'FIG-ENT-2024-12', '2024-12-10', '2025-01-10', 540.00, 0.00, 540.00, 'USD', 'validated', 0.99)
ON CONFLICT (id) DO NOTHING;

-- Demo bank transactions
INSERT INTO bank_transactions (id, company_id, bank_account, date, description, amount, currency, balance, category) VALUES
    ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-11-28', 'AWS Monthly Cloud Services', -4590.00, 'USD', 125000.00, 'Cloud Infrastructure'),
    ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-11-29', 'WeWork Office Rental Nov', -3488.00, 'SGD', 121512.00, 'Office Space'),
    ('cccc0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-12-01', 'Client Payment - Shopee SG', 28500.00, 'SGD', 150012.00, 'Revenue'),
    ('cccc0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-12-05', 'Staff Salaries Dec', -42000.00, 'SGD', 108012.00, 'Payroll'),
    ('cccc0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-12-10', 'Client Payment - Lazada MY', 18200.00, 'SGD', 126212.00, 'Revenue'),
    ('cccc0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-12-15', 'Google Workspace Annual', -1440.00, 'SGD', 124772.00, 'Software'),
    ('cccc0007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'DBS-SGD-001', '2024-12-20', 'Client Payment - GovTech SG', 65000.00, 'SGD', 189772.00, 'Revenue')
ON CONFLICT (id) DO NOTHING;
