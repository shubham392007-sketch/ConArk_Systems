"""
Performance Prediction Model wrapper.
Multiclass classification: Poor, Average, Good, Excellent.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from conark.models.base import BaseModel
from conark.config.constants import PERFORMANCE_CLASSES


class PerformanceModel(BaseModel):

    def __init__(self):
        super().__init__("performance")

    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load()

        X = (df_features[self.feature_names] if self.feature_names else df_features).fillna(0)
        
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
