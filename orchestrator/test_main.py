import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

import sys
import os

# Ensure shared imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock supabase to avoid import errors when testing
import sys
if "shared.supabase_client" not in sys.modules:
    mock_supabase = MagicMock()
    sys.modules["shared.supabase_client"] = MagicMock()
    sys.modules["shared.supabase_client"].get_supabase = MagicMock(return_value=mock_supabase)

# Ensure ALLOWED_ORIGINS is set
os.environ["ALLOWED_ORIGINS"] = "http://testserver,http://localhost:3000"

from orchestrator.main import app

client = TestClient(app)

def test_cors_headers_allowed_origin():
    response = client.options(
        "/v1/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "X-Example"
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_cors_headers_disallowed_origin():
    response = client.options(
        "/v1/health",
        headers={
            "Origin": "http://evil.com",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "X-Example"
        }
    )
    assert response.status_code == 400
