"""
Cost Forecasting Model wrapper.
Regression for cost_deviation and budget status classification.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel


class CostModel(BaseModel):

    def __init__(self):
        super().__init__("cost")

    def predict(self, df_features: pd.DataFrame, on_budget_tolerance: float = 100.0) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        X = (df_features[self.feature_names] if self.feature_names else df_features).fillna(0)
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
