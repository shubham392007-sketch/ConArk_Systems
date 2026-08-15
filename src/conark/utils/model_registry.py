"""
Model registry utility for tracking, loading, and inspecting saved models and metadata.
"""

import json
from typing import Dict, Any, Optional
from pathlib import Path
import joblib
from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("model_registry")


class ModelRegistry:
    """Manages model metadata and serialized artifacts."""

    def __init__(self, model_dir: Optional[Path] = None):
        self.model_dir = model_dir or settings.MODEL_DIR

    def get_model_path(self, model_name: str) -> Path:
        return self.model_dir / model_name / "model.joblib"

    def get_metadata_path(self, model_name: str) -> Path:
        return self.model_dir / model_name / "metadata.json"

    def save_model(self, model_name: str, model_artifact: Any, metadata: Dict[str, Any]) -> None:
        target_dir = self.model_dir / model_name
        target_dir.mkdir(parents=True, exist_ok=True)

        joblib_path = target_dir / "model.joblib"
        metadata_path = target_dir / "metadata.json"

        joblib.dump(model_artifact, joblib_path)
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        logger.info(f"Saved model {model_name} version {metadata.get('version', '1.0.0')} to {joblib_path}")

    def load_model(self, model_name: str) -> Any:
        path = self.get_model_path(model_name)
        if not path.exists():
            raise FileNotFoundError(f"Model file not found for {model_name} at {path}")
        return joblib.load(path)

    def load_metadata(self, model_name: str) -> Dict[str, Any]:
        path = self.get_metadata_path(model_name)
        if not path.exists():
            raise FileNotFoundError(f"Metadata file not found for {model_name} at {path}")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def list_models(self) -> Dict[str, Dict[str, Any]]:
        models = {}
        for model_name in ["performance", "risk", "cost", "time", "optimization"]:
            try:
                meta = self.load_metadata(model_name)
                models[model_name] = meta
            except Exception:
                models[model_name] = {"status": "not_trained"}
        return models
