# orchestrator/redis_client.py — Session state management for orchestrator
# Re-exports the shared Redis session manager with orchestrator-specific helpers
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.redis_client import RedisSessionManager, get_redis

session_manager = RedisSessionManager()


async def collect_agent_results(
    session_id: str,
    expected_agents: list[str],
    timeout: int = 45,
    poll_interval: float = 0.5,
) -> dict:
    """
    Poll Redis for agent results until all expected agents have reported
    or timeout is reached. Returns dict of {agent_name: result}.
    """
    import asyncio
    import time

    start = time.time()
    while time.time() - start < timeout:
        results = session_manager.get_all_results(session_id, expected_agents)
        if len(results) >= len(expected_agents):
            return results
        await asyncio.sleep(poll_interval)

    # Return whatever we have at timeout
    return session_manager.get_all_results(session_id, expected_agents)
