from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from conark.space.schemas import SpaceOptimizationInput, SpaceOptimizationResponse
from conark.space.space_service import SpaceOptimizationService
from conark.api.dependencies import get_optional_user
from conark.db.services.optimization_service import OptimizationService
from conark.db.services.prediction_service import PredictionService
from conark.utils.logging import get_logger

logger = get_logger("space_optimization_route")
router = APIRouter(prefix="/space", tags=["Space Optimization Engine"])
space_service = SpaceOptimizationService()


@router.post(
    "/optimize",
    response_model=SpaceOptimizationResponse,
    summary="Optimize Construction-Site Space Allocation",
    description="Determines mathematical constrained space allocation for 8 operational site zones and generates Gemini 2.5 Flash AI explanations."
)
async def optimize_space(
    payload: SpaceOptimizationInput,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    POST /api/v1/space/optimize
    Accepts construction-site operational parameters, executes SciPy constrained optimization,
    calculates metrics and safety constraints, and returns structured allocation response.
    Persists results to Supabase if user is authenticated.
    """
    try:
        response = await space_service.optimize_space_layout(payload)

        if current_user and current_user.get("id"):
            try:
                # 1. Save to optimization_results
                recs = []
                if response.gemini_report and isinstance(response.gemini_report, dict):
                    recs = response.gemini_report.get("recommended_actions", [])
                OptimizationService.save_optimization(
                    user_id=current_user["id"],
                    optimization_type="space_layout",
                    input_data=payload.model_dump(),
                    result=response.model_dump(),
                    constraints={"site_area_sqm": payload.site_area_sqm},
                    recommendations=recs,
                    project_id=payload.project_id
                )

                # 2. Save to model_predictions so it appears in Prediction History and Workspace
                explanation_str = None
                if response.gemini_report and isinstance(response.gemini_report, dict):
                    explanation_str = response.gemini_report.get("summary") or response.gemini_report.get("layout_explanation")
                PredictionService.save_prediction(
                    user_id=current_user["id"],
                    model_name="space_optimizer",
                    model_version="v1.0.0",
                    prediction_type="spatial_optimization",
                    input_data=payload.model_dump(),
                    prediction_output=response.model_dump(),
                    explanation=explanation_str,
                    confidence_score=response.metrics.space_efficiency_score if response.metrics else 90.0,
                    project_id=payload.project_id
                )
                logger.info(f"Persisted space optimization and prediction for user {current_user['id']}")
            except Exception as save_err:
                logger.warning(f"Could not persist space optimization to Supabase: {save_err}")

        return response
    except Exception as e:
        logger.error(f"Space optimization error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Space optimization failed: {str(e)}"
        )

