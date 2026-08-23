"""
Authentication and Profile API routes for ConArk Systems.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from conark.api.dependencies import get_current_user
from conark.db.services.profile_service import ProfileService
from conark.utils.logging import get_logger

logger = get_logger("auth_routes")
router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

class ProfileUpdateRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    organization: str = Field(default="", max_length=100)
    role: str = Field(default="Site Engineer", max_length=100)
    avatar_url: str = Field(default="", max_length=500)


@router.get("/me")
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Returns the authenticated user's profile information."""
    profile = ProfileService.get_profile(current_user["id"])
    if not profile:
        # Fallback profile from user metadata if table trigger hasn't synced yet
        return {
            "id": current_user["id"],
            "email": current_user.get("email", ""),
            "full_name": current_user.get("user_metadata", {}).get("full_name", ""),
            "organization": current_user.get("user_metadata", {}).get("organization", ""),
            "role": current_user.get("user_metadata", {}).get("role", "Site Engineer"),
            "avatar_url": ""
        }
    return profile


@router.put("/profile")
async def update_my_profile(
    request: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Updates profile information for the authenticated user."""
    updated = ProfileService.update_profile(current_user["id"], request.model_dump())
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not update profile."
        )
    return updated


@router.delete("/account")
async def delete_my_account(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Permanently deletes the authenticated user's profile and all associated data."""
    success = ProfileService.delete_account(current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete account."
        )
    return {"message": "Account and all associated project data have been permanently deleted."}
