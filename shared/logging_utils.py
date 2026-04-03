# shared/logging_utils.py — Cloud Logging structured logger for FinancePilot
import logging
import json
import sys
import os
from datetime import datetime
from typing import Optional, Dict, Any


class StructuredFormatter(logging.Formatter):
    """
    Formats log records as JSON for Google Cloud Logging ingestion.
    Maps Python log levels to Cloud Logging severity levels.
    """

    SEVERITY_MAP = {
        logging.DEBUG: "DEBUG",
        logging.INFO: "INFO",
        logging.WARNING: "WARNING",
        logging.ERROR: "ERROR",
        logging.CRITICAL: "CRITICAL",
    }

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "severity": self.SEVERITY_MAP.get(record.levelno, "DEFAULT"),
            "message": record.getMessage(),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "logging.googleapis.com/sourceLocation": {
                "file": record.pathname,
                "line": record.lineno,
                "function": record.funcName,
            },
        }

        # Attach extra fields (agent_name, session_id, company_id, etc.)
        for key in ("agent_name", "session_id", "company_id", "task_id", "duration_ms", "tokens_used"):
            val = getattr(record, key, None)
            if val is not None:
                log_entry[key] = val

        # Attach exception info
        if record.exc_info and record.exc_info[1]:
            log_entry["error"] = {
                "type": type(record.exc_info[1]).__name__,
                "message": str(record.exc_info[1]),
            }

        return json.dumps(log_entry, default=str)


def get_logger(name: str, level: str = "INFO") -> logging.Logger:
    """Create a structured JSON logger for the given service/agent name."""
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredFormatter())
        logger.addHandler(handler)

    return logger


def log_agent_action(
    logger: logging.Logger,
    agent_name: str,
    action: str,
    session_id: str,
    company_id: str,
    duration_ms: Optional[int] = None,
    tokens_used: Optional[int] = None,
    extra: Optional[Dict[str, Any]] = None,
):
    """Convenience function to log an agent action with standard fields."""
    logger.info(
        f"{agent_name}: {action}",
        extra={
            "agent_name": agent_name,
            "session_id": session_id,
            "company_id": company_id,
            "duration_ms": duration_ms,
            "tokens_used": tokens_used,
            **(extra or {}),
        },
    )
