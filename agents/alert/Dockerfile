FROM python:3.12-slim
WORKDIR /app
COPY shared/ ./shared/
COPY agents/base_agent.py ./agents/
COPY agents/alert/ ./agents/alert/
COPY agents/tax_compliance/calendar_mcp.py ./agents/tax_compliance/
COPY agents/invoice_parser/gmail_mcp.py ./agents/invoice_parser/
COPY orchestrator/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONUNBUFFERED=1
CMD ["python", "-m", "agents.alert.main"]
