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
    def ensure_user_profile_exists(cur, user_id: str, email: str = "user@conark.com", full_name: str = "ConArk User") -> None:
        """Ensures a user profile row exists in public.profiles so foreign keys never fail."""
        try:
            cur.execute(
                """
                INSERT INTO public.profiles (id, email, full_name, organization, role)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    email = COALESCE(NULLIF(EXCLUDED.email, 'user@conark.com'), public.profiles.email),
                    full_name = COALESCE(NULLIF(EXCLUDED.full_name, 'ConArk User'), public.profiles.full_name)
                """,
                (str(user_id).strip(), email, full_name, "ConArk Systems", "Site Engineer")
            )
        except Exception as e:
            logger.debug(f"Profile check/creation notice: {e}")
            try:
                cur.connection.rollback()
            except Exception:
                pass

    @staticmethod
    def list_projects(user_id: str) -> List[Dict[str, Any]]:
        """Lists all projects owned by the authenticated user with prediction and optimization counts."""
        u_id_str = str(user_id).strip()
        try:
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
                        ProjectService.ensure_user_profile_exists(cur, u_id_str)
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
        except Exception as err:
            logger.error(f"ProjectService.list_projects error for user {u_id_str}: {err}")
            return []

    @staticmethod
    def get_project(project_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single project by ID owned by the authenticated user."""
        p_id_str = str(project_id).strip()
        u_id_str = str(user_id).strip()
        try:
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
                    (p_id_str, u_id_str)
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as err:
            logger.error(f"ProjectService.get_project error: {err}")
            return None

    @staticmethod
    def create_project(user_id: str, data: Dict[str, Any], email: str = "user@conark.com", full_name: str = "ConArk User") -> Optional[Dict[str, Any]]:
        """Creates a new project record for the user."""
        u_id_str = str(user_id).strip()
        project_name = data.get("project_name", "Untitled Project").strip()
        description = data.get("description", "")
        project_type = data.get("project_type", "Commercial Infrastructure")
        location = data.get("location", "")
        status = data.get("status", "Active")

        try:
            with get_db_cursor() as cur:
                ProjectService.ensure_user_profile_exists(cur, u_id_str, email=email, full_name=full_name)
                cur.execute(
                    """
                    INSERT INTO public.projects (user_id, project_name, description, project_type, location, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *
                    """,
                    (u_id_str, project_name, description, project_type, location, status)
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as err:
            logger.error(f"ProjectService.create_project error: {err}")
            return None

    @staticmethod
    def update_project(project_id: str, user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates an existing project record."""
        p_id_str = str(project_id).strip()
        u_id_str = str(user_id).strip()
        project_name = data.get("project_name")
        description = data.get("description")
        project_type = data.get("project_type")
        location = data.get("location")
        status = data.get("status")

        try:
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
                    (project_name, description, project_type, location, status, p_id_str, u_id_str)
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as err:
            logger.error(f"ProjectService.update_project error: {err}")
            return None

    @staticmethod
    def delete_project(project_id: str, user_id: str) -> bool:
        """Deletes a project owned by the user."""
        p_id_str = str(project_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    "DELETE FROM public.projects WHERE id::text = %s AND user_id::text = %s",
                    (p_id_str, u_id_str)
                )
                return cur.rowcount > 0
        except Exception as err:
            logger.error(f"ProjectService.delete_project error: {err}")
            return False

