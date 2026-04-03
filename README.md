# FinancePilot — AI Financial Co-Pilot for SE Asian SMEs

> Multi-agent AI system automating invoice processing, bank reconciliation, tax compliance, cash flow forecasting, and financial reporting.

![Architecture](https://img.shields.io/badge/Architecture-Multi_Agent-blueviolet)
![Cloud](https://img.shields.io/badge/Cloud-Google_Cloud-4285F4)
![Database](https://img.shields.io/badge/Database-Supabase-3FCF8E)
![AI](https://img.shields.io/badge/AI-Claude_3.5-D97706)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Dashboard                     │
│        (Real-time WebSocket · Recharts · Firebase Auth)     │
├─────────────────────────────────────────────────────────────┤
│                   FastAPI Orchestrator                       │
│         (Task Decomposition · Routing · Synthesis)          │
├──────────┬──────────┬──────────┬──────────┬────────┬────────┤
│ Invoice  │  Recon   │   Tax    │ Forecast │ Report │ Alert  │
│ Parser   │  Agent   │ Comply   │  Agent   │ Agent  │ Agent  │
├──────────┴──────────┴──────────┴──────────┴────────┴────────┤
│              Google Cloud Pub/Sub (Event Bus)               │
├─────────────────────────────────────────────────────────────┤
│   Supabase (PostgreSQL + RLS)  │  Redis (Memorystore)      │
├─────────────────────────────────────────────────────────────┤
│   Gmail MCP  │  Calendar MCP  │  Supabase MCP  │  Web MCP  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
FinancePilot/
├── orchestrator/          # FastAPI orchestrator service
│   ├── main.py            # API endpoints + WebSocket
│   ├── decomposer.py      # Claude-powered task decomposition
│   ├── router.py          # Pub/Sub agent routing
│   └── synthesizer.py     # Multi-agent result synthesis
├── agents/
│   ├── base_agent.py      # Base class (Claude, Pub/Sub, Redis, audit)
│   ├── invoice_parser/    # Gmail MCP → Claude vision → Supabase
│   ├── reconciliation/    # Fuzzy matching engine
│   ├── tax_compliance/    # SE Asian jurisdictions (SG, ID, TH, PH, MY, VN)
│   ├── forecast/          # 3-scenario cash flow projections
│   ├── report/            # P&L generation + email delivery
│   └── alert/             # Threshold monitoring + notifications
├── shared/                # Models, clients, auth, logging
├── frontend/              # Next.js 14 dashboard
│   └── src/components/    # MetricCards, CashFlowChart, AgentActivity, etc.
├── supabase/migrations/   # Schema (11 tables) + seed data
├── infra/                 # Terraform (Cloud Run, Pub/Sub, Redis, IAM)
└── cloudbuild.yaml        # CI/CD pipeline (7 parallel builds)
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+, Node.js 18+
- Google Cloud SDK, Terraform
- Supabase project, Gemini API key

### Backend
```bash
# Install dependencies
cd orchestrator && pip install -r requirements.txt

# Set environment variables
export GCP_PROJECT_ID=your-project
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_KEY=eyJ...
export GEMINI_API_KEY=AIza...
export REDIS_HOST=localhost

# Run orchestrator
uvicorn orchestrator.main:app --reload --port 8080
```

### Frontend
```bash
cd frontend && npm install && npm run dev
```

### Database
```bash
# Apply migrations via Supabase SQL Editor
# 1. Run supabase/migrations/001_core_schema.sql
# 2. Run supabase/migrations/002_seed_demo.sql
```

### Deploy
```bash
cd infra && terraform init && terraform apply -var-file=variables.tfvars
gcloud builds submit --config=cloudbuild.yaml
```

## 🤖 Agents

| Agent | Topic | MCP Tools | Function |
|-------|-------|-----------|----------|
| Invoice Parser | `finance.invoice` | Gmail | Extract invoices from email attachments |
| Reconciliation | `finance.reconcile` | Supabase | Fuzzy-match invoices ↔ bank transactions |
| Tax Compliance | `finance.tax` | Calendar, Web | Multi-jurisdiction tax calculations |
| Forecast | `finance.forecast` | — | 3-scenario cash flow projections |
| Report | `finance.report` | Gmail | P&L reports + email delivery |
| Alert | `finance.alert` | Gmail, Calendar | Threshold monitoring + notifications |

## 🔒 Security

- **Firebase JWT** authentication on all API endpoints
- **Supabase RLS** policies isolating company data
- **Secret Manager** for all credentials at runtime
- **Immutable audit log** for every agent action
- **Service account** with least-privilege IAM

## 📊 Key Features

- **Natural language financial queries** — "What's our burn rate vs last month?"
- **Real-time agent activity** via WebSocket feed
- **3-scenario forecasting** (conservative / base / optimistic)
- **SE Asian tax compliance** — GST, VAT, WHT for SG, ID, TH, PH, MY, VN
- **Auto-reconciliation** with configurable confidence thresholds
- **Board-ready reports** emailed on schedule

## License

MIT
