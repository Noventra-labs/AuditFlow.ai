FROM python:3.12-slim
WORKDIR /app
COPY shared/ ./shared/
COPY agents/base_agent.py ./agents/
COPY agents/tax_compliance/ ./agents/tax_compliance/
COPY orchestrator/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONUNBUFFERED=1
CMD ["python", "-m", "agents.tax_compliance.main"]
