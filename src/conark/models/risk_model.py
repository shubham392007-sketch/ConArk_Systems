"""
Risk Prediction Model wrapper.
Estimates current construction project risk score (%) and assigns presentation level.
Standardized Inputs: temperature, humidity, vibration_level, worker_count, machinery_status,
energy_consumption, equipment_utilization_rate, safety_incidents, material_shortage_alert, task_progress.
Target: risk_score (strictly excluded from inputs to prevent target leakage).
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel

RISK_FEATURE_NAMES = [
    "temperature", "humidity", "vibration_level", "worker_count", "machinery_status",
    "energy_consumption", "equipment_utilization_rate", "safety_incidents",
    "material_shortage_alert", "task_progress"
]


class RiskModel(BaseModel):

    def __init__(self):
        super().__init__("risk")

    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        # Enforce exact feature mask
        target_features = [f for f in RISK_FEATURE_NAMES if f in df_features.columns]
        if self.feature_names:
            target_features = [f for f in self.feature_names if f in df_features.columns and f != "risk_score"]

        X = df_features[target_features].fillna(0) if target_features else df_features.fillna(0)
        raw_pred = float(self.model.predict(X)[0])
        
        # Clamp numerical risk score to 0-100%
        risk_score = round(max(0.0, min(100.0, raw_pred)), 2)
        
        # UI Presentation Mapping: Low Risk, Moderate Risk, High Risk, Critical Risk
        if risk_score <= 25.0:
            level = "Low Risk"
        elif risk_score <= 50.0:
            level = "Moderate Risk"
        elif risk_score <= 75.0:
            level = "High Risk"
        else:
            level = "Critical Risk"

        # 95% prediction interval
        rmse = float(self.metadata.get("metrics", {}).get("rmse", 5.0))
        lower_bound = round(max(0.0, risk_score - 1.96 * rmse), 2)
        upper_bound = round(min(100.0, risk_score + 1.96 * rmse), 2)

        top_factors = self.get_feature_importance(X, top_k=3)

        return {
            "risk_score": risk_score,
            "risk_level": level,
            "estimated_range": {
                "lower": lower_bound,
                "upper": upper_bound
            },
            "top_factors": top_factors
        }
