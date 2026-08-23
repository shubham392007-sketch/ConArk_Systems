"""
Optimization results database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import json
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("optimization_service")

class OptimizationService:
    @staticmethod
    def save_optimization(
        user_id: str,
        optimization_type: str,
        input_data: Dict[str, Any],
        result: Dict[str, Any],
        constraints: Optional[Dict[str, Any]] = None,
        objective_function: Optional[Dict[str, Any]] = None,
        recommendations: Optional[List[Dict[str, Any]]] = None,
        project_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Saves spatial or project optimization results with input and output JSONB."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO public.optimization_results (
                    user_id, project_id, optimization_type, input_data, constraints,
                    objective_function, result, recommendations
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    user_id,
                    project_id,
                    optimization_type,
                    json.dumps(input_data),
                    json.dumps(constraints) if constraints else None,
                    json.dumps(objective_function) if objective_function else None,
                    json.dumps(result),
                    json.dumps(recommendations) if recommendations else None
                )
            )
            row = cur.fetchone()
            return dict(row)

    @staticmethod
    def list_optimizations(user_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Lists optimization runs owned by user."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT opt.*, p.project_name
                FROM public.optimization_results opt
                LEFT JOIN public.projects p ON opt.project_id = p.id
                WHERE opt.user_id = %s
                ORDER BY opt.created_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset)
            )
            rows = cur.fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def get_optimization(opt_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single optimization run by ID."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT opt.*, p.project_name
                FROM public.optimization_results opt
                LEFT JOIN public.projects p ON opt.project_id = p.id
                WHERE opt.id = %s AND opt.user_id = %s
                """,
                (opt_id, user_id)
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_optimization(opt_id: str, user_id: str) -> bool:
        """Deletes an optimization record."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.optimization_results WHERE id = %s AND user_id = %s",
                (opt_id, user_id)
            )
            return cur.rowcount > 0
