"""
Cost Forecasting Model wrapper (Head A of Forecasting Service).
Predicts cost_deviation ($) and budget status.
Standardized Inputs: task_progress, material_usage, worker_count, energy_consumption,
equipment_utilization_rate, machinery_status, temperature, humidity, vibration_level.
Target: cost_deviation (strictly excluded from inputs).
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel

COST_FEATURE_NAMES = [
    "task_progress", "material_usage", "worker_count", "energy_consumption",
    "equipment_utilization_rate", "machinery_status", "temperature", "humidity", "vibration_level"
]


class CostModel(BaseModel):

    def __init__(self):
        super().__init__("cost")

    def predict(self, df_features: pd.DataFrame, on_budget_tolerance: float = 100.0) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        target_features = [f for f in COST_FEATURE_NAMES if f in df_features.columns]
        if self.feature_names:
            target_features = [f for f in self.feature_names if f in df_features.columns and f != "cost_deviation"]

        X = df_features[target_features].fillna(0) if target_features else df_features.fillna(0)
        predicted_deviation = float(self.model.predict(X)[0])
        predicted_deviation = round(predicted_deviation, 2)
        
        # Categorize budget status
        if predicted_deviation < -on_budget_tolerance:
            status = "Under Budget"
        elif abs(predicted_deviation) <= on_budget_tolerance:
            status = "On Budget"
        else:
            status = "Over Budget"

        top_factors = self.get_feature_importance(X, top_k=3)

        return {
            "predicted_cost_deviation": predicted_deviation,
            "budget_status": status,
            "top_factors": top_factors
        }
