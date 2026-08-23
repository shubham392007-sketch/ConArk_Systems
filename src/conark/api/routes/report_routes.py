"""
Saved Reports API routes for ConArk Systems.
"""
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from conark.api.dependencies import get_current_user
from conark.db.services.report_service import ReportService
from conark.utils.logging import get_logger

logger = get_logger("report_routes")
router = APIRouter(prefix="/reports", tags=["Saved Reports"])

class ReportSaveRequest(BaseModel):
    report_name: str = Field(..., min_length=1, max_length=200)
    report_type: str = Field(default="Model Prediction Report", max_length=100)
    file_path: Optional[str] = Field(default=None, max_length=500)
    project_id: Optional[str] = None
    prediction_id: Optional[str] = None


@router.get("")
async def list_user_reports(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lists saved PDF reports owned by the authenticated user."""
    reports = ReportService.list_reports(current_user["id"])
    return {"reports": reports}


@router.post("", status_code=status.HTTP_201_CREATED)
async def save_new_report(
    request: ReportSaveRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Saves metadata for a generated PDF report."""
    report = ReportService.save_report(
        user_id=current_user["id"],
        report_name=request.report_name,
        report_type=request.report_type,
        file_path=request.file_path,
        project_id=request.project_id,
        prediction_id=request.prediction_id
    )
    return report


@router.delete("/{report_id}")
async def delete_user_report(
    report_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes a saved report record."""
    success = ReportService.delete_report(report_id, current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found or unauthorized."
        )
    return {"message": "Report deleted successfully."}
