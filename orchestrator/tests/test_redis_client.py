import pytest
import asyncio
from unittest.mock import patch, MagicMock

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

# Mock supabase to avoid import errors
import sys
from unittest.mock import MagicMock
sys.modules['supabase'] = MagicMock()

from orchestrator.redis_client import collect_agent_results

@pytest.fixture
def mock_session_manager():
    with patch("orchestrator.redis_client.session_manager") as mock:
        yield mock

@pytest.fixture
def mock_sleep():
    with patch("asyncio.sleep", new_callable=MagicMock) as mock:
        async def async_sleep(*args, **kwargs):
            mock(*args, **kwargs)
        with patch("asyncio.sleep", side_effect=async_sleep) as mock_async_sleep:
            yield mock_async_sleep

@pytest.fixture
def mock_time():
    with patch("time.time") as mock:
        # Default behavior: time progresses slightly on each call
        # but tests can override this.
        mock.side_effect = [100.0, 100.1, 100.2, 100.3, 100.4, 100.5, 100.6]
        yield mock


@pytest.mark.asyncio
async def test_collect_agent_results_immediate_completion(mock_session_manager, mock_sleep, mock_time):
    session_id = "test_session_1"
    expected_agents = ["agent_a", "agent_b"]

    # Setup mock to return all expected results immediately
    mock_session_manager.get_all_results.return_value = {
        "agent_a": {"status": "success"},
        "agent_b": {"status": "success"}
    }

    # Call the function
    results = await collect_agent_results(session_id, expected_agents)

    # Verify the results
    assert len(results) == 2
    assert "agent_a" in results
    assert "agent_b" in results

    # Verify get_all_results was called correctly
    mock_session_manager.get_all_results.assert_called_once_with(session_id, expected_agents)

    # Verify sleep was not called since we returned immediately
    mock_sleep.assert_not_called()


@pytest.mark.asyncio
async def test_collect_agent_results_delayed_completion(mock_session_manager, mock_sleep, mock_time):
    session_id = "test_session_2"
    expected_agents = ["agent_a", "agent_b"]

    # Setup mock to return partial results then full results
    mock_session_manager.get_all_results.side_effect = [
        {"agent_a": {"status": "success"}},
        {"agent_a": {"status": "success"}},
        {
            "agent_a": {"status": "success"},
            "agent_b": {"status": "success"}
        }
    ]

    # Call the function
    results = await collect_agent_results(session_id, expected_agents, poll_interval=0.5)

    # Verify the results
    assert len(results) == 2
    assert "agent_a" in results
    assert "agent_b" in results

    # Verify get_all_results was called 3 times
    assert mock_session_manager.get_all_results.call_count == 3

    # Verify sleep was called 2 times with poll_interval
    assert mock_sleep.call_count == 2
    mock_sleep.assert_called_with(0.5)


@pytest.mark.asyncio
async def test_collect_agent_results_timeout(mock_session_manager, mock_sleep, mock_time):
    session_id = "test_session_3"
    expected_agents = ["agent_a", "agent_b"]

    # Setup mock time to simulate timeout (start at 100, then jump past timeout)
    # The while loop checks time.time() - start < timeout
    mock_time.side_effect = [
        100.0, # start time
        100.1, # first loop check
        100.2, # second loop check
        146.0  # third loop check (146 - 100 = 46 > 45 timeout)
    ]

    # Setup mock to always return partial results
    mock_session_manager.get_all_results.return_value = {
        "agent_a": {"status": "success"}
    }

    # Call the function
    results = await collect_agent_results(session_id, expected_agents, timeout=45)

    # Verify the results are partial
    assert len(results) == 1
    assert "agent_a" in results
    assert "agent_b" not in results

    # Verify get_all_results was called inside the loop and once at the end
    # loop checks: 100.1, 100.2 -> 2 times inside loop
    # then timeout happens at 146.0 -> 1 time at the end
    assert mock_session_manager.get_all_results.call_count == 3

    # Verify sleep was called 2 times inside the loop
    assert mock_sleep.call_count == 2
