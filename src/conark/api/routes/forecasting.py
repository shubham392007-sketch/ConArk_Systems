"""
Cost and Schedule forecasting endpoints.
"""

from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.prediction import CostForecastResponse, TimeForecastResponse
from conark.api.dependencies import get_intelligence_engine
from conark.inference.predictor import ConstructionIntelligenceEngine

router = APIRouter(prefix="/forecast", tags=["Forecasting"])


@router.post("/cost", response_model=CostForecastResponse, summary="Forecast Cost Deviation")
def forecast_cost(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Forecast project cost deviation in dollars and budget status."""
    res = engine.run_intelligence(payload.model_dump())
    return res["ml_results"]["cost_forecast"]


@router.post("/time", response_model=TimeForecastResponse, summary="Forecast Schedule Deviation")
def forecast_time(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Forecast schedule deviation in days and schedule status."""
    res = engine.run_intelligence(payload.model_dump())
    return res["ml_results"]["time_forecast"]
