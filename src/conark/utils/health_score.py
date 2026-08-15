"""
Transparent weighted ConArk overall project health score calculator.
Formula:
Health Score = (Performance_Score * 0.30) + (Risk_Score_Inverted * 0.30) +
               (Schedule_Score * 0.20) + (Cost_Score * 0.10) + (Safety_Score * 0.10)

Component Normalization (0-100 scale):
1. Performance: Excellent=100, Good=80, Average=50, Poor=20
2. Risk Inverted: max(0, 100 - risk_score)
3. Schedule: max(0, 100 - abs(time_deviation_days) * 10)
4. Cost: max(0, 100 - abs(cost_deviation) / 100) clamped to [0, 100]
5. Safety: max(0, 100 - safety_incidents * 30 - critical_alerts * 20)
"""

from typing import Dict, Any, List
from conark.config.constants import HEALTH_SCORE_WEIGHTS


def calculate_health_score(
    performance_pred: str,
    risk_score: float,
    cost_deviation: float,
    time_deviation_days: float,
    safety_incidents: int,
    critical_alerts_count: int = 0,
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """Calculate transparent health score (0-100) and status."""
    weights = custom_weights or HEALTH_SCORE_WEIGHTS

    # 1. Performance Component (0-100)
    perf_map = {"Excellent": 100.0, "Good": 80.0, "Average": 50.0, "Poor": 20.0}
    perf_norm = perf_map.get(performance_pred, 50.0)

    # 2. Risk Component (Inverted: lower risk -> higher health)
    risk_norm = max(0.0, min(100.0, 100.0 - risk_score))

    # 3. Schedule Component (0 deviation -> 100, 10 days delay -> 0)
    sched_norm = max(0.0, min(100.0, 100.0 - abs(time_deviation_days) * 10.0))

    # 4. Cost Component (0 deviation -> 100, $5000 deviation -> 50)
    cost_norm = max(0.0, min(100.0, 100.0 - (abs(cost_deviation) / 100.0)))

    # 5. Safety Component (0 incidents & alerts -> 100)
    safety_penalty = (safety_incidents * 30.0) + (critical_alerts_count * 20.0)
    safety_norm = max(0.0, min(100.0, 100.0 - safety_penalty))

    overall_score = round(
        (perf_norm * weights["performance"]) +
        (risk_norm * weights["risk"]) +
        (sched_norm * weights["schedule"]) +
        (cost_norm * weights["cost"]) +
        (safety_norm * weights["safety"])
    )
    overall_score = int(max(0, min(100, overall_score)))

    if overall_score >= 80:
        status = "Excellent"
    elif overall_score >= 65:
        status = "Good"
    elif overall_score >= 45:
        status = "Needs Attention"
    else:
        status = "Critical"

    return {
        "overall_health_score": overall_score,
        "health_status": status,
        "components": {
            "performance_score_norm": round(perf_norm, 1),
            "risk_score_norm": round(risk_norm, 1),
            "schedule_score_norm": round(sched_norm, 1),
            "cost_score_norm": round(cost_norm, 1),
            "safety_score_norm": round(safety_norm, 1),
        },
        "weights_used": weights
    }
