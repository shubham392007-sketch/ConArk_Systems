"""
Saved reports database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
from conark.db.client import get_db_cursor
from conark.db.services.project_service import ProjectService
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
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                ProjectService.ensure_user_profile_exists(cur, u_id_str)
                cur.execute(
                    """
                    INSERT INTO public.saved_reports (
                        user_id, project_id, prediction_id, report_name, report_type, file_path
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *
                    """,
                    (u_id_str, project_id, prediction_id, report_name, report_type, file_path)
                )
                row = cur.fetchone()
                return dict(row) if row else {}
        except Exception as err:
            logger.error(f"ReportService.save_report error: {err}")
            return {"user_id": u_id_str, "report_name": report_name, "report_type": report_type}

    @staticmethod
    def list_reports(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Lists reports owned by the authenticated user."""
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    """
                    SELECT r.*, p.project_name
                    FROM public.saved_reports r
                    LEFT JOIN public.projects p ON r.project_id = p.id
                    WHERE r.user_id::text = %s
                    ORDER BY r.created_at DESC
                    LIMIT %s
                    """,
                    (u_id_str, limit)
                )
                rows = cur.fetchall()
                return [dict(r) for r in rows]
        except Exception as err:
            logger.error(f"ReportService.list_reports error: {err}")
            return []

    @staticmethod
    def delete_report(report_id: str, user_id: str) -> bool:
        """Deletes a saved report record."""
        r_id_str = str(report_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    "DELETE FROM public.saved_reports WHERE id::text = %s AND user_id::text = %s",
                    (r_id_str, u_id_str)
                )
                return cur.rowcount > 0
        except Exception as err:
            logger.error(f"ReportService.delete_report error: {err}")
            return False

