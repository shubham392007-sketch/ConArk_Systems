"""
Time / Schedule Forecasting Model wrapper (Head B of Forecasting Service).
Predicts time_deviation (days) and schedule status.
Standardized Inputs: task_progress, worker_count, machinery_status, equipment_utilization_rate,
vibration_level, safety_incidents, material_usage, material_shortage_alert, energy_consumption.
Target: time_deviation (strictly excluded from inputs).
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel

TIME_FEATURE_NAMES = [
    "task_progress", "worker_count", "machinery_status", "equipment_utilization_rate",
    "vibration_level", "safety_incidents", "material_usage", "material_shortage_alert", "energy_consumption"
]


class TimeModel(BaseModel):

    def __init__(self):
        super().__init__("time")

    def predict(self, df_features: pd.DataFrame, on_schedule_tolerance: float = 0.5) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        target_features = [f for f in TIME_FEATURE_NAMES if f in df_features.columns]
        if self.feature_names:
            target_features = [f for f in self.feature_names if f in df_features.columns and f != "time_deviation"]

        X = df_features[target_features].fillna(0) if target_features else df_features.fillna(0)
        predicted_days = float(self.model.predict(X)[0])
        predicted_days = round(predicted_days, 2)
        
        # Categorize schedule status
        if predicted_days < -on_schedule_tolerance:
            status = "Ahead"
        elif abs(predicted_days) <= on_schedule_tolerance:
            status = "On Schedule"
        else:
            status = "Delayed"

        top_factors = self.get_feature_importance(X, top_k=3)

        return {
            "predicted_time_deviation_days": predicted_days,
            "schedule_status": status,
            "top_factors": top_factors
        }
