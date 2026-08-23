"""
User Dashboard Analytics API routes for ConArk Systems.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends

from conark.api.dependencies import get_current_user
from conark.db.services.analytics_service import AnalyticsService
from conark.utils.logging import get_logger

logger = get_logger("analytics_routes")
router = APIRouter(prefix="/analytics", tags=["Analytics & Dashboard"])


@router.get("/dashboard")
async def get_dashboard_analytics(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Returns aggregated metrics and charts based strictly on the authenticated user's records."""
    return AnalyticsService.get_user_analytics(current_user["id"])
