"""
System constants, schemas, thresholds, and configuration defaults.
"""

# Canonical dataset schema feature lists
NUMERICAL_FEATURES = [
    "temperature",
    "humidity",
    "vibration_level",
    "material_usage",
    "machinery_status",
    "worker_count",
    "energy_consumption",
    "task_progress",
    "safety_incidents",
    "equipment_utilization_rate",
    "material_shortage_alert",
    "simulation_deviation",
]

RAW_INPUT_COLUMNS = NUMERICAL_FEATURES.copy()

TARGET_COLUMNS = [
    "performance_score",
    "risk_score",
    "cost_deviation",
    "time_deviation",
    "optimization_suggestion",
]

PERFORMANCE_CLASSES = ["Poor", "Average", "Good", "Excellent"]

OPTIMIZATION_CLASSES = [
    "Optimize Material Usage",
    "Reallocate Workers",
    "Adjust Schedule",
    "Enhance Safety Measures",
    "Increase Machinery Efficiency",
]

# Secondary Schema Mapping
SECONDARY_SCHEMA_MAPPING = {
    "Timestamp": "timestamp",
    "Sensor_ID": "sensor_id",
    "Temperature": "temperature",
    "Humidity": "humidity",
    "Vibration_Level": "vibration_level",
    "Material_Usage": "material_usage",
    "Energy_Consumption": "energy_consumption",
    "Worker_Count": "worker_count",
    "Task_Progress": "task_progress",
    "Safety_Incidents": "safety_incidents",
    "Resource_Utilization": "equipment_utilization_rate",
    "Risk_Score": "risk_score",
    "Simulation_Accuracy": "simulation_deviation",
    "Optimization_Suggestion": "optimization_suggestion",
    "Performance_Score": "performance_score",
}

# Alert Engine Thresholds
ALERT_THRESHOLDS = {
    "safety_incidents_max": 0,
    "vibration_warning": 25.0,
    "vibration_critical": 35.0,
    "equipment_utilization_high": 85.0,
    "energy_consumption_high": 350.0,
    "time_deviation_delay_warning": 2.0,
    "time_deviation_delay_critical": 5.0,
    "risk_critical": 76.0,
    "risk_high": 51.0,
}

# Health Score Component Weights (Must sum to 1.0)
HEALTH_SCORE_WEIGHTS = {
    "performance": 0.30,
    "risk": 0.30,
    "schedule": 0.20,
    "cost": 0.10,
    "safety": 0.10,
}
