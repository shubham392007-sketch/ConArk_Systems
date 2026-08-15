"""Material shortage and consumption alert rule checks."""

from typing import List, Dict, Any


def check_material_alerts(
    material_shortage_alert: int,
    material_usage: float,
    material_consumption_velocity: float = 0.0
) -> List[Dict[str, Any]]:
    alerts = []
    
    # 1. Direct shortage flag
    if material_shortage_alert == 1:
        alerts.append({
            "type": "MATERIAL",
            "severity": "HIGH",
            "title": "Material Shortage Warning",
            "message": "Site inventory indicates an impending material shortage.",
            "source": "rule_engine",
            "priority": 2
        })

    # 2. Abnormal consumption rate
    if material_consumption_velocity > 50.0:
        alerts.append({
            "type": "MATERIAL",
            "severity": "MEDIUM",
            "title": "Abnormal Material Depletion Rate",
            "message": f"Material consumption velocity ({material_consumption_velocity:.1f} units/min) is unusually high.",
            "source": "rule_engine",
            "priority": 3
        })

    return alerts
