"""
FastAPI route for Space Optimization Engine.
Provides POST /api/v1/space/optimize endpoint.
"""

from fastapi import APIRouter, HTTPException, status
from conark.space.schemas import SpaceOptimizationInput, SpaceOptimizationResponse
from conark.space.space_service import SpaceOptimizationService

router = APIRouter(prefix="/space", tags=["Space Optimization Engine"])
space_service = SpaceOptimizationService()


@router.post(
    "/optimize",
    response_model=SpaceOptimizationResponse,
    summary="Optimize Construction-Site Space Allocation",
    description="Determines mathematical constrained space allocation for 8 operational site zones and generates Gemini 2.5 Flash AI explanations."
)
async def optimize_space(payload: SpaceOptimizationInput):
    """
    POST /api/v1/space/optimize
    Accepts construction-site operational parameters, executes SciPy constrained optimization,
    calculates metrics and safety constraints, and returns structured allocation response.
    """
    try:
        response = await space_service.optimize_space_layout(payload)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Space optimization failed: {str(e)}"
        )
