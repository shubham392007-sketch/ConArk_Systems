"""
Model prediction database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import json
from conark.db.client import get_db_cursor
from conark.db.services.project_service import ProjectService
from conark.utils.logging import get_logger

logger = get_logger("prediction_service")

class PredictionService:
    @staticmethod
    def _normalize_model_name(name: str) -> str:
        n = (name or "").strip().lower()
        if n in ["cost", "cost_forecast", "cost_prediction"]:
            return "cost_prediction"
        if n in ["time", "time_forecast", "time_prediction"]:
            return "time_prediction"
        if n in ["risk", "risk_prediction", "risk_intelligence"]:
            return "risk_intelligence"
        if n in ["performance", "performance_prediction", "performance_intelligence"]:
            return "performance_intelligence"
        if n in ["space", "space_layout", "space_optimizer", "space_optimization", "optimization"]:
            return "space_optimizer"
        if n in ["house", "house_price", "house_price_prediction", "house-price"]:
            return "house_price_prediction"
        if n in ["all", "all_models", "master", "multivariate_intelligence"]:
            return "all_models"
        return name

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
        u_id_str = str(user_id).strip()
        clean_model_name = PredictionService._normalize_model_name(model_name)
        clean_project_id = None
        if project_id and isinstance(project_id, str) and len(project_id.strip()) > 0:
            try:
                import uuid
                clean_project_id = str(uuid.UUID(project_id.strip()))
            except Exception:
                clean_project_id = None

        try:
            with get_db_cursor() as cur:
                ProjectService.ensure_user_profile_exists(cur, u_id_str)

                # If no project_id provided, associate with user's primary/default project workspace
                if not clean_project_id:
                    cur.execute(
                        "SELECT id FROM public.projects WHERE user_id::text = %s ORDER BY created_at ASC LIMIT 1",
                        (u_id_str,)
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
                                (u_id_str, "ConArk Systems", "Primary construction intelligence workspace", "Commercial Infrastructure", "Active")
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
                        u_id_str,
                        clean_project_id,
                        clean_model_name,
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
                return dict(row) if row else {}
        except Exception as err:
            logger.error(f"PredictionService.save_prediction error: {err}")
            return {
                "user_id": u_id_str,
                "project_id": clean_project_id,
                "model_name": clean_model_name,
                "prediction_output": prediction_output
            }

    @staticmethod
    def list_predictions(
        user_id: str,
        model_name: Optional[str] = None,
        project_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """Lists predictions owned by user with pagination and optional filtering."""
        u_id_str = str(user_id).strip()
        query = "SELECT mp.*, p.project_name FROM public.model_predictions mp LEFT JOIN public.projects p ON mp.project_id = p.id WHERE mp.user_id::text = %s"
        count_query = "SELECT COUNT(*) FROM public.model_predictions WHERE user_id::text = %s"
        params: List[Any] = [u_id_str]
        count_params: List[Any] = [u_id_str]

        if model_name and model_name.upper() != "ALL":
            norm = PredictionService._normalize_model_name(model_name)
            synonyms = {
                "cost_prediction": ("cost", "cost_forecast", "cost_prediction"),
                "time_prediction": ("time", "time_forecast", "time_prediction"),
                "risk_intelligence": ("risk", "risk_prediction", "risk_intelligence"),
                "performance_intelligence": ("performance", "performance_prediction", "performance_intelligence"),
                "space_optimizer": ("space", "space_layout", "space_optimizer", "space_optimization", "optimization"),
                "house_price_prediction": ("house", "house_price", "house_price_prediction", "house-price"),
                "all_models": ("all", "all_models", "master", "multivariate_intelligence")
            }
            matched_syns = synonyms.get(norm, (norm,))
            placeholders = ", ".join(["%s"] * len(matched_syns))
            query += f" AND mp.model_name IN ({placeholders})"
            count_query += f" AND model_name IN ({placeholders})"
            params.extend(matched_syns)
            count_params.extend(matched_syns)

        if project_id and project_id.upper() != "ALL":
            query += " AND mp.project_id::text = %s"
            count_query += " AND project_id::text = %s"
            params.append(str(project_id).strip())
            count_params.append(str(project_id).strip())

        query += " ORDER BY mp.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        try:
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
        except Exception as err:
            logger.error(f"PredictionService.list_predictions error: {err}")
            return {
                "total": 0,
                "limit": limit,
                "offset": offset,
                "items": []
            }

    @staticmethod
    def get_prediction(prediction_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single prediction by ID with project details."""
        p_id_str = str(prediction_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    """
                    SELECT mp.*, p.project_name
                    FROM public.model_predictions mp
                    LEFT JOIN public.projects p ON mp.project_id = p.id
                    WHERE mp.id::text = %s AND mp.user_id::text = %s
                    """,
                    (p_id_str, u_id_str)
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
                    (p_id_str, u_id_str)
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as err:
            logger.error(f"PredictionService.get_prediction error: {err}")
            return None

    @staticmethod
    def delete_prediction(prediction_id: str, user_id: str) -> bool:
        """Deletes a single prediction record owned by user."""
        p_id_str = str(prediction_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    "DELETE FROM public.model_predictions WHERE id::text = %s AND user_id::text = %s",
                    (p_id_str, u_id_str)
                )
                deleted = cur.rowcount > 0

                cur.execute(
                    "DELETE FROM public.optimization_results WHERE id::text = %s AND user_id::text = %s",
                    (p_id_str, u_id_str)
                )
                if cur.rowcount > 0:
                    deleted = True

                return deleted
        except Exception as err:
            logger.error(f"PredictionService.delete_prediction error: {err}")
            return False

    @staticmethod
    def delete_all_predictions(
        user_id: str,
        project_id: Optional[str] = None,
        model_name: Optional[str] = None
    ) -> int:
        """Deletes all prediction records owned by user with optional workspace or model filters."""
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                # Model predictions query
                mp_query = "DELETE FROM public.model_predictions WHERE user_id::text = %s"
                mp_params: List[Any] = [u_id_str]

                if project_id and project_id != "ALL":
                    mp_query += " AND project_id::text = %s"
                    mp_params.append(str(project_id).strip())

                if model_name and model_name != "ALL":
                    mp_query += " AND model_name = %s"
                    mp_params.append(model_name)

                cur.execute(mp_query, tuple(mp_params))
                count = cur.rowcount

                # Optimization results query
                opt_query = "DELETE FROM public.optimization_results WHERE user_id::text = %s"
                opt_params: List[Any] = [u_id_str]

                if project_id and project_id != "ALL":
                    opt_query += " AND (project_id::text = %s OR project_id IS NULL)"
                    opt_params.append(str(project_id).strip())

                cur.execute(opt_query, tuple(opt_params))
                count += cur.rowcount

                return count
        except Exception as err:
            logger.error(f"PredictionService.delete_all_predictions error: {err}")
            return 0

