from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Response

from app.schemas.schemas import MemebershipMe, WorkspaceCreate, WorkspacePublic, WorkspaceUpdate, MembershipCreate, MembershipPublic
from app.dependencies import WorkspaceServiceDep, MembershipServiceDep
from app.services.workspaces import WorkspaceForbiddenError, WorkspaceNotFoundError
from app.services.memberships import LabelStaffProfileNotFoundError, MembershipForbiddenError, MembershipNotFoundError


router = APIRouter(tags=["Workspaces and Memberships"])

#TODO: Refactor error handling according to actual code 404 vs 403


# -------------------- Workspaces -----------------------------
@router.post("/workspaces", status_code=status.HTTP_201_CREATED, response_model=WorkspacePublic)
async def create_workspace(workspace_data: WorkspaceCreate,
                           workspace_service: WorkspaceServiceDep) -> WorkspacePublic:
    """Create new label"""
    new_workspace = await workspace_service.create_workspace(workspace_data)
    return new_workspace


@router.patch("/workspaces/{workspace_id}", status_code=status.HTTP_200_OK, response_model=WorkspacePublic)
async def update_workspace(workspace_data: WorkspaceUpdate,
                           workspace_id: UUID,
                           workspace_service: WorkspaceServiceDep) -> WorkspacePublic:
    """Update label data"""
    try:
        updated_workspace = await workspace_service.update_workspace(workspace_data, workspace_id)
        return updated_workspace
    except WorkspaceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except WorkspaceForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    

@router.delete("/workspaces/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(workspace_id: UUID, workspace_service: WorkspaceServiceDep) -> Response:
    """Delete label"""
    try:
        await workspace_service.delete_workspace(workspace_id)
        return Response(content=None, status_code=status.HTTP_204_NO_CONTENT)
    except WorkspaceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except WorkspaceForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/workspaces", status_code=status.HTTP_200_OK, response_model=list[WorkspacePublic])
async def list_workspaces(workspace_service: WorkspaceServiceDep) -> list[WorkspacePublic]:
    """Read labels associated with labelstaff profile"""
    workspaces = await workspace_service.list_workspaces()
    return workspaces




# -------------------- Memberships -----------------------------
@router.post("/workspaces/{workspace_id}/memberships/{labelstaff_profile_id}", status_code=status.HTTP_201_CREATED, response_model=MembershipPublic)
async def add_member(member_role: MembershipCreate,
                     workspace_id: UUID,
                     labelstaff_profile_id: UUID,
                     membership_service: MembershipServiceDep) -> MembershipPublic:
    """Add new member to label"""
    try:
        new_member = await membership_service.add_member(member_role, workspace_id, labelstaff_profile_id)
        return new_member
    except MembershipForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except LabelStaffProfileNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/workspaces/{workspace_id}/memberships/{labelstaff_profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member(workspace_id: UUID, labelstaff_profile_id: UUID, membership_service: MembershipServiceDep) -> Response:
    """Delete member from label"""
    try:
        await membership_service.delete_member(workspace_id, labelstaff_profile_id)
        return Response(content=None, status_code=status.HTTP_204_NO_CONTENT)
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except MembershipForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/workspaces/{workspace_id}/memberships/me", status_code=status.HTTP_200_OK, response_model=MemebershipMe)
async def get_my_membership(workspace_id: UUID, membership_service: MembershipServiceDep) -> MemebershipMe:
    """Read current user's membership (role) in this workspace."""
    membership = await membership_service.get_membership(workspace_id)
    if membership is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not a member of this workspace.")
    return membership


@router.get("/workspaces/{workspace_id}/memberships", status_code=status.HTTP_200_OK, response_model=list[MembershipPublic])
async def list_memberships(workspace_id: UUID, membership_service: MembershipServiceDep) -> list[MembershipPublic]:
    """List all memberships in this workspace."""
    memberships = await membership_service.list_memberships(workspace_id)
    return memberships