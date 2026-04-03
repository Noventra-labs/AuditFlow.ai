import sys
import unittest
from unittest.mock import MagicMock, patch

# Provide mock dependencies for testing without full environment
sys.modules['supabase'] = MagicMock()

import os
# Set dummy environment variables to pass the supabase client initialization
os.environ['SUPABASE_URL'] = 'https://fake.supabase.co'
os.environ['SUPABASE_SERVICE_KEY'] = 'fake_key'
os.environ['GEMINI_API_KEY'] = 'fake_api_key'

# Mock google auth
import google.auth
google.auth.default = MagicMock(return_value=(MagicMock(), "fake-project"))

from agents.invoice_parser.main import InvoiceParserAgent
from shared.models import AgentTask

class TestInvoiceParserAgent(unittest.IsolatedAsyncioTestCase):
    @patch('agents.invoice_parser.main.extract_invoice_from_text')
    @patch('agents.invoice_parser.main.extract_invoice_from_pdf_url')
    @patch('agents.invoice_parser.main.extract_invoice_from_image')
    @patch('agents.invoice_parser.main.uuid4')
    @patch('agents.base_agent.pubsub_v1')
    async def test_vendor_name_injection_escaping(self, mock_pubsub, mock_uuid4, mock_img, mock_pdf, mock_text):
        # Setup agent and mock its supabase client
        agent = InvoiceParserAgent()
        agent.supabase = MagicMock()
        agent.claude = MagicMock()

        # Mock the query builder chain
        mock_table = MagicMock()
        mock_select = MagicMock()
        mock_eq = MagicMock()
        mock_ilike = MagicMock()

        agent.supabase.table.return_value = mock_table
        mock_table.select.return_value = mock_select
        mock_select.eq.return_value = mock_eq
        mock_eq.ilike.return_value = mock_ilike

        # Setup response data
        mock_resp = MagicMock()
        mock_resp.data = [{"id": "vendor_123"}]
        mock_ilike.execute.return_value = mock_resp

        # The parser function should return extracted data
        malicious_vendor_name = "Evil%Vendor_Inc\\"
        mock_text.return_value = ({"vendor_name": malicious_vendor_name}, 10)

        task = AgentTask(
            task_id="task_123",
            session_id="session_123",
            agent_name="invoice_parser_agent",
            company_id="company_123",
            action="parse_invoice",
            payload={"source": "upload", "text_content": "fake invoice"}
        )

        # Call the method
        await agent.process_task(task)

        # Assertions
        agent.supabase.table.assert_any_call("vendors")
        mock_eq.ilike.assert_called_once()

        # Get the actual call args for ilike
        call_args = mock_eq.ilike.call_args[0]
        self.assertEqual(call_args[0], "name")

        # Verify the vendor name was properly escaped
        # "Evil%Vendor_Inc\" -> "Evil\%Vendor\_Inc\\"
        expected_escaped_name = "Evil\\%Vendor\\_Inc\\\\"
        self.assertEqual(call_args[1], f"%{expected_escaped_name}%")

if __name__ == "__main__":
    unittest.main()
