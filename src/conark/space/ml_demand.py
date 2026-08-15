"""
Optional ML Space Demand Forecasting Model wrapper.
Predicts total required site space (sqm) based on operational features.
Falls back seamlessly to deterministic demand estimator if ML artifact is unbuilt.
"""

from typing import Dict, Any, Optional
from pathlib import Path
import joblib
import pandas as pd
from conark.config.settings import settings
from conark.space.schemas import SpaceOptimizationInput
from conark.space.demand_estimator import SpaceDemandEstimator
from conark.utils.logging import get_logger

logger = get_logger("ml_space_demand")


class SpaceDemandPredictor:
    """Predicts total required space demand using ML or deterministic fallback."""

    def __init__(self, model_dir: Optional[Path] = None):
        self.model_dir = model_dir or (settings.MODEL_DIR / "space_demand")
        self.model_path = self.model_dir / "model.joblib"
        self.model = None
        self.deterministic_estimator = SpaceDemandEstimator()
        self._try_load()

    def _try_load(self) -> None:
        """Loads trained ML space demand model if available."""
        if self.model_path.exists():
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Loaded ML Space Demand Model from {self.model_path}")
            except Exception as e:
                logger.warning(f"Could not load ML Space Demand Model: {e}. Using deterministic estimator.")
                self.model = None

    def is_available(self) -> bool:
        return self.model is not None

    def predict_total_demand_sqm(self, input_data: SpaceOptimizationInput) -> float:
        """
        Returns estimated total required site space (sqm).
        Uses ML model if available; otherwise uses deterministic demand calculation.
        """
        deterministic_result = self.deterministic_estimator.estimate_demand(input_data)
        deterministic_total = deterministic_result["total_required_sqm"]

        if not self.is_available():
            return deterministic_total

        try:
            # Build feature vector for ML model
            feature_row = {
                "material_quantity_kg": input_data.material_quantity_kg,
                "worker_count": input_data.worker_count,
                "machinery_count": input_data.machinery_count,
                "heavy_machinery_count": input_data.heavy_machinery_count,
                "daily_truck_count": input_data.daily_truck_count,
                "waste_generation_kg_per_day": input_data.waste_generation_kg_per_day,
                "equipment_utilization_rate": input_data.equipment_utilization_rate,
                "task_progress": input_data.task_progress,
                "risk_score": input_data.risk_score,
            }
            df_feat = pd.DataFrame([feature_row])
            ml_pred = float(self.model.predict(df_feat)[0])
            logger.info(f"ML predicted space demand: {ml_pred:.1f} sqm (Deterministic: {deterministic_total:.1f} sqm)")
            return round(ml_pred, 2)
        except Exception as e:
            logger.warning(f"ML space demand prediction failed: {e}. Falling back to deterministic total.")
            return deterministic_total
