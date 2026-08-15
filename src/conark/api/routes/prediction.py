"""
Performance and Risk prediction endpoints.
"""

from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.prediction import PerformancePredictionResponse, RiskPredictionResponse
from conark.api.dependencies import get_intelligence_engine
from conark.inference.predictor import ConstructionIntelligenceEngine

router = APIRouter(prefix="/predict", tags=["Predictions"])


@router.post("/performance", response_model=PerformancePredictionResponse, summary="Predict Performance Score")
def predict_performance(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Predict multiclass construction performance (Poor, Average, Good, Excellent)."""
    res = engine.run_intelligence(payload.model_dump())
    return res["ml_results"]["performance"]


@router.post("/risk", response_model=RiskPredictionResponse, summary="Predict Construction Risk Score")
def predict_risk(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Predict risk score (0-100) and risk level."""
    res = engine.run_intelligence(payload.model_dump())
    return res["ml_results"]["risk"]
