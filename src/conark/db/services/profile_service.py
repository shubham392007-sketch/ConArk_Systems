"""
Profile database service for ConArk Systems.
"""
from typing import Optional, Dict, Any
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("profile_service")

class ProfileService:
    @staticmethod
    def get_profile(user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a user profile by authenticated user ID."""
        with get_db_cursor() as cur:
            cur.execute(
                "SELECT id, email, full_name, avatar_url, organization, role, created_at, updated_at "
                "FROM public.profiles WHERE id = %s",
                (user_id,)
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def update_profile(user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates user profile information."""
        full_name = data.get("full_name")
        organization = data.get("organization")
        role = data.get("role")
        avatar_url = data.get("avatar_url")

        with get_db_cursor() as cur:
            cur.execute(
                """
                UPDATE public.profiles
                SET full_name = COALESCE(%s, full_name),
                    organization = COALESCE(%s, organization),
                    role = COALESCE(%s, role),
                    avatar_url = COALESCE(%s, avatar_url),
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, email, full_name, avatar_url, organization, role, created_at, updated_at
                """,
                (full_name, organization, role, avatar_url, user_id)
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_account(user_id: str) -> bool:
        """Cascading deletion of all user data and profile."""
        with get_db_cursor() as cur:
            cur.execute("DELETE FROM public.profiles WHERE id = %s", (user_id,))
            return cur.rowcount > 0
