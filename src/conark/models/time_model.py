"""
Time / Schedule Forecasting Model wrapper.
Regression for time_deviation (in days) and schedule status assignment.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel


class TimeModel(BaseModel):

    def __init__(self):
        super().__init__("time")

    def predict(self, df_features: pd.DataFrame, on_schedule_tolerance: float = 0.5) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        X = (df_features[self.feature_names] if self.feature_names else df_features).fillna(0)
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
