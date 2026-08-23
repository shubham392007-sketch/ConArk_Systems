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
        """Saves a model prediction with input JSONB, output JSONB, explanation, and telemetry."""
        with get_db_cursor() as cur:
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
                    project_id,
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
        query = "SELECT mp.*, p.project_name FROM public.model_predictions mp LEFT JOIN public.projects p ON mp.project_id = p.id WHERE mp.user_id = %s"
        count_query = "SELECT COUNT(*) FROM public.model_predictions WHERE user_id = %s"
        params: List[Any] = [user_id]
        count_params: List[Any] = [user_id]

        if model_name:
            query += " AND mp.model_name = %s"
            count_query += " AND model_name = %s"
            params.append(model_name)
            count_params.append(model_name)

        if project_id:
            query += " AND mp.project_id = %s"
            count_query += " AND project_id = %s"
            params.append(project_id)
            count_params.append(project_id)

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
                WHERE mp.id = %s AND mp.user_id = %s
                """,
                (prediction_id, user_id)
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_prediction(prediction_id: str, user_id: str) -> bool:
        """Deletes a prediction record owned by user."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.model_predictions WHERE id = %s AND user_id = %s",
                (prediction_id, user_id)
            )
            return cur.rowcount > 0
