-- FinancePilot Core Schema Migration
-- Version: 001
-- Description: Creates all 10 core financial tables with RLS

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    registration_number TEXT,
    country TEXT NOT NULL DEFAULT 'SG',
    currency TEXT NOT NULL DEFAULT 'SGD',
    industry TEXT,
    fiscal_year_end TEXT DEFAULT '12-31',
    stakeholder_emails TEXT[] DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. USERS → COMPANIES mapping
-- ============================================================
CREATE TABLE IF NOT EXISTS user_companies (
    user_id TEXT NOT NULL, -- Firebase UID
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, company_id)
);

-- ============================================================
-- 3. VENDORS
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tax_id TEXT,
    email TEXT,
    country TEXT,
    currency TEXT DEFAULT 'SGD',
    payment_terms INT DEFAULT 30,
    category TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vendors_company ON vendors(company_id);
CREATE INDEX idx_vendors_name_trgm ON vendors USING gin(name gin_trgm_ops);

-- ============================================================
-- 4. INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id),
    invoice_number TEXT,
    invoice_date DATE,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'SGD',
    status TEXT NOT NULL DEFAULT 'parsed' CHECK (status IN ('parsed', 'validated', 'reconciled', 'manual_review', 'rejected')),
    confidence_score DECIMAL(3,2) DEFAULT 0,
    source TEXT DEFAULT 'email',
    raw_text TEXT,
    line_items JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- ============================================================
-- 5. BANK TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_account TEXT,
    date DATE NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'SGD',
    balance DECIMAL(15,2),
    category TEXT,
    reference TEXT,
    matched_invoice_id UUID REFERENCES invoices(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_txn_company ON bank_transactions(company_id);
CREATE INDEX idx_txn_date ON bank_transactions(date);
CREATE INDEX idx_txn_amount ON bank_transactions(amount);

-- ============================================================
-- 6. RECONCILIATION MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    transaction_id UUID NOT NULL REFERENCES bank_transactions(id),
    match_score DECIMAL(3,2) NOT NULL,
    match_method TEXT DEFAULT 'fuzzy',
    auto_matched BOOLEAN DEFAULT false,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recon_company ON reconciliation_matches(company_id);

-- ============================================================
-- 7. TAX RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS tax_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    jurisdiction TEXT NOT NULL,
    tax_type TEXT NOT NULL,
    period_start DATE,
    period_end DATE,
    filing_deadline DATE,
    taxable_amount DECIMAL(15,2) DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    output_tax DECIMAL(15,2) DEFAULT 0,
    input_tax DECIMAL(15,2) DEFAULT 0,
    net_payable DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'filed', 'overdue')),
    calendar_event_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tax_company ON tax_records(company_id);
CREATE INDEX idx_tax_deadline ON tax_records(filing_deadline);

-- ============================================================
-- 8. FORECASTS
-- ============================================================
CREATE TABLE IF NOT EXISTS forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ DEFAULT now(),
    horizon_days INT DEFAULT 90,
    conservative_runway INT,
    base_runway INT,
    optimistic_runway INT,
    ar_aging_json JSONB DEFAULT '{}',
    ap_schedule_json JSONB DEFAULT '[]',
    assumptions_json JSONB DEFAULT '{}'
);

CREATE INDEX idx_forecast_company ON forecasts(company_id);

-- ============================================================
-- 9. ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    related_invoice_id UUID REFERENCES invoices(id),
    calendar_event_id TEXT,
    email_sent_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_company ON alerts(company_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- ============================================================
-- 10. AGENT AUDIT LOG (immutable)
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    session_id UUID,
    agent_name TEXT NOT NULL,
    action TEXT NOT NULL,
    input_summary TEXT,
    output_summary TEXT,
    tokens_used INT DEFAULT 0,
    duration_ms INT DEFAULT 0,
    status TEXT DEFAULT 'success',
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_company ON agent_audit_log(company_id);
CREATE INDEX idx_audit_agent ON agent_audit_log(agent_name);
CREATE INDEX idx_audit_timestamp ON agent_audit_log(timestamp);

-- ============================================================
-- 11. REPORT HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS report_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    period TEXT,
    recipient_emails TEXT[] DEFAULT '{}',
    subject TEXT,
    sent_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only see data for their companies
CREATE POLICY "Users can view own company" ON companies
    FOR ALL USING (
        id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own vendors" ON vendors
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own invoices" ON invoices
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own transactions" ON bank_transactions
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own recon" ON reconciliation_matches
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own tax" ON tax_records
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own forecasts" ON forecasts
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own alerts" ON alerts
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own audit" ON agent_audit_log
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

CREATE POLICY "Users can view own reports" ON report_history
    FOR ALL USING (
        company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()::text)
    );

-- Service role bypass for agents (using service_role key)
CREATE POLICY "Service role full access" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON bank_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON reconciliation_matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON tax_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON forecasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON agent_audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON report_history FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_companies BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_vendors BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_invoices BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
