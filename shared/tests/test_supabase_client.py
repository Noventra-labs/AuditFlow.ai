import os
import sys
from unittest.mock import patch, MagicMock

# 1. Manually mock 'supabase' before anything else happens.
# This is necessary because 'supabase' is not installed in the environment.
mock_supabase_lib = MagicMock()
sys.modules["supabase"] = mock_supabase_lib

import pytest
# Now we can safely import from shared.supabase_client
from shared.supabase_client import get_supabase_client, get_supabase

@pytest.fixture(autouse=True)
def setup_teardown():
    # Clear the lru_cache before each test
    get_supabase_client.cache_clear()
    # Reset the mock to ensure a clean state for each test
    # Note: we need to patch 'create_client' specifically if we want to assert on it easily
    # but since it's already imported in shared.supabase_client, we patch it there.
    yield

def test_get_supabase_client_missing_url():
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(ValueError) as excinfo:
            get_supabase_client()
        assert "SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be set" in str(excinfo.value)

def test_get_supabase_client_missing_key():
    with patch.dict(os.environ, {"SUPABASE_URL": "https://example.supabase.co"}, clear=True):
        with pytest.raises(ValueError) as excinfo:
            get_supabase_client()
        assert "SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be set" in str(excinfo.value)

def test_get_supabase_client_with_service_key():
    mock_env = {
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_KEY": "service-key"
    }
    with patch.dict(os.environ, mock_env, clear=True):
        with patch("shared.supabase_client.create_client") as mock_create_client:
            mock_client = MagicMock()
            mock_create_client.return_value = mock_client

            client = get_supabase_client()

            mock_create_client.assert_called_once_with("https://example.supabase.co", "service-key")
            assert client == mock_client

def test_get_supabase_client_with_anon_key():
    mock_env = {
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_ANON_KEY": "anon-key"
    }
    with patch.dict(os.environ, mock_env, clear=True):
        with patch("shared.supabase_client.create_client") as mock_create_client:
            mock_client = MagicMock()
            mock_create_client.return_value = mock_client

            client = get_supabase_client()

            mock_create_client.assert_called_once_with("https://example.supabase.co", "anon-key")
            assert client == mock_client

def test_get_supabase_alias():
    mock_env = {
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_KEY": "service-key"
    }
    with patch.dict(os.environ, mock_env, clear=True):
        with patch("shared.supabase_client.create_client") as mock_create_client:
            mock_client = MagicMock()
            mock_create_client.return_value = mock_client

            client = get_supabase()

            assert client == mock_client
            mock_create_client.assert_called_once()

def test_get_supabase_client_caching():
    mock_env = {
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_KEY": "service-key"
    }
    with patch.dict(os.environ, mock_env, clear=True):
        with patch("shared.supabase_client.create_client") as mock_create_client:
            mock_create_client.return_value = MagicMock()

            client1 = get_supabase_client()
            client2 = get_supabase_client()

            assert client1 == client2
            assert mock_create_client.call_count == 1
