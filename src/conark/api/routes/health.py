"""
Health check and model metrics endpoints.
"""

from fastapi import APIRouter
from conark.utils.model_registry import ModelRegistry

router = APIRouter(tags=["Health & Status"])


@router.get("/health", summary="System Health Check")
def health_check():
    """Returns application health status and version."""
    return {
        "status": "healthy",
        "system": "ConArk Systems",
        "version": "1.0.0"
    }


@router.get("/models", summary="List Model Registries")
def list_models():
    """Returns status and version of all saved ML models."""
    registry = ModelRegistry()
    return registry.list_models()


@router.get("/model-metrics", summary="Get Model Training Metrics")
def get_model_metrics():
    """Returns comprehensive evaluation metrics for all 5 trained models."""
    registry = ModelRegistry()
    metrics = {}
    for name in ["performance", "risk", "cost", "time", "optimization"]:
        try:
            meta = registry.load_metadata(name)
            metrics[name] = {
                "algorithm": meta.get("algorithm"),
                "version": meta.get("version"),
                "trained_at": meta.get("trained_at"),
                "metrics": meta.get("metrics")
            }
        except Exception:
            metrics[name] = {"status": "not_trained"}
    return metrics
