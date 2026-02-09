from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select

from app.models.models import LabelStaffProfile, Membership
from app.schemas.schemas import MembershipCreate


class MembershipNotFoundError(Exception):
    """Raise when membership couldn't be found."""
    pass


class MembershipForbiddenError(Exception):
    """Raise when member cannot perform action."""
    pass


class LabelStaffProfileNotFoundError(Exception):
    """Raise when the given label staff profile does not exist."""
    pass


class MembershipService:
    def __init__(self, session: AsyncSession, labelstaff_profile_id: UUID):
        self.session = session
        self.labelstaff_profile_id = labelstaff_profile_id


    async def _ensure_admin(self, workspace_id: UUID) -> None:
        result = await self.session.execute(select(Membership).where(
            Membership.labelstaff_profile_id == self.labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))

        membership = result.scalar_one_or_none()

        if not membership:
            raise MembershipForbiddenError("Only label admins can edit memberships.")
        
        if membership.role != "admin":
            raise MembershipForbiddenError("Only label admins can edit memberships.")


    async def add_member(self, membership_data: MembershipCreate, workspace_id: UUID, labelstaff_profile_id: UUID) -> Membership:
        """Here labelstaff_profile_id points not to self (the admin) but to the member to be added."""
        await self._ensure_admin(workspace_id)
        profile_exists = await self.session.execute(
            select(LabelStaffProfile.id).where(LabelStaffProfile.id == labelstaff_profile_id)
        )
        if profile_exists.scalar_one_or_none() is None:
            raise LabelStaffProfileNotFoundError("That label staff profile does not exist.")
        new_member = Membership(role=membership_data.role,
                                labelstaff_profile_id=labelstaff_profile_id,
                                workspace_id=workspace_id)
        self.session.add(new_member)
        await self.session.commit()
        await self.session.refresh(new_member)

        return new_member


    async def delete_member(self, workspace_id: UUID, labelstaff_profile_id: UUID) -> None:
        """Here labelstaff_profile_id points not to self (the admin) but to the member to be deleted."""
        await self._ensure_admin(workspace_id)
        result = await self.session.execute(select(Membership).where(
            Membership.labelstaff_profile_id == labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))
        member = result.scalar_one_or_none()
        

        if not member:
            raise MembershipNotFoundError("Membership not found.")

        # Use explicit DELETE; session.delete(member) + commit() was not persisting
        # in this AsyncSession + FastAPI yield-session setup (same as in tracks.py).
        await self.session.execute(
            delete(Membership).where(
                Membership.labelstaff_profile_id == labelstaff_profile_id,
                Membership.workspace_id == workspace_id,
            )
        )
        await self.session.commit()

    
    async def is_member_of_label(self, workspace_id: UUID) -> None:
        result = await self.session.execute(select(Membership).where(
            Membership.labelstaff_profile_id == self.labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))
        member = result.scalar_one_or_none()

        if not member:
            raise MembershipNotFoundError("Membership not found.")
    

    async def get_membership(self, workspace_id: UUID) -> Membership | None:
        result = await self.session.execute(select(Membership).where(
            Membership.labelstaff_profile_id == self.labelstaff_profile_id,
            Membership.workspace_id == workspace_id
        ))
        return result.scalar_one_or_none()
