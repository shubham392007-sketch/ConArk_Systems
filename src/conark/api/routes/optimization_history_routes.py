"""
Optimization History API routes for ConArk Systems.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status

from conark.api.dependencies import get_current_user
from conark.db.services.optimization_service import OptimizationService
from conark.utils.logging import get_logger

logger = get_logger("optimization_history_routes")
router = APIRouter(prefix="/optimization", tags=["Optimization History"])


@router.get("/history")
async def list_user_optimizations(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Lists saved optimization runs owned by the authenticated user."""
    items = OptimizationService.list_optimizations(
        user_id=current_user["id"],
        limit=limit,
        offset=offset
    )
    return {"items": items}


@router.get("/history/{opt_id}")
async def get_optimization_detail(
    opt_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves full details of a saved optimization run."""
    opt = OptimizationService.get_optimization(opt_id, current_user["id"])
    if not opt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Optimization record not found or unauthorized."
        )
    return opt


@router.delete("/history/{opt_id}")
async def delete_user_optimization(
    opt_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes an optimization record owned by the user."""
    success = OptimizationService.delete_optimization(opt_id, current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Optimization record not found or unauthorized."
        )
    return {"message": "Optimization record deleted successfully."}
