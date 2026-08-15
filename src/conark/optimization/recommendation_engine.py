"""
Recommendation Engine service combining ML model outputs with supporting factor analysis.
"""

from typing import Dict, Any
import pandas as pd
from conark.models.optimization_model import OptimizationModel


class RecommendationEngine:
    """Generates optimization recommendation with independent supporting factors."""

    def __init__(self):
        self.model = OptimizationModel()

    def generate_recommendation(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        """Runs optimization model inference and attaches supporting factors."""
        return self.model.predict(df_features)
