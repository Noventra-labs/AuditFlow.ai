import sys
import os
import unittest
import asyncio
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from shared.models import AgentTask

class TestVendorSanitization(unittest.TestCase):

    def test_vendor_sanitization(self):
        # First import the module we want to patch
        import agents.invoice_parser.main

        # Now apply patches directly
        with patch('agents.invoice_parser.main.BaseFinanceAgent.__init__', return_value=None), \
             patch('agents.invoice_parser.main.GmailMCPClient', return_value=MagicMock()), \
             patch('agents.invoice_parser.main.extract_invoice_from_text') as mock_extract:

            from agents.invoice_parser.main import InvoiceParserAgent

            agent = InvoiceParserAgent()
            agent.supabase = MagicMock()
            agent.logger = MagicMock()
            agent.claude = MagicMock()

            # Setup mock to return data
            mock_resp = MagicMock()
            mock_resp.data = [{"id": "123", "name": "Test Vendor"}]

            # Setup the chain of mocks for Supabase client
            mock_table = MagicMock()
            mock_select = MagicMock()
            mock_eq = MagicMock()
            mock_ilike = MagicMock()

            agent.supabase.table.return_value = mock_table
            mock_table.select.return_value = mock_select
            mock_select.eq.return_value = mock_eq
            mock_eq.ilike.return_value = mock_ilike
            mock_ilike.execute.return_value = mock_resp

            # Create a task
            task = AgentTask(
                task_id="test_task",
                session_id="test_session",
                company_id="comp_123",
                agent_name="invoice_parser_agent",
                action="process",
                payload={
                    "source": "upload",
                    "text_content": "Invoice details"
                }
            )

            # Need to mock extract_invoice_from_text to avoid hitting Claude
            mock_extract.return_value = ({"vendor_name": "Test % Vendor_1\\2"}, 10)

            result = asyncio.run(agent.process_task(task))

            # Verify ilike was called with sanitized string
            mock_eq.ilike.assert_called_once_with("name", "%Test \\% Vendor\\_1\\\\2%")

if __name__ == '__main__':
    unittest.main()
