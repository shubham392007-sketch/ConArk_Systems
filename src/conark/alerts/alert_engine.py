"""
Deterministic Alert Engine master module.
Evaluates all domain alert rules and sorts results by priority (1 to 4).
"""

from typing import List, Dict, Any
from conark.alerts.safety import check_safety_alerts
from conark.alerts.material import check_material_alerts
from conark.alerts.equipment import check_equipment_alerts
from conark.alerts.schedule import check_schedule_alerts


def evaluate_alerts(
    safety_incidents: int,
    vibration_level: float,
    risk_score: float,
    material_shortage_alert: int,
    material_usage: float,
    equipment_utilization_rate: float,
    energy_consumption: float,
    predicted_time_deviation_days: float,
    predicted_cost_deviation: float,
    material_consumption_velocity: float = 0.0
) -> List[Dict[str, Any]]:
    """Evaluates all operational alert rules and returns sorted alerts list."""
    alerts = []
    
    alerts.extend(check_safety_alerts(safety_incidents, vibration_level, risk_score))
    alerts.extend(check_material_alerts(material_shortage_alert, material_usage, material_consumption_velocity))
    alerts.extend(check_equipment_alerts(equipment_utilization_rate, energy_consumption, vibration_level))
    alerts.extend(check_schedule_alerts(predicted_time_deviation_days, predicted_cost_deviation))
    
    # Sort by Priority (1=Critical, 2=High, 3=Medium, 4=Low)
    alerts.sort(key=lambda x: x.get("priority", 4))
    
    return alerts
