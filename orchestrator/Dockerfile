FROM python:3.12-slim

WORKDIR /app

# Install shared dependencies first for caching
COPY shared/ ./shared/
COPY orchestrator/requirements.txt ./orchestrator/
RUN pip install --no-cache-dir -r orchestrator/requirements.txt

# Copy orchestrator code
COPY orchestrator/ ./orchestrator/

ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

CMD ["python", "-m", "orchestrator.main"]
