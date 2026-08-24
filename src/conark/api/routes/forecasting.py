"""
Cost and Schedule forecasting endpoints.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.prediction import CostForecastResponse, TimeForecastResponse
from conark.api.dependencies import get_intelligence_engine, get_optional_user
from conark.db.services.prediction_service import PredictionService
from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.utils.logging import get_logger

logger = get_logger("forecasting_routes")
router = APIRouter(prefix="/forecast", tags=["Forecasting"])


@router.post("/cost", response_model=CostForecastResponse, summary="Forecast Cost Deviation")
def forecast_cost(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Forecast project cost deviation in dollars and budget status."""
    res = engine.run_intelligence(payload.model_dump())
    cost_res = res["ml_results"]["cost_forecast"]
    if current_user and current_user.get("id"):
        try:
            PredictionService.save_prediction(
                user_id=current_user["id"],
                model_name="cost_prediction",
                model_version="v1.0.0",
                prediction_type="regression",
                input_data=payload.model_dump(),
                prediction_output=cost_res,
                confidence_score=92.0,
                project_id=payload.project_id
            )
        except Exception as err:
            logger.warning(f"Failed to persist cost forecast: {err}")
    return cost_res


@router.post("/time", response_model=TimeForecastResponse, summary="Forecast Schedule Deviation")
def forecast_time(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Forecast schedule deviation in days and schedule status."""
    res = engine.run_intelligence(payload.model_dump())
    time_res = res["ml_results"]["time_forecast"]
    if current_user and current_user.get("id"):
        try:
            PredictionService.save_prediction(
                user_id=current_user["id"],
                model_name="time_prediction",
                model_version="v1.0.0",
                prediction_type="regression",
                input_data=payload.model_dump(),
                prediction_output=time_res,
                confidence_score=94.0,
                project_id=payload.project_id
            )
        except Exception as err:
            logger.warning(f"Failed to persist time forecast: {err}")
    return time_res
