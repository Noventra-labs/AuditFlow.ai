import pytest
from unittest.mock import MagicMock, patch, AsyncMock
import json
import sys

# 1. Mock `google` safely
if "google" not in sys.modules:
    mock_google = MagicMock()
    mock_genai = MagicMock()
    mock_google.genai = mock_genai
    sys.modules['google'] = mock_google
    sys.modules['google.genai'] = mock_genai
    sys.modules['google.genai.types'] = MagicMock()

# 2. Mock `httpx` safely
if "httpx" not in sys.modules:
    sys.modules['httpx'] = MagicMock()


from agents.invoice_parser.parser import (
    extract_invoice_from_text,
    extract_invoice_from_image,
    extract_invoice_from_pdf_url,
)

@pytest.fixture
def mock_genai_client():
    client = MagicMock()
    return client

def create_mock_response(text, prompt_tokens=10, candidate_tokens=20):
    response = MagicMock()
    response.text = text

    usage_metadata = MagicMock()
    usage_metadata.prompt_token_count = prompt_tokens
    usage_metadata.candidates_token_count = candidate_tokens

    response.usage_metadata = usage_metadata
    return response

@pytest.mark.asyncio
async def test_extract_invoice_from_text_happy_path(mock_genai_client):
    expected_data = {"invoice_number": "INV-123", "total": 100.5}
    response_text = f"Here is the data:\n```json\n{json.dumps(expected_data)}\n```\nHope it helps!"

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    parsed, tokens = await extract_invoice_from_text(mock_genai_client, "Sample text")

    assert parsed == expected_data
    assert tokens == 30
    mock_genai_client.models.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_extract_invoice_from_text_parsing_error(mock_genai_client):
    response_text = "Sorry, I couldn't find any invoice data here. oops"

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    parsed, tokens = await extract_invoice_from_text(mock_genai_client, "Sample text")

    assert "error" in parsed
    assert parsed["error"] == "Failed to parse invoice"
    assert parsed["raw"] == response_text
    assert tokens == 30
    mock_genai_client.models.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_extract_invoice_from_text_no_json_braces(mock_genai_client):
    response_text = "There are no json braces here"

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    parsed, tokens = await extract_invoice_from_text(mock_genai_client, "Sample text")

    assert "error" in parsed
    assert parsed["error"] == "Failed to parse invoice"
    assert parsed["raw"] == response_text
    assert tokens == 30
    mock_genai_client.models.generate_content.assert_called_once()


@pytest.mark.asyncio
async def test_extract_invoice_from_image_happy_path(mock_genai_client):
    expected_data = {"invoice_number": "IMG-123"}
    response_text = json.dumps(expected_data)

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    parsed, tokens = await extract_invoice_from_image(mock_genai_client, b"fake_image_data")

    assert parsed == expected_data
    assert tokens == 30

@pytest.mark.asyncio
async def test_extract_invoice_from_image_parsing_error(mock_genai_client):
    response_text = "Invalid JSON { {"

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    parsed, tokens = await extract_invoice_from_image(mock_genai_client, b"fake_image_data")

    assert "error" in parsed
    assert parsed["error"] == "Failed to parse invoice image"


@pytest.fixture
def mock_httpx_client():
    with patch('httpx.AsyncClient') as mock_client_class:
        mock_instance = AsyncMock()
        mock_client_class.return_value.__aenter__.return_value = mock_instance
        yield mock_instance

@pytest.mark.asyncio
async def test_extract_invoice_from_pdf_url_happy_path(mock_genai_client, mock_httpx_client):
    expected_data = {"invoice_number": "PDF-123"}
    response_text = f"{{{json.dumps(expected_data)[1:-1]}}}" # Ensure it starts with { and ends with }

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    mock_http_resp = MagicMock()
    mock_http_resp.content = b"pdf_data"
    mock_httpx_client.get.return_value = mock_http_resp

    parsed, tokens = await extract_invoice_from_pdf_url(mock_genai_client, "http://example.com/inv.pdf")

    assert parsed == expected_data
    assert tokens == 30

@pytest.mark.asyncio
async def test_extract_invoice_from_pdf_url_parsing_error(mock_genai_client, mock_httpx_client):
    response_text = "Failed pdf parse {"

    mock_response = create_mock_response(response_text)
    mock_genai_client.models.generate_content.return_value = mock_response

    mock_http_resp = MagicMock()
    mock_http_resp.content = b"pdf_data"
    mock_httpx_client.get.return_value = mock_http_resp

    parsed, tokens = await extract_invoice_from_pdf_url(mock_genai_client, "http://example.com/inv.pdf")

    assert "error" in parsed
    assert parsed["error"] == "Failed to parse PDF invoice"
