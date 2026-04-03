import pytest
from fastapi.testclient import TestClient
from orchestrator.main import app
import sys

# Mock supabase to avoid import errors
from unittest import mock
sys.modules['supabase'] = mock.MagicMock()

client = TestClient(app)

def test_protected_routes_require_auth():
    # Test a sample of the protected routes
    routes = [
        ("/v1/invoices", {"company_id": "test_company"}),
        ("/v1/ledger", {"company_id": "test_company"}),
        ("/v1/forecast", {"company_id": "test_company"}),
        ("/v1/tax/summary", {"company_id": "test_company"}),
        ("/v1/alerts", {"company_id": "test_company"}),
        ("/v1/agents/status", {})
    ]

    for route, params in routes:
        response = client.get(route, params=params)
        assert response.status_code == 401, f"Route {route} should require authentication, got {response.status_code}"
