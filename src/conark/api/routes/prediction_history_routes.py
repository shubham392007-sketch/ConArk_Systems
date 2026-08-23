"""
Model Prediction History API routes for ConArk Systems.
"""
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from conark.api.dependencies import get_current_user
from conark.db.services.prediction_service import PredictionService
from conark.utils.logging import get_logger

logger = get_logger("prediction_history_routes")
router = APIRouter(prefix="/predictions", tags=["Prediction History"])


@router.get("")
async def list_user_predictions(
    model_name: Optional[str] = Query(None, description="Filter by model name"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Lists saved predictions owned by the authenticated user with optional filtering and pagination."""
    return PredictionService.list_predictions(
        user_id=current_user["id"],
        model_name=model_name,
        project_id=project_id,
        limit=limit,
        offset=offset
    )


@router.get("/{prediction_id}")
async def get_prediction_detail(
    prediction_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves full prediction details including inputs, outputs, SHAP, and Gemini explanation."""
    prediction = PredictionService.get_prediction(prediction_id, current_user["id"])
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found or unauthorized."
        )
    return prediction


@router.delete("/{prediction_id}")
async def delete_user_prediction(
    prediction_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes a prediction record owned by the authenticated user."""
    success = PredictionService.delete_prediction(prediction_id, current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found or unauthorized."
        )
    return {"message": "Prediction record deleted successfully."}
