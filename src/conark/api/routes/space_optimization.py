from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from conark.space.schemas import SpaceOptimizationInput, SpaceOptimizationResponse
from conark.space.space_service import SpaceOptimizationService
from conark.api.dependencies import get_optional_user
from conark.db.services.optimization_service import OptimizationService
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
                OptimizationService.save_optimization(
                    user_id=current_user["id"],
                    optimization_type="space_layout",
                    input_data=payload.model_dump(),
                    result=response.model_dump(),
                    constraints={"site_area_sqm": payload.site_area_sqm, "safety_buffer": payload.safety_buffer_pct},
                    recommendations=response.gemini_report.recommended_actions if response.gemini_report else []
                )
                logger.info(f"Persisted space optimization for user {current_user['id']}")
            except Exception as save_err:
                logger.warning(f"Could not persist space optimization to Supabase: {save_err}")

        return response
    except Exception as e:
        logger.error(f"Space optimization error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Space optimization failed: {str(e)}"
        )

