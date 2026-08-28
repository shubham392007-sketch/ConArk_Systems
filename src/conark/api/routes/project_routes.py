"""
Project Workspace API routes for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from conark.api.dependencies import get_current_user
from conark.db.services.project_service import ProjectService
from conark.utils.logging import get_logger

logger = get_logger("project_routes")
router = APIRouter(prefix="/projects", tags=["Project Workspaces"])

class ProjectCreateRequest(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = Field(default="", max_length=1000)
    project_type: Optional[str] = Field(default="Commercial Infrastructure", max_length=100)
    location: Optional[str] = Field(default="", max_length=200)
    status: Optional[str] = Field(default="Active", max_length=50)

class ProjectUpdateRequest(BaseModel):
    project_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    description: Optional[str] = Field(default=None, max_length=1000)
    project_type: Optional[str] = Field(default=None, max_length=100)
    location: Optional[str] = Field(default=None, max_length=200)
    status: Optional[str] = Field(default=None, max_length=50)


@router.get("")
async def list_user_projects(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lists all projects owned by the authenticated user."""
    projects = ProjectService.list_projects(current_user["id"])
    return {"projects": projects}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_new_project(
    request: ProjectCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Creates a new project for the authenticated user."""
    project = ProjectService.create_project(current_user["id"], request.model_dump())
    if not project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create project workspace. Please verify your connection."
        )
    return project


@router.get("/{project_id}")
async def get_project_details(
    project_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves single project details owned by the authenticated user."""
    project = ProjectService.get_project(project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or unauthorized."
        )
    return project


@router.put("/{project_id}")
async def update_existing_project(
    project_id: str,
    request: ProjectUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Updates a project owned by the authenticated user."""
    updated = ProjectService.update_project(project_id, current_user["id"], request.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or unauthorized."
        )
    return updated


@router.delete("/{project_id}")
async def delete_user_project(
    project_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes a project owned by the authenticated user."""
    success = ProjectService.delete_project(project_id, current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or unauthorized."
        )
    return {"message": "Project deleted successfully."}
