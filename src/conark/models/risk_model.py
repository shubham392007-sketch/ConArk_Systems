"""
Risk Prediction Model wrapper.
Regression for risk_score (0-100) and risk level assignment.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel


class RiskModel(BaseModel):

    def __init__(self):
        super().__init__("risk")

    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        X = (df_features[self.feature_names] if self.feature_names else df_features).fillna(0)
        raw_pred = float(self.model.predict(X)[0])
        
        # Clamp presented value to 0-100
        risk_score = round(max(0.0, min(100.0, raw_pred)), 2)
        
        # Determine Risk Level
        if risk_score <= 25.0:
            level = "Low"
        elif risk_score <= 50.0:
            level = "Moderate"
        elif risk_score <= 75.0:
            level = "High"
        else:
            level = "Critical"

        # Estimated prediction interval based on model training RMSE
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
