from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.services.auth import AuthService, InvalidTokenError
from app.services.users import UserService
from app.models.models import User, ProducerProfile, LabelStaffProfile
from app.services.tracks import TrackService
from app.services.workspaces import WorkspaceService
from app.services.memberships import MembershipService
from app.services.submissions import SubmissionQueryService, SubmissionWorkflowService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def get_auth_service() -> AuthService:
       return AuthService()


SessionDep = Annotated[AsyncSession, Depends(get_db)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


def get_user_service(session: SessionDep, auth_service: AuthServiceDep) -> UserService:
       return UserService(session, auth_service)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]


async def get_current_user(auth_service: AuthServiceDep,
                     user_service: UserServiceDep,
                     token: Annotated[str,Depends(oauth2_scheme)],
                     ) -> User:
        try:
            payload = auth_service.verify_access_token(token)
            user_id = payload.get("sub")

            user = await user_service.get_user_by_id(user_id)
            if not user:
                   raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
            return user
        
        except InvalidTokenError as e:
               raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                   detail=str(e))


CurrentUserDep = Annotated[User, Depends(get_current_user)]


async def get_producer_profile_id(current_user: CurrentUserDep, session: SessionDep) -> UUID:
       result = await session.execute(select(ProducerProfile.id).where(ProducerProfile.user_id == current_user.id))
       producer_profile_id = result.scalar_one_or_none()

       if not producer_profile_id:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producer profile not found.")

       return producer_profile_id

CurrentProducerProfileIdDep = Annotated[UUID, Depends(get_producer_profile_id)]


def get_track_service(session: SessionDep, producer_profile_id: CurrentProducerProfileIdDep) -> TrackService:
       return TrackService(session, producer_profile_id)

TrackServiceDep = Annotated[TrackService, Depends(get_track_service)]


async def get_labelstaff_profile_id(current_user: CurrentUserDep, session: SessionDep) -> UUID:
       result = await session.execute(select(LabelStaffProfile.id).where(LabelStaffProfile.user_id == current_user.id))
       labelstaff_profile_id = result.scalar_one_or_none()

       if not labelstaff_profile_id:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Labelstaff profile not found.")
       
       return labelstaff_profile_id

CurrentLabelstaffProfileIdDep = Annotated[UUID, Depends(get_labelstaff_profile_id)]


def get_workspace_service(session: SessionDep, labelstaff_profile_id: CurrentLabelstaffProfileIdDep) -> WorkspaceService:
       return WorkspaceService(session, labelstaff_profile_id)


WorkspaceServiceDep = Annotated[WorkspaceService, Depends(get_workspace_service)]


def get_membership_service(session: SessionDep, labelstaff_profile_id: CurrentLabelstaffProfileIdDep) -> MembershipService:
       return MembershipService(session, labelstaff_profile_id)


MembershipServiceDep = Annotated[MembershipService, Depends(get_membership_service)]


def get_submission_query_service(session: SessionDep) -> SubmissionQueryService:
       return SubmissionQueryService(session)

SubmissionQueryServiceDep = Annotated[SubmissionQueryService, Depends(get_submission_query_service)]


def get_submission_workflow_service(session: SessionDep) -> SubmissionWorkflowService:
       return SubmissionWorkflowService(session)

SubmissionWorkflowServiceDep = Annotated[SubmissionWorkflowService, Depends(get_submission_workflow_service)]