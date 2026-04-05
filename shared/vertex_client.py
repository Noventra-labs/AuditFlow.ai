# shared/vertex_client.py — Vertex AI client factory
# Uses Google Cloud Application Default Credentials (ADC) instead of API key.
# For local dev: gcloud auth application-default login
# For Cloud Run: automatically uses the service account attached to the service.

import os

from google import genai
from google.auth import default as google_auth_default
from google.auth.exceptions import DefaultCredentialsError

from shared.logging_utils import get_logger

logger = get_logger("vertex_client")

# Cache the client so we don't re-authenticate on every import
_client = None


def get_vertex_client() -> genai.Client:
    """
    Return a Vertex AI-backed Gemini client using Application Default Credentials.

    Endpoint format:
      {location}-aiplatform.googleapis.com/projects/{project}/locations/{location}/publishers/google/models/{model}

    Env vars:
      VERTEX_PROJECT_ID  — GCP project ID (falls back to GCP_PROJECT_ID)
      VERTEX_LOCATION     — region, e.g. "us-central1" (default: us-central1)
      VERTEX_MODEL       — model name, e.g. "gemini-2.5-pro" (default: gemini-2.5-pro)
    """
    global _client
    if _client is not None:
        return _client

    project_id = os.environ.get("VERTEX_PROJECT_ID") or os.environ.get("GCP_PROJECT_ID")
    location = os.environ.get("VERTEX_LOCATION", "us-central1")
    model = os.environ.get("VERTEX_MODEL", "gemini-2.5-pro")

    if not project_id:
        raise DefaultCredentialsError(
            "VERTEX_PROJECT_ID (or GCP_PROJECT_ID) env var is required for Vertex AI. "
            "Run: gcloud auth application-default login"
        )

    # ADC handles local dev (gcloud auth) and Cloud Run (attached service account)
    credentials, project = google_auth_default()

    endpoint = f"https://{location}-aiplatform.googleapis.com/v1/projects/{project_id}/locations/{location}/publishers/google/models/{model}:generateContent"

    _client = genai.Client(
        credentials=credentials,
        vertexai=True,
        project=project_id,
        location=location,
    )

    logger.info(f"Vertex AI client initialised: project={project_id}, location={location}, model={model}, endpoint={endpoint}")
    return _client
