"""
Base wrapper class for ConArk ML models.
Provides unified prediction, explainability, and metadata management interfaces.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
from conark.utils.model_registry import ModelRegistry
from conark.utils.logging import get_logger

logger = get_logger("base_model")


class BaseModel(ABC):
    """Abstract base class for ConArk model wrappers."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.registry = ModelRegistry()
        self.model = None
        self.metadata = {}
        self.feature_names = []

    def load(self) -> None:
        """Load trained model artifact and metadata from model registry."""
        self.model = self.registry.load_model(self.model_name)
        self.metadata = self.registry.load_metadata(self.model_name)
        self.feature_names = self.metadata.get("features", [])
        logger.info(f"Loaded {self.model_name} version {self.metadata.get('version', '1.0.0')}")

    @abstractmethod
    def predict(self, df_features: pd.DataFrame) -> Dict[str, Any]:
        """Perform model inference on preprocessed features DataFrame."""
        pass

    def get_feature_importance(self, df_features: pd.DataFrame, top_k: int = 5) -> List[Dict[str, Any]]:
        """Calculate top feature importance factors."""
        if self.model is None:
            return []
            
        raw_model = getattr(self.model, "raw_model", self.model)
        importances = getattr(raw_model, "feature_importances_", None)
        if importances is None:
            return []
            
        features = self.feature_names or list(df_features.columns)
        if len(importances) != len(features):
            return []

        sorted_indices = np.argsort(importances)[::-1][:top_k]
        
        factors = []
        for idx in sorted_indices:
            feat_name = features[idx]
            imp_val = float(importances[idx])
            factors.append({
                "feature": feat_name,
                "importance": round(imp_val, 4),
            })
            
        return factors
