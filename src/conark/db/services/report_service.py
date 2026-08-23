"""
Saved reports database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("report_service")

class ReportService:
    @staticmethod
    def save_report(
        user_id: str,
        report_name: str,
        report_type: str,
        file_path: Optional[str] = None,
        project_id: Optional[str] = None,
        prediction_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Saves a report record associated with the user and optional project/prediction."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO public.saved_reports (
                    user_id, project_id, prediction_id, report_name, report_type, file_path
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (user_id, project_id, prediction_id, report_name, report_type, file_path)
            )
            row = cur.fetchone()
            return dict(row)

    @staticmethod
    def list_reports(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Lists reports owned by the authenticated user."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT r.*, p.project_name
                FROM public.saved_reports r
                LEFT JOIN public.projects p ON r.project_id = p.id
                WHERE r.user_id = %s
                ORDER BY r.created_at DESC
                LIMIT %s
                """,
                (user_id, limit)
            )
            rows = cur.fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def delete_report(report_id: str, user_id: str) -> bool:
        """Deletes a saved report record."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.saved_reports WHERE id = %s AND user_id = %s",
                (report_id, user_id)
            )
            return cur.rowcount > 0
