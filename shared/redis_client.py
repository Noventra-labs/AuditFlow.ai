# shared/redis_client.py — Redis (Memorystore) session & cache management
import os
import json
import redis
from typing import Any, Optional
from functools import lru_cache


@lru_cache(maxsize=1)
def get_redis() -> redis.Redis:
    """Get or create a singleton Redis client."""
    host = os.environ.get("REDIS_HOST", "localhost")
    port = int(os.environ.get("REDIS_PORT", "6379"))
    return redis.Redis(host=host, port=port, decode_responses=True)


class RedisSessionManager:
    """Manages orchestrator sessions and agent results in Redis."""

    def __init__(self):
        self.r = get_redis()

    # ── Session Plan ──────────────────────────────────────────────
    def store_plan(self, session_id: str, plan: dict, ttl: int = 1800):
        key = f"session:{session_id}:finance_plan"
        self.r.setex(key, ttl, json.dumps(plan, default=str))

    def get_plan(self, session_id: str) -> Optional[dict]:
        key = f"session:{session_id}:finance_plan"
        data = self.r.get(key)
        return json.loads(data) if data else None

    # ── Agent Results ─────────────────────────────────────────────
    def store_result(self, session_id: str, agent_name: str, result: dict, ttl: int = 1800):
        key = f"session:{session_id}:result:{agent_name}"
        self.r.setex(key, ttl, json.dumps(result, default=str))

    def get_result(self, session_id: str, agent_name: str) -> Optional[dict]:
        key = f"session:{session_id}:result:{agent_name}"
        data = self.r.get(key)
        return json.loads(data) if data else None

    def get_all_results(self, session_id: str, agents: list[str]) -> dict:
        results = {}
        for agent in agents:
            result = self.get_result(session_id, agent)
            if result:
                results[agent] = result
        return results

    def count_results(self, session_id: str, agents: list[str]) -> int:
        return sum(1 for a in agents if self.get_result(session_id, a) is not None)

    # ── Cache ─────────────────────────────────────────────────────
    def cache_forecast(self, company_id: str, forecast: dict, ttl: int = 3600):
        key = f"cache:forecast:{company_id}"
        self.r.setex(key, ttl, json.dumps(forecast, default=str))

    def get_cached_forecast(self, company_id: str) -> Optional[dict]:
        key = f"cache:forecast:{company_id}"
        data = self.r.get(key)
        return json.loads(data) if data else None

    def cache_exchange_rate(self, from_c: str, to_c: str, rate: float, ttl: int = 900):
        key = f"cache:exchange:{from_c}_{to_c}"
        self.r.setex(key, ttl, str(rate))

    def get_exchange_rate(self, from_c: str, to_c: str) -> Optional[float]:
        key = f"cache:exchange:{from_c}_{to_c}"
        data = self.r.get(key)
        return float(data) if data else None

    def cache_tax_rate(self, jurisdiction: str, category: str, rate: float, ttl: int = 86400):
        key = f"cache:tax_rate:{jurisdiction}:{category}"
        self.r.setex(key, ttl, str(rate))

    def get_tax_rate(self, jurisdiction: str, category: str) -> Optional[float]:
        key = f"cache:tax_rate:{jurisdiction}:{category}"
        data = self.r.get(key)
        return float(data) if data else None

    # ── Rate Limiting ─────────────────────────────────────────────
    def check_rate_limit(self, company_id: str, limit: int = 100) -> bool:
        key = f"rate:company:{company_id}:minute"
        current = self.r.incr(key)
        if current == 1:
            self.r.expire(key, 60)
        return current <= limit
