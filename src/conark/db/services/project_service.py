"""
Project workspace database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import uuid
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("project_service")

class ProjectService:
    @staticmethod
    def list_projects(user_id: str) -> List[Dict[str, Any]]:
        """Lists all projects owned by the authenticated user with prediction and optimization counts."""
        u_id_str = str(user_id).strip()
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT p.*,
                       (SELECT COUNT(*) FROM public.model_predictions mp WHERE mp.project_id = p.id) as prediction_count,
                       (SELECT COUNT(*) FROM public.optimization_results opt WHERE opt.project_id = p.id) as optimization_count,
                       (SELECT COUNT(*) FROM public.saved_reports rep WHERE rep.project_id = p.id) as report_count
                FROM public.projects p
                WHERE p.user_id::text = %s
                ORDER BY p.created_at DESC
                """,
                (u_id_str,)
            )
            rows = cur.fetchall()

            # If user has no project yet (e.g. freshly signed up on mobile/desktop), auto-create default workspace
            if not rows:
                try:
                    cur.execute(
                        """
                        INSERT INTO public.projects (user_id, project_name, description, project_type, location, status)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING *
                        """,
                        (u_id_str, "ConArk Systems", "Primary construction intelligence workspace", "Commercial Infrastructure", "Main Site", "Active")
                    )
                    new_p = cur.fetchone()
                    if new_p:
                        d = dict(new_p)
                        d["prediction_count"] = 0
                        d["optimization_count"] = 0
                        d["report_count"] = 0
                        return [d]
                except Exception as e:
                    logger.warning(f"Could not auto-create initial project: {e}")

            return [dict(r) for r in rows]

    @staticmethod
    def get_project(project_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single project by ID owned by the authenticated user."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT p.*,
                       (SELECT COUNT(*) FROM public.model_predictions mp WHERE mp.project_id = p.id) as prediction_count,
                       (SELECT COUNT(*) FROM public.optimization_results opt WHERE opt.project_id = p.id) as optimization_count,
                       (SELECT COUNT(*) FROM public.saved_reports rep WHERE rep.project_id = p.id) as report_count
                FROM public.projects p
                WHERE p.id::text = %s AND p.user_id::text = %s
                """,
                (str(project_id).strip(), str(user_id).strip())
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def create_project(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new project record for the user."""
        project_name = data.get("project_name", "Untitled Project").strip()
        description = data.get("description", "")
        project_type = data.get("project_type", "Commercial Infrastructure")
        location = data.get("location", "")
        status = data.get("status", "Active")

        with get_db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO public.projects (user_id, project_name, description, project_type, location, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (str(user_id).strip(), project_name, description, project_type, location, status)
            )
            row = cur.fetchone()
            return dict(row)

    @staticmethod
    def update_project(project_id: str, user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates an existing project record."""
        project_name = data.get("project_name")
        description = data.get("description")
        project_type = data.get("project_type")
        location = data.get("location")
        status = data.get("status")

        with get_db_cursor() as cur:
            cur.execute(
                """
                UPDATE public.projects
                SET project_name = COALESCE(%s, project_name),
                    description = COALESCE(%s, description),
                    project_type = COALESCE(%s, project_type),
                    location = COALESCE(%s, location),
                    status = COALESCE(%s, status),
                    updated_at = NOW()
                WHERE id::text = %s AND user_id::text = %s
                RETURNING *
                """,
                (project_name, description, project_type, location, status, str(project_id).strip(), str(user_id).strip())
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_project(project_id: str, user_id: str) -> bool:
        """Deletes a project owned by the user."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.projects WHERE id::text = %s AND user_id::text = %s",
                (str(project_id).strip(), str(user_id).strip())
            )
            return cur.rowcount > 0
