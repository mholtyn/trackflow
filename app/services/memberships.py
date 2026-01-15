from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.models.models import Membership
from app.schemas.schemas import MembershipCreate


class MembershipNotFoundError(Exception):
    """Raise when membership couldn't be found."""
    pass


class MembershipService:
    def __init__(self, session: AsyncSession, labelstaff_profile_id: UUID):
        self.session = session
        self.labelstaff_profile_id = labelstaff_profile_id


    async def get_membership(self, workspace_id: UUID) -> Membership:
        result = await self.session.execute(select(Membership).where(
            Membership.labelstaff_profile_id == self.labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))

        membership = result.scalar_one_or_none()

        if not membership:
            raise MembershipNotFoundError("Membership not found.")
        
        return membership


    async def add_member(self, membership_data: MembershipCreate, workspace_id: UUID, labelstaff_profile_id: UUID) -> Membership:
        """Here labelstaff_profile_id points not to self (the admin) but to the member to be added."""
        new_member = Membership(role=membership_data.role,
                                labelstaff_profile_id=labelstaff_profile_id,
                                workspace_id=workspace_id)

        self.session.add(new_member)
        await self.session.commit()
        await self.session.refresh(new_member)

        return new_member


    async def delete_member(self, workspace_id: UUID, labelstaff_profile_id: UUID) -> None:
        """Here labelstaff_profile_id points not to self (the admin) but to the member to be deleted."""
        await self.session.execute(delete(Membership).where(
            Membership.labelstaff_profile_id == labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))

        await self.session.commit()
