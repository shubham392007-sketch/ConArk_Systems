"""
Deterministic Safety & Material Alert Model master module.
Calculates Safety Alert Probability (%) and Material Shortage Probability (%)
based on standardized input features.
"""

from typing import List, Dict, Any


def calculate_safety_alert_metrics(
    temperature: float,
    humidity: float,
    vibration_level: float,
    worker_count: int,
    machinery_status: int,
    equipment_utilization_rate: float,
    safety_incidents: int,
    energy_consumption: float,
    task_progress: float
) -> Dict[str, Any]:
    """Calculates Safety Alert Status & Probability (%) from safety input features."""
    prob = 15.0  # Base nominal probability %
    
    if safety_incidents > 0:
        prob += safety_incidents * 35.0
    if vibration_level > 25.0:
        prob += (vibration_level - 25.0) * 2.5
    if equipment_utilization_rate > 85.0:
        prob += (equipment_utilization_rate - 85.0) * 1.5
    if temperature > 35.0:
        prob += 10.0
    if machinery_status == 1 and worker_count > 50:
        prob += 12.0
        
    prob = round(max(5.0, min(98.5, prob)), 1)
    
    if prob >= 75.0 or safety_incidents >= 2:
        status = "CRITICAL ALERT"
    elif prob >= 45.0 or safety_incidents >= 1:
        status = "HIGH ALERT"
    else:
        status = "NORMAL"

    return {
        "status": status,
        "probability": prob
    }


def calculate_material_alert_metrics(
    material_usage: float,
    task_progress: float,
    worker_count: int,
    machinery_status: int,
    equipment_utilization_rate: float,
    energy_consumption: float,
    material_shortage_alert: int,
    cost_deviation: float,
    time_deviation: float
) -> Dict[str, Any]:
    """Calculates Material Shortage Status & Probability (%) from material input features."""
    prob = 12.0  # Base nominal probability %
    
    if material_shortage_alert == 1:
        prob += 55.0
    if material_usage > 600.0:
        prob += (material_usage - 600.0) * 0.05
    if cost_deviation > 2000.0:
        prob += 15.0
    if time_deviation > 2.0:
        prob += 10.0
    if equipment_utilization_rate > 80.0 and task_progress < 0.5:
        prob += 12.0

    prob = round(max(5.0, min(99.0, prob)), 1)
    
    if prob >= 50.0 or material_shortage_alert == 1:
        status = "SHORTAGE DETECTED"
    else:
        status = "NORMAL"

    return {
        "status": status,
        "probability": prob
    }


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
    material_consumption_velocity: float = 0.0,
    temperature: float = 25.0,
    humidity: float = 50.0,
    worker_count: int = 40,
    machinery_status: int = 1,
    task_progress: float = 0.45
) -> List[Dict[str, Any]]:
    """Evaluates all operational alert rules and returns prioritized safety, material, equipment, and schedule alerts."""
    from conark.alerts.safety import check_safety_alerts
    from conark.alerts.material import check_material_alerts
    from conark.alerts.equipment import check_equipment_alerts
    from conark.alerts.schedule import check_schedule_alerts

    alerts = []
    
    # Calculate Safety & Material alert metrics
    safety_metrics = calculate_safety_alert_metrics(
        temperature, humidity, vibration_level, worker_count, machinery_status,
        equipment_utilization_rate, safety_incidents, energy_consumption, task_progress
    )
    material_metrics = calculate_material_alert_metrics(
        material_usage, task_progress, worker_count, machinery_status,
        equipment_utilization_rate, energy_consumption, material_shortage_alert,
        predicted_cost_deviation, predicted_time_deviation_days
    )

    alerts.extend(check_safety_alerts(safety_incidents, vibration_level, risk_score))
    alerts.extend(check_material_alerts(material_shortage_alert, material_usage, material_consumption_velocity))
    alerts.extend(check_equipment_alerts(equipment_utilization_rate, energy_consumption, vibration_level))
    alerts.extend(check_schedule_alerts(predicted_time_deviation_days, predicted_cost_deviation))
    
    # Attach probabilities to generated alert dicts
    for a in alerts:
        if a["type"] == "SAFETY":
            a["status"] = safety_metrics["status"]
            a["probability"] = safety_metrics["probability"]
        elif a["type"] == "MATERIAL":
            a["status"] = material_metrics["status"]
            a["probability"] = material_metrics["probability"]

    # Sort by Priority (1=Critical, 2=High, 3=Medium, 4=Low)
    alerts.sort(key=lambda x: x.get("priority", 4))
    
    return alerts
