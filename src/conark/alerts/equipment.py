"""Equipment utilization and energy alert rule checks."""

from typing import List, Dict, Any
from conark.config.constants import ALERT_THRESHOLDS


def check_equipment_alerts(
    equipment_utilization_rate: float,
    energy_consumption: float,
    vibration_level: float
) -> List[Dict[str, Any]]:
    alerts = []
    
    # 1. High Equipment Utilization + High Vibration
    if equipment_utilization_rate >= ALERT_THRESHOLDS["equipment_utilization_high"] and vibration_level >= 20.0:
        alerts.append({
            "type": "EQUIPMENT",
            "severity": "HIGH",
            "title": "Equipment Overload Warning",
            "message": f"Equipment utilization ({equipment_utilization_rate:.1f}%) and vibration ({vibration_level:.1f} mm/s) are both near maximum operational thresholds.",
            "source": "rule_engine",
            "priority": 2
        })

    # 2. High Energy Consumption
    if energy_consumption >= ALERT_THRESHOLDS["energy_consumption_high"]:
        alerts.append({
            "type": "EQUIPMENT",
            "severity": "MEDIUM",
            "title": "Elevated Energy Consumption",
            "message": f"Site energy consumption ({energy_consumption:.1f} kWh) is unusually elevated.",
            "source": "rule_engine",
            "priority": 3
        })

    return alerts
