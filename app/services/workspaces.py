from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import Workspace
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
        return new_workspace


    async def update_workspace():
        pass


    async def delete_workspace():
        pass


    async def list_workspaces():
        pass