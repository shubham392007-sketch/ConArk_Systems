"""
Feature schema definitions and metadata.
"""

# Feature sets
ENGINEERED_FEATURE_NAMES = [
    # Base input numericals
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
    
    # Lags
    "temperature_lag_1", "temperature_lag_5", "temperature_lag_15",
    "humidity_lag_1", "humidity_lag_5", "humidity_lag_15",
    "vibration_lag_1", "vibration_lag_5", "vibration_lag_15",
    "energy_lag_1", "energy_lag_5", "energy_lag_15",
    "material_lag_1", "material_lag_5", "material_lag_15",
    "worker_lag_1", "worker_lag_5", "worker_lag_15",
    
    # Rolling stats
    "vibration_mean_5", "vibration_mean_15", "vibration_max_5", "vibration_max_15",
    "energy_mean_5", "energy_mean_15",
    "material_mean_5", "material_mean_15",
    "worker_mean_5", "worker_mean_15",
    "safety_incidents_sum_5", "safety_incidents_sum_15",
    
    # Change features
    "vibration_change", "energy_change", "material_change", "worker_change", "task_progress_change",
    
    # Velocity
    "task_progress_velocity", "material_consumption_velocity", "energy_consumption_velocity", "worker_change_rate",
    
    # Efficiency
    "material_efficiency", "energy_efficiency", "equipment_efficiency", "worker_productivity",
    
    # Timestamp features
    "hour", "day", "day_of_week", "day_of_month", "week_of_year", "is_weekend",
]
