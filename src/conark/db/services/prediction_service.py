"""
Model prediction database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import json
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("prediction_service")

class PredictionService:
    @staticmethod
    def save_prediction(
        user_id: str,
        model_name: str,
        model_version: str,
        prediction_type: str,
        input_data: Dict[str, Any],
        prediction_output: Dict[str, Any],
        explanation: Optional[str] = None,
        confidence_score: Optional[float] = None,
        processing_time_ms: Optional[int] = None,
        project_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Saves a model prediction with input JSONB, output JSONB, explanation, and workspace association."""
        clean_project_id = None
        if project_id and isinstance(project_id, str) and len(project_id.strip()) > 0:
            try:
                import uuid
                clean_project_id = str(uuid.UUID(project_id.strip()))
            except Exception:
                clean_project_id = None

        with get_db_cursor() as cur:
            # If no project_id provided, associate with user's primary/default project workspace
            if not clean_project_id:
                cur.execute(
                    "SELECT id FROM public.projects WHERE user_id = %s ORDER BY created_at ASC LIMIT 1",
                    (user_id,)
                )
                proj_row = cur.fetchone()
                if proj_row:
                    clean_project_id = str(proj_row["id"])
                else:
                    try:
                        cur.execute(
                            """
                            INSERT INTO public.projects (user_id, project_name, description, project_type, status)
                            VALUES (%s, %s, %s, %s, %s)
                            RETURNING id
                            """,
                            (user_id, "ConArk Systems", "Primary construction intelligence workspace", "Commercial Infrastructure", "active")
                        )
                        new_proj = cur.fetchone()
                        if new_proj:
                            clean_project_id = str(new_proj["id"])
                    except Exception as p_err:
                        logger.warning(f"Could not auto-create default workspace: {p_err}")

            cur.execute(
                """
                INSERT INTO public.model_predictions (
                    user_id, project_id, model_name, model_version, prediction_type,
                    input_data, prediction_output, confidence_score, explanation, processing_time_ms
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    user_id,
                    clean_project_id,
                    model_name,
                    model_version,
                    prediction_type,
                    json.dumps(input_data),
                    json.dumps(prediction_output),
                    confidence_score,
                    explanation,
                    processing_time_ms
                )
            )
            row = cur.fetchone()
            return dict(row)

    @staticmethod
    def list_predictions(
        user_id: str,
        model_name: Optional[str] = None,
        project_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """Lists predictions owned by user with pagination and optional filtering."""
        query = "SELECT mp.*, p.project_name FROM public.model_predictions mp LEFT JOIN public.projects p ON mp.project_id = p.id WHERE mp.user_id::text = %s"
        count_query = "SELECT COUNT(*) FROM public.model_predictions WHERE user_id::text = %s"
        params: List[Any] = [str(user_id).strip()]
        count_params: List[Any] = [str(user_id).strip()]

        if model_name:
            query += " AND mp.model_name = %s"
            count_query += " AND model_name = %s"
            params.append(model_name)
            count_params.append(model_name)

        if project_id:
            query += " AND mp.project_id::text = %s"
            count_query += " AND project_id::text = %s"
            params.append(str(project_id).strip())
            count_params.append(str(project_id).strip())

        query += " ORDER BY mp.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        with get_db_cursor() as cur:
            cur.execute(count_query, tuple(count_params))
            total_count = cur.fetchone()["count"]

            cur.execute(query, tuple(params))
            rows = cur.fetchall()
            return {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "items": [dict(r) for r in rows]
            }

    @staticmethod
    def get_prediction(prediction_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single prediction by ID with project details."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT mp.*, p.project_name
                FROM public.model_predictions mp
                LEFT JOIN public.projects p ON mp.project_id = p.id
                WHERE mp.id::text = %s AND mp.user_id::text = %s
                """,
                (str(prediction_id).strip(), str(user_id).strip())
            )
            row = cur.fetchone()
            if row:
                return dict(row)

            # Fallback for optimization_results
            cur.execute(
                """
                SELECT opt.*, p.project_name, 'space_optimizer' as model_name
                FROM public.optimization_results opt
                LEFT JOIN public.projects p ON opt.project_id = p.id
                WHERE opt.id::text = %s AND opt.user_id::text = %s
                """,
                (str(prediction_id).strip(), str(user_id).strip())
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_prediction(prediction_id: str, user_id: str) -> bool:
        """Deletes a single prediction record owned by user."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.model_predictions WHERE id::text = %s AND user_id::text = %s",
                (str(prediction_id).strip(), str(user_id).strip())
            )
            deleted = cur.rowcount > 0

            cur.execute(
                "DELETE FROM public.optimization_results WHERE id::text = %s AND user_id::text = %s",
                (str(prediction_id).strip(), str(user_id).strip())
            )
            if cur.rowcount > 0:
                deleted = True

            return deleted

    @staticmethod
    def delete_all_predictions(user_id: str) -> int:
        """Deletes all prediction records owned by user."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.model_predictions WHERE user_id::text = %s",
                (str(user_id).strip(),)
            )
            count = cur.rowcount

            cur.execute(
                "DELETE FROM public.optimization_results WHERE user_id::text = %s",
                (str(user_id).strip(),)
            )
            count += cur.rowcount

            return count
