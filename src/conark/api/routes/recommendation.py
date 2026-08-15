"""
Optimization recommendation endpoint.
"""

from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.prediction import OptimizationResponse
from conark.api.dependencies import get_intelligence_engine
from conark.inference.predictor import ConstructionIntelligenceEngine

router = APIRouter(tags=["Optimization"])


@router.post("/recommendation", response_model=OptimizationResponse, summary="Get Optimization Recommendation")
def get_recommendation(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Predict optimization suggestion with deterministic supporting factors."""
    res = engine.run_intelligence(payload.model_dump())
    return res["ml_results"]["optimization"]
