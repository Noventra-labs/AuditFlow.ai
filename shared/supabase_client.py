# shared/supabase_client.py — Shared Supabase SDK client
import os
from supabase import create_client, Client
from functools import lru_cache


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """Get or create a singleton Supabase client."""
    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_ANON_KEY", ""))
    if not url or not key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) "
            "must be set as environment variables."
        )
    return create_client(url, key)


def get_supabase() -> Client:
    """Convenience alias."""
    return get_supabase_client()
