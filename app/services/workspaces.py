from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import Workspace, Membership
from app.schemas.schemas import WorkspaceCreate, WorkspaceUpdate


class WorkspaceNotFoundError(Exception):
    """Raise when workspace couldn't be found."""
    pass


class WorkspaceForbiddenError(Exception):
    """Raise when permission is denied to workspace."""
    pass


class WorkspaceService:
    def __init__(self, session: AsyncSession, labelstaff_profile_id: UUID):
        self.session = session
        self.labelstaff_profile_id = labelstaff_profile_id

    
    async def create_workspace(self, workspace_data: WorkspaceCreate) -> Workspace:
        new_workspace = Workspace(name=workspace_data.name)

        self.session.add(new_workspace)
        await self.session.commit()
        await self.session.refresh(new_workspace)
        new_admin_membership = Membership(labelstaff_profile_id=self.labelstaff_profile_id,
                                          workspace_id=new_workspace.id,
                                          role="admin")
        self.session.add(new_admin_membership)
        await self.session.commit()
        return new_workspace


    async def update_workspace(self, workspace_data: WorkspaceUpdate, workspace_id: UUID) -> Workspace:
        await self._check_admin(workspace_id)
        result = await self.session.execute(select(Workspace).where(Workspace.id == workspace_id))
        workspace = result.scalar_one_or_none()

        if not workspace:
            raise WorkspaceNotFoundError("Could not find workspace.")
        
        update_data = workspace_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(workspace, key, value)
        
        await self.session.commit()
        await self.session.refresh(workspace)
        return workspace


    async def delete_workspace(self, workspace_id: UUID) -> None:
        await self._check_admin(workspace_id)
        result = await self.session.execute(select(Workspace).where(
            Workspace.id == workspace_id
        ))
        workspace = result.scalar_one_or_none()

        if not workspace:
            raise WorkspaceNotFoundError("Workspace not found.")
        self.session.delete(workspace)
        await self.session.commit()


    async def list_workspaces(self) -> list[Workspace]:
        stmt = (
            select(Workspace)
            .join(Membership, Membership.workspace_id == Workspace.id)
            .where(Membership.labelstaff_profile_id == self.labelstaff_profile_id)
            .options(selectinload(Workspace.memberships))
        )

        result = await self.session.execute(stmt)
        workspaces = result.scalars().unique().all()
        return workspaces
    

    async def _check_admin(self, workspace_id: UUID) -> None:
        result = await self.session.execute(select(Membership).where(
            Membership.workspace_id == workspace_id,
            Membership.labelstaff_profile_id == self.labelstaff_profile_id,
            Membership.role == "admin"
        ))
        membership = result.scalar_one_or_none()

        if not membership:
            raise WorkspaceForbiddenError("User is not the admin of this workspace.")