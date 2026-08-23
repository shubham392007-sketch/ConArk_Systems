"""
Supabase & PostgreSQL client connection manager for ConArk Systems.
"""
from typing import Optional, Any
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor
from supabase import create_client, Client

from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("db_client")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Returns singleton Supabase client instance."""
    global _supabase_client
    if _supabase_client is None:
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        _supabase_client = create_client(settings.SUPABASE_URL, key)
    return _supabase_client


@contextmanager
def get_db_connection():
    """Context manager providing a direct thread-safe PostgreSQL connection."""
    conn = psycopg2.connect(settings.DATABASE_URL)
    conn.autocommit = True
    try:
        yield conn
    finally:
        conn.close()


@contextmanager
def get_db_cursor():
    """Context manager providing a RealDictCursor for structured dictionary records."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
