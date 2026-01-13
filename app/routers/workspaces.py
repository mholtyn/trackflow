from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Depends, Response

from app.schemas.schemas import WorkspaceCreate, WorkspacePublic, WorkspaceUpdate, MembershipCreate, MembershipPublic
from app.depedencies import WorkspaceServiceDep, MembershipServiceDep
from app.services.workspaces import WorkspaceForbiddenError, WorkspaceNotFoundError


router = APIRouter(tags=["Workspaces"])


# -------------------- Workspaces -----------------------------
@router.post("/workspaces", status_code=status.HTTP_201_CREATED, response_model=WorkspacePublic)
async def create_workspace(workspace_data: WorkspaceCreate,
                           workspace_service: WorkspaceServiceDep) -> WorkspacePublic:
    new_workspace = await workspace_service.create_workspace()
    return new_workspace


@router.patch("/workspaces/{workspace_id}", status_code=status.HTTP_200_OK, response_model=WorkspacePublic)
async def update_workspace(workspace_data: WorkspaceUpdate,
                           workspace_id: UUID,
                           workspace_service: WorkspaceServiceDep) -> WorkspacePublic:
    try:
        updated_workspace = await workspace_service.update_workspace()
        return updated_workspace
    except WorkspaceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except WorkspaceForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    

@router.delete("/workspaces/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(workspace_id: UUID, workspace_service: WorkspaceServiceDep) -> Response:
    try:
        await workspace_service.delete_workspace()
        return Response(content=None, status_code=status.HTTP_404_NOT_FOUND)
    except WorkspaceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except WorkspaceForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/workspaces", status_code=status.HTTP_200_OK, response_model=list[WorkspacePublic])
async def list_workspaces(workspace_service: WorkspaceServiceDep) -> list[WorkspacePublic]:
    workspaces = await workspace_service.list_workspaces()
    return workspaces




# -------------------- Memberships -----------------------------
@router.post("/memberships", status_code=status.HTTP_201_CREATED)
async def add_member(member_role: MembershipCreate,
                     membership_service: MembershipServiceDep) -> MembershipPublic:
    pass


@router.delete("/memberships/{labelstaff_profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member(membership_service: MembershipServiceDep) -> Response:
    pass