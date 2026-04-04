# orchestrator/main.py — FinancePilot Primary Orchestrator
# FastAPI entry point with REST API + WebSocket for real-time agent activity

import os
import json
import asyncio
from uuid import uuid4
from datetime import datetime
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException, UploadFile, File, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from contextlib import asynccontextmanager

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.models import (
    InvoiceSubmission, Invoice, InvoiceStatus, AgentTask, AgentResult,
    FinancialPlan, WSEvent, Forecast, TaxRecord, Alert, LedgerEntry,
    ReportHistory,
)
from shared.supabase_client import get_supabase
from shared.auth import verify_firebase_token
from shared.logging_utils import get_logger

from orchestrator.decomposer import decompose_financial_task
from orchestrator.router import dispatch_all
from orchestrator.synthesizer import synthesize_financial_response
from orchestrator.redis_client import collect_agent_results, session_manager

logger = get_logger("orchestrator")

# ── WebSocket Connection Manager ─────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            self.active_connections[channel].remove(websocket)

    async def broadcast(self, channel: str, event: WSEvent):
        if channel in self.active_connections:
            data = event.model_dump_json()
            dead = []
            for ws in self.active_connections[channel]:
                try:
                    await ws.send_text(data)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.active_connections[channel].remove(ws)

ws_manager = ConnectionManager()


# ── App Lifespan ──────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("FinancePilot Orchestrator starting up")
    yield
    logger.info("FinancePilot Orchestrator shutting down")


# ── FastAPI App ───────────────────────────────────────────────────
app = FastAPI(
    title="FinancePilot Orchestrator",
    description="Multi-Agent SME Financial Co-Pilot API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

claude_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
supabase = get_supabase()


# ── Core Orchestration ────────────────────────────────────────────
async def process_financial_request(
    message: str,
    company_id: str,
    session_id: str,
) -> dict:
    """Core orchestration: decompose → dispatch → collect → synthesize"""

    # 1. Get company context from Supabase
    company_ctx = {}
    try:
        resp = supabase.table("companies").select("*").eq("id", company_id).execute()
        if resp.data:
            company_ctx = resp.data[0]
    except Exception:
        pass

    # 2. Decompose financial task with Claude
    plan = await decompose_financial_task(
        claude_client, message, company_id, session_id, company_ctx
    )

    # Store plan in Redis
    session_manager.store_plan(session_id, plan.model_dump())

    # 3. Broadcast to WebSocket
    await ws_manager.broadcast(
        f"finance:{session_id}",
        WSEvent(event="task.planning", data={
            "session_id": session_id,
            "intent": plan.intent,
            "agents": [t.agent_name for t in plan.subtasks],
        }),
    )

    # 4. Dispatch all subtasks in parallel via Pub/Sub
    await dispatch_all(plan.subtasks)

    # 5. Broadcast agent dispatches
    for task in plan.subtasks:
        await ws_manager.broadcast(
            f"finance:{session_id}",
            WSEvent(event=f"{task.agent_name}.dispatched", data={
                "task_id": task.task_id,
                "agent": task.agent_name,
                "action": task.action,
            }),
        )

    # 6. Collect results (Redis-based, timeout=45s for finance ops)
    expected_agents = [t.agent_name for t in plan.subtasks]
    results = await collect_agent_results(session_id, expected_agents)

    # 7. Broadcast completion
    await ws_manager.broadcast(
        f"finance:{session_id}",
        WSEvent(event="task.completed", data={
            "session_id": session_id,
            "agents_completed": list(results.keys()),
        }),
    )

    # 8. Synthesize financial summary with Claude
    synthesis = await synthesize_financial_response(
        claude_client, message, results, company_ctx
    )

    return {
        "session_id": session_id,
        "intent": plan.intent,
        "agents_engaged": expected_agents,
        "results": results,
        "synthesis": synthesis,
    }


# ══════════════════════════════════════════════════════════════════
# REST API ENDPOINTS
# ══════════════════════════════════════════════════════════════════

# ── Health Check ──────────────────────────────────────────────────
@app.get("/v1/health")
async def health_check():
    return {"status": "healthy", "service": "financepilot-orchestrator", "timestamp": datetime.utcnow().isoformat()}


# ── Invoices ──────────────────────────────────────────────────────
@app.post("/v1/invoices", status_code=202)
async def submit_invoice(
    submission: InvoiceSubmission,
    background_tasks: BackgroundTasks,
    user: dict = Depends(verify_firebase_token),
):
    """Submit invoice for async multi-agent processing."""
    session_id = f"sess_{uuid4().hex[:12]}"
    invoice_id = f"inv_{uuid4().hex[:12]}"

    # Create initial invoice record
    invoice_data = {
        "id": invoice_id,
        "company_id": submission.company_id,
        "status": "processing",
        "pdf_url": submission.file_url,
        "created_at": datetime.utcnow().isoformat(),
    }
    try:
        supabase.table("invoices").insert(invoice_data).execute()
    except Exception as e:
        logger.error(f"Failed to create invoice record: {e}")

    # Trigger async processing
    background_tasks.add_task(
        process_financial_request,
        f"Process invoice {invoice_id} from {submission.source}. File: {submission.file_url}. Notes: {submission.notes}",
        submission.company_id,
        session_id,
    )

    return {
        "invoice_id": invoice_id,
        "session_id": session_id,
        "status": "processing",
        "agents_engaged": [
            "invoice_parser_agent",
            "reconciliation_agent",
            "tax_compliance_agent",
            "forecast_agent",
        ],
        "estimated_seconds": 12,
        "websocket_channel": f"finance:{session_id}",
    }


@app.get("/v1/invoices")
async def list_invoices(
    company_id: str = Query(...),
    status: Optional[str] = None,
    limit: int = 50,
    user: dict = Depends(verify_firebase_token),
):
    """List all invoices with status and reconciliation state."""
    query = supabase.table("invoices").select("*").eq("company_id", company_id).order("created_at", desc=True).limit(limit)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return {"invoices": result.data, "count": len(result.data)}


@app.get("/v1/invoices/{invoice_id}")
async def get_invoice(
    invoice_id: str,
    user: dict = Depends(verify_firebase_token),
):
    """Get full invoice detail with agent processing log."""
    result = supabase.table("invoices").select("*").eq("id", invoice_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Get audit logs for this invoice
    safe_invoice_id = invoice_id.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    logs = supabase.table("agent_audit_log").select("*").like("input_summary", f"%{safe_invoice_id}%").execute()

    return {"invoice": result.data[0], "agent_log": logs.data}


# ── Reconciliation ────────────────────────────────────────────────
@app.post("/v1/reconcile")
async def trigger_reconciliation(
    company_id: str,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    user: dict = Depends(verify_firebase_token),
):
    """Manually trigger reconciliation for a date range."""
    session_id = f"sess_{uuid4().hex[:12]}"
    background_tasks.add_task(
        process_financial_request,
        f"Run batch reconciliation for all unreconciled invoices from {date_from} to {date_to}",
        company_id,
        session_id,
    )
    return {"session_id": session_id, "status": "processing"}


# ── Ledger ────────────────────────────────────────────────────────
@app.get("/v1/ledger")
async def get_ledger(
    company_id: str = Query(...),
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    account_code: Optional[str] = None,
    limit: int = 100,
    user: dict = Depends(verify_firebase_token),
):
    """Get ledger entries with filtering."""
    query = supabase.table("ledger_entries").select("*").eq("company_id", company_id).order("date", desc=True).limit(limit)
    if date_from:
        query = query.gte("date", date_from)
    if date_to:
        query = query.lte("date", date_to)
    if account_code:
        query = query.eq("account_code", account_code)
    result = query.execute()
    return {"entries": result.data, "count": len(result.data)}


# ── Forecast ──────────────────────────────────────────────────────
@app.get("/v1/forecast")
async def get_forecast(
    company_id: str = Query(...),
    user: dict = Depends(verify_firebase_token),
):
    """Get latest cash flow forecast (all 3 scenarios)."""
    # Check cache first
    cached = session_manager.get_cached_forecast(company_id)
    if cached:
        return {"forecast": cached, "source": "cache"}

    result = supabase.table("forecasts").select("*").eq("company_id", company_id).order("generated_at", desc=True).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="No forecast available")
    return {"forecast": result.data[0], "source": "database"}


# ── Tax ───────────────────────────────────────────────────────────
@app.get("/v1/tax/summary")
async def get_tax_summary(
    company_id: str = Query(...),
    user: dict = Depends(verify_firebase_token),
):
    """Get current period tax liability and filing deadlines."""
    result = supabase.table("tax_records").select("*").eq("company_id", company_id).order("period_end", desc=True).limit(10).execute()
    return {"tax_records": result.data, "count": len(result.data)}


# ── Reports ───────────────────────────────────────────────────────
@app.post("/v1/reports/generate")
async def generate_report(
    company_id: str,
    report_type: str = "monthly",
    background_tasks: BackgroundTasks = None,
    user: dict = Depends(verify_firebase_token),
):
    """Trigger on-demand report generation and email delivery."""
    session_id = f"sess_{uuid4().hex[:12]}"
    background_tasks.add_task(
        process_financial_request,
        f"Generate {report_type} financial report and email to stakeholders",
        company_id,
        session_id,
    )
    return {"session_id": session_id, "report_type": report_type, "status": "generating"}


# ── Alerts ────────────────────────────────────────────────────────
@app.get("/v1/alerts")
async def get_alerts(
    company_id: str = Query(...),
    severity: Optional[str] = None,
    resolved: bool = False,
    user: dict = Depends(verify_firebase_token),
):
    """List active alerts with severity and resolution status."""
    query = supabase.table("alerts").select("*").eq("company_id", company_id).order("created_at", desc=True)
    if severity:
        query = query.eq("severity", severity)
    if not resolved:
        query = query.is_("resolved_at", "null")
    result = query.execute()
    return {"alerts": result.data, "count": len(result.data)}


# ── Agent Status ──────────────────────────────────────────────────
@app.get("/v1/agents/status")
async def get_agent_status(user: dict = Depends(verify_firebase_token)):
    """Health status and last activity of all 6 sub-agents."""
    agents = [
        "invoice_parser_agent", "reconciliation_agent", "tax_compliance_agent",
        "forecast_agent", "report_agent", "alert_agent",
    ]

    # Fetch logs for the specified agents in a single query
    # Ordered descending by created_at so the first one we see is the latest
    logs = supabase.table("agent_audit_log").select("agent_name,action,created_at,duration_ms").in_("agent_name", agents).order("created_at", desc=True).execute()

    # Process logs in memory to find the latest for each agent
    latest_logs_by_agent = {}
    if logs.data:
        for log in logs.data:
            agent_name = log.get("agent_name")
            if agent_name and agent_name not in latest_logs_by_agent:
                latest_logs_by_agent[agent_name] = log

    status = []
    for agent in agents:
        latest_log = latest_logs_by_agent.get(agent)
        status.append({
            "agent": agent,
            "status": "active" if latest_log else "idle",
            "last_activity": latest_log,
        })
    return {"agents": status}


# ── Gmail Webhook ─────────────────────────────────────────────────
@app.post("/v1/webhooks/gmail")
async def gmail_webhook(
    payload: dict,
    background_tasks: BackgroundTasks,
):
    """Gmail push notification endpoint — triggers invoice detection."""
    session_id = f"sess_{uuid4().hex[:12]}"
    company_id = payload.get("company_id", "default")

    background_tasks.add_task(
        process_financial_request,
        f"New email detected via Gmail push notification. Check for invoices. Payload: {json.dumps(payload)}",
        company_id,
        session_id,
    )
    return {"status": "accepted", "session_id": session_id}


# ── WebSocket ─────────────────────────────────────────────────────
@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    """Real-time agent activity feed via WebSocket."""
    await ws_manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or handle client messages
            await websocket.send_text(json.dumps({"echo": data}))
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel)


# ── Run ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
