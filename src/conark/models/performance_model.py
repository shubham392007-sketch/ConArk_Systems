"""
Performance Prediction Model wrapper.
Multiclass classification: Poor, Average, Good, Excellent.
Standardized Inputs: temperature, humidity, vibration_level, material_usage, machinery_status, worker_count,
energy_consumption, task_progress, equipment_utilization_rate, safety_incidents, material_shortage_alert,
cost_deviation, time_deviation.
Target: performance_score (strictly excluded from inputs).
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
from conark.models.base import BaseModel
from conark.config.constants import PERFORMANCE_CLASSES

PERFORMANCE_FEATURE_NAMES = [
    "temperature", "humidity", "vibration_level", "material_usage", "machinery_status",
    "worker_count", "energy_consumption", "task_progress", "equipment_utilization_rate",
    "safety_incidents", "material_shortage_alert", "cost_deviation", "time_deviation"
]


class PerformanceModel(BaseModel):

    def __init__(self):
        super().__init__("performance")

    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        # Enforce exact feature mask (fallback to available features if model metadata features exist)
        target_features = [f for f in PERFORMANCE_FEATURE_NAMES if f in df_features.columns]
        if self.feature_names:
            target_features = [f for f in self.feature_names if f in df_features.columns and f != "performance_score"]

        X = df_features[target_features].fillna(0) if target_features else df_features.fillna(0)

        preds = self.model.predict(X)
        pred_label = str(preds[0])
        
        # Calculate class probabilities
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X)[0]
            classes = self.metadata.get("classes", PERFORMANCE_CLASSES)
            prob_dict = {cls_name: round(float(prob), 4) for cls_name, prob in zip(classes, probs)}
            confidence = round(float(np.max(probs)), 4)
        else:
            confidence = 1.0
            prob_dict = {cls_name: (1.0 if cls_name == pred_label else 0.0) for cls_name in PERFORMANCE_CLASSES}

        top_factors = self.get_feature_importance(X, top_k=3)

        return {
            "prediction": pred_label,
            "confidence": confidence,
            "probabilities": prob_dict,
            "top_factors": top_factors
        }
