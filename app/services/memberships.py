from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import Workspace
from app.schemas.schemas import WorkspaceCreate, WorkspaceUpdate


class MembershipService:
    def __init__(self, session: AsyncSession, labelstaff_profile_id: UUID):
        self.session = session
        self.labelstaff_profile_id = labelstaff_profile_id

    
    async def add_member():
        pass


    async def delete_member():
        pass
