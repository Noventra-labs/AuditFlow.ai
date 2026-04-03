FROM python:3.12-slim
WORKDIR /app
COPY shared/ ./shared/
COPY agents/base_agent.py ./agents/
COPY agents/report/ ./agents/report/
COPY agents/invoice_parser/gmail_mcp.py ./agents/invoice_parser/
COPY orchestrator/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONUNBUFFERED=1
CMD ["python", "-m", "agents.report.main"]
