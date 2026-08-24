"""
Performance and Risk prediction endpoints.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.prediction import PerformancePredictionResponse, RiskPredictionResponse
from conark.api.dependencies import get_intelligence_engine, get_optional_user
from conark.db.services.prediction_service import PredictionService
from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.utils.logging import get_logger

logger = get_logger("prediction_routes")
router = APIRouter(prefix="/predict", tags=["Predictions"])


@router.post("/performance", response_model=PerformancePredictionResponse, summary="Predict Performance Score")
def predict_performance(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Predict multiclass construction performance (Poor, Average, Good, Excellent)."""
    res = engine.run_intelligence(payload.model_dump())
    perf = res["ml_results"]["performance"]
    if current_user and current_user.get("id"):
        try:
            PredictionService.save_prediction(
                user_id=current_user["id"],
                model_name="performance_intelligence",
                model_version="v1.0.0",
                prediction_type="classification",
                input_data=payload.model_dump(),
                prediction_output=perf,
                confidence_score=perf.get("confidence", 0.0) * 100 if isinstance(perf.get("confidence"), (int, float)) else None,
                project_id=payload.project_id
            )
        except Exception as err:
            logger.warning(f"Failed to persist performance prediction: {err}")
    return perf


@router.post("/risk", response_model=RiskPredictionResponse, summary="Predict Construction Risk Score")
def predict_risk(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Predict risk score (0-100) and risk level."""
    res = engine.run_intelligence(payload.model_dump())
    risk = res["ml_results"]["risk"]
    if current_user and current_user.get("id"):
        try:
            PredictionService.save_prediction(
                user_id=current_user["id"],
                model_name="risk_intelligence",
                model_version="v1.0.0",
                prediction_type="regression",
                input_data=payload.model_dump(),
                prediction_output=risk,
                confidence_score=risk.get("risk_score"),
                project_id=payload.project_id
            )
        except Exception as err:
            logger.warning(f"Failed to persist risk prediction: {err}")
    return risk
