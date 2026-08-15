"""
Optimization Recommendation Model wrapper.
Multiclass classification for optimization_suggestion with deterministic supporting factors extraction.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
from conark.models.base import BaseModel
from conark.config.constants import OPTIMIZATION_CLASSES


class OptimizationModel(BaseModel):

    def __init__(self):
        super().__init__("optimization")

    def derive_supporting_factors(self, df_features: pd.DataFrame, recommendation: str) -> List[str]:
        """Derives deterministic supporting factors from operational feature values."""
        row = df_features.iloc[0]
        factors = []
        
        vib = float(row.get("vibration_level", 0))
        util = float(row.get("equipment_utilization_rate", 0))
        energy = float(row.get("energy_consumption", 0))
        mat = float(row.get("material_usage", 0))
        workers = float(row.get("worker_count", 0))
        safety = float(row.get("safety_incidents", 0))
        time_dev = float(row.get("time_deviation", 0))
        mat_alert = float(row.get("material_shortage_alert", 0))

        if recommendation == "Increase Machinery Efficiency":
            if util > 80.0:
                factors.append("High equipment utilization rate")
            if vib > 25.0:
                factors.append("Elevated machinery vibration level")
            if energy > 300.0:
                factors.append("High energy consumption")
            if not factors:
                factors.append("Machinery operating near capacity limits")

        elif recommendation == "Optimize Material Usage":
            if mat_alert == 1:
                factors.append("Material shortage alert triggered")
            if mat > 750.0:
                factors.append("Elevated material consumption rate")
            if not factors:
                factors.append("Material buffer below optimal threshold")

        elif recommendation == "Reallocate Workers":
            if workers < 20:
                factors.append("Sub-optimal worker count on active tasks")
            if not factors:
                factors.append("Worker distribution mismatch across site tasks")

        elif recommendation == "Adjust Schedule":
            if time_dev > 2.0:
                factors.append("Project schedule lagging target timeline")
            if not factors:
                factors.append("Milestone progress behind schedule")

        elif recommendation == "Enhance Safety Measures":
            if safety > 0:
                factors.append(f"{int(safety)} safety incident(s) recorded")
            if vib > 30.0:
                factors.append("Hazardous machinery vibration level")
            if not factors:
                factors.append("Operational safety metrics require review")

        return factors

    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        X = (df_features[self.feature_names] if self.feature_names else df_features).fillna(0)
        preds = self.model.predict(X)
        recommendation = str(preds[0])
        
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X)[0]
            confidence = round(float(np.max(probs)), 4)
        else:
            confidence = 0.85

        supporting_factors = self.derive_supporting_factors(df_features, recommendation)
        top_factors = self.get_feature_importance(X, top_k=3)

        return {
            "recommendation": recommendation,
            "confidence": confidence,
            "supporting_factors": supporting_factors,
            "top_factors": top_factors
        }
