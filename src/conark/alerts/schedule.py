"""Schedule and cost delay alert rule checks."""

from typing import List, Dict, Any
from conark.config.constants import ALERT_THRESHOLDS


def check_schedule_alerts(
    predicted_time_deviation_days: float,
    predicted_cost_deviation: float
) -> List[Dict[str, Any]]:
    alerts = []
    
    # 1. Schedule Delay Alert
    if predicted_time_deviation_days >= ALERT_THRESHOLDS["time_deviation_delay_critical"]:
        alerts.append({
            "type": "SCHEDULE",
            "severity": "CRITICAL",
            "title": "Critical Schedule Delay",
            "message": f"Predicted project delay is {predicted_time_deviation_days:.1f} days.",
            "source": "rule_engine",
            "priority": 1
        })
    elif predicted_time_deviation_days >= ALERT_THRESHOLDS["time_deviation_delay_warning"]:
        alerts.append({
            "type": "SCHEDULE",
            "severity": "HIGH",
            "title": "Project Schedule Delay Warning",
            "message": f"Predicted delay of {predicted_time_deviation_days:.1f} days exceeds schedule buffer.",
            "source": "rule_engine",
            "priority": 2
        })

    # 2. Cost Overrun Alert
    if predicted_cost_deviation >= 2500.0:
        alerts.append({
            "type": "COST",
            "severity": "HIGH",
            "title": "Significant Budget Overrun Forecast",
            "message": f"Forecasted cost deviation is +${predicted_cost_deviation:,.2f} over budget.",
            "source": "rule_engine",
            "priority": 2
        })

    return alerts
