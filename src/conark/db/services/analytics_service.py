"""
User analytics database service for ConArk Systems Command Center.
"""
from typing import Dict, Any
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("analytics_service")

class AnalyticsService:
    @staticmethod
    def get_user_analytics(user_id: str) -> Dict[str, Any]:
        """Aggregates user-specific metrics from real database records."""
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                # 1. Total counts
                cur.execute("SELECT COUNT(*) as total FROM public.projects WHERE user_id::text = %s", (u_id_str,))
                total_projects = cur.fetchone()["total"]

                cur.execute("SELECT COUNT(*) as total FROM public.model_predictions WHERE user_id::text = %s", (u_id_str,))
                total_predictions = cur.fetchone()["total"]

                cur.execute("SELECT COUNT(*) as total FROM public.optimization_results WHERE user_id::text = %s", (u_id_str,))
                total_optimizations = cur.fetchone()["total"]

                cur.execute("SELECT COUNT(*) as total FROM public.ai_conversations WHERE user_id::text = %s", (u_id_str,))
                total_conversations = cur.fetchone()["total"]

                cur.execute("SELECT COUNT(*) as total FROM public.saved_reports WHERE user_id::text = %s", (u_id_str,))
                total_reports = cur.fetchone()["total"]

                # 2. Predictions by model name
                cur.execute(
                    """
                    SELECT model_name, COUNT(*) as count
                    FROM public.model_predictions
                    WHERE user_id::text = %s
                    GROUP BY model_name
                    """,
                    (u_id_str,)
                )
                model_counts = {row["model_name"]: row["count"] for row in cur.fetchall()}

                # 3. Risk Level Distribution (from prediction_output)
                cur.execute(
                    """
                    SELECT prediction_output->>'risk_level' as risk_level, COUNT(*) as count
                    FROM public.model_predictions
                    WHERE user_id::text = %s AND model_name = 'risk_intelligence'
                    GROUP BY prediction_output->>'risk_level'
                    """,
                    (u_id_str,)
                )
                risk_dist = {row["risk_level"] or "Unknown": row["count"] for row in cur.fetchall()}

                # 4. Recent Predictions
                cur.execute(
                    """
                    SELECT mp.id, mp.model_name, mp.model_version, mp.prediction_type,
                           mp.prediction_output, mp.confidence_score, mp.created_at,
                           p.project_name
                    FROM public.model_predictions mp
                    LEFT JOIN public.projects p ON mp.project_id = p.id
                    WHERE mp.user_id::text = %s
                    ORDER BY mp.created_at DESC
                    LIMIT 5
                    """,
                    (u_id_str,)
                )
                recent_predictions = [dict(r) for r in cur.fetchall()]

                # 5. Recent Optimizations
                cur.execute(
                    """
                    SELECT opt.id, opt.optimization_type, opt.result, opt.created_at, p.project_name
                    FROM public.optimization_results opt
                    LEFT JOIN public.projects p ON opt.project_id = p.id
                    WHERE opt.user_id::text = %s
                    ORDER BY opt.created_at DESC
                    LIMIT 5
                    """,
                    (u_id_str,)
                )
                recent_optimizations = [dict(r) for r in cur.fetchall()]

                return {
                    "total_projects": total_projects,
                    "total_predictions": total_predictions,
                    "total_optimizations": total_optimizations,
                    "total_conversations": total_conversations,
                    "total_reports": total_reports,
                    "model_counts": model_counts,
                    "risk_distribution": risk_dist,
                    "recent_predictions": recent_predictions,
                    "recent_optimizations": recent_optimizations
                }
        except Exception as err:
            logger.error(f"AnalyticsService.get_user_analytics error: {err}")
            return {
                "total_projects": 0,
                "total_predictions": 0,
                "total_optimizations": 0,
                "total_conversations": 0,
                "total_reports": 0,
                "model_counts": {},
                "risk_distribution": {},
                "recent_predictions": [],
                "recent_optimizations": []
            }

