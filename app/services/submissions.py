from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.models import Workspace, Membership, Submission, Status
from app.schemas.schemas import SubmissionCreate, SubmissionPublic
from app.services.workspaces import WorkspaceNotFoundError


class SubmissionWithdrawnError(Exception):
    """Raise when status change: PENDING -> WITHDRAWN fails."""
    pass


class SubmissionInReviewError(Exception):
    """Raise when status change: PENDING -> IN_REVIEW fails."""
    pass


class SubmissionShortlistedError(Exception):
    """Raise when status change: IN_REVIEW -> SHORTLISTED fails."""
    pass


class SubmissionAcceptedError(Exception):
    """Raise when status change: IN_REVIEW -> ACCEPTED or SHORTLISTED -> ACCEPTED fails."""
    pass


class SubmissionRejectedError(Exception):
    """Raise when status change: IN_REVIEW -> REJECTED or SHORTLISTED -> REJECTED fails."""
    pass


class SubmissionTransitionNotAllowedError(Exception):
    """Raise when status change is illegal i.e. ACCEPTED -> PENDING"""
    pass


class SubmissionQueryService:
    def __init__(self, session: AsyncSession):
        self.session = session


    async def list_producer_submissions(self, producer_profile_id: UUID) -> list[Submission]:
        result = await self.session.execute(select(Submission).where(Submission.producer_profile_id == producer_profile_id))
        submissions = result.scalars().all()

        return submissions


    async def list_label_submissions(self, workspace_id: UUID) -> list[Submission]:
        result = await self.session.execute(select(Submission).where(Submission.workspace_id == workspace_id))
        submissions = result.scalars().all()

        return submissions


class SubmissionWorkflowService:
    def __init__(self, session: AsyncSession):
        self.session = session


    async def create_submission(self, submission_data: SubmissionCreate, 
                                producer_profile_id: UUID,) -> Submission:
        new_submission = Submission(producer_profile_id=producer_profile_id,
                                    workspace_id=submission_data.workspace_id,
                                    title=submission_data.title,
                                    tempo=submission_data.tempo,
                                    streaming_url=submission_data.streaming_url,
                                    genre=submission_data.genre,
                                    key=submission_data.key,
                                    extra_metadata=submission_data.extra_metadata,
                                    status=Status.PENDING)
        
        self.session.add(new_submission)
        await self.session.commit()
        await self.session.refresh(new_submission)
        return new_submission


    async def transition_to_withdrawn(self, submission_id: UUID, producer_profile_id: UUID) -> Submission:
        result = await self.session.execute(select(Submission).where(
                        Submission.id == submission_id,
                        Submission.producer_profile_id == producer_profile_id,
                    )
                )
        submission_to_withdraw = result.scalar_one_or_none()

        if not submission_to_withdraw:
            raise SubmissionWithdrawnError("Could not withdraw submission. 403 or 404")
        #TODO: Accepted transitions check

        submission_to_withdraw.status = Status.WITHDRAWN
        await self.session.commit()
        await self.session.refresh(submission_to_withdraw)
        return submission_to_withdraw


    async def transition_to_in_review(self, submission_id: UUID, workspace_id: UUID) -> Submission:
        result = await self.session.execute(select(Submission).where(
            Submission.id == submission_id,
            Submission.workspace_id == workspace_id
        ))
        submission_to_in_review = result.scalar_one_or_none()

        if not submission_to_in_review:
            raise SubmissionInReviewError("Could not change status of the submission to IN-REVIEW. 403 or 404")
        #TODO: Accepted transitions check
        
        submission_to_in_review.status = Status.IN_REVIEW
        await self.session.commit()
        await self.session.refresh(submission_to_in_review)
        return submission_to_in_review
    

    async def transition_to_shortlisted(self, submission_id: UUID, workspace_id: UUID) -> Submission:
        result = await self.session.execute(select(Submission).where(
            Submission.id == submission_id,
            Submission.workspace_id == workspace_id
        ))
        submission_to_shortlisted = result.scalar_one_or_none()

        if not submission_to_shortlisted:
            raise SubmissionShortlistedError("Could not change status of the submission to SHORTLISTED. 403 or 404")
        #TODO: Accepted transitions check

        submission_to_shortlisted.status = Status.SHORTLISTED
        await self.session.commit()
        await self.session.refresh(submission_to_shortlisted)
        return submission_to_shortlisted


    async def transition_to_accepted(self, submission_id: UUID, workspace_id: UUID) -> Submission:
        result = await self.session.execute(select(Submission).where(
            Submission.id == submission_id,
            Submission.workspace_id == workspace_id
        ))
        submission_to_accepted = result.scalar_one_or_none()

        if not submission_to_accepted:
            raise SubmissionInReviewError("Could not change status of the submission to IN-REVIEW. 403 or 404")
        #TODO: Accepted transitions check

        submission_to_accepted.status = Status.ACCEPTED
        await self.session.commit()
        await self.session.refresh(submission_to_accepted)
        return submission_to_accepted


    async def transition_to_rejected(self, submission_id: UUID, workspace_id: UUID) -> Submission:
        result = await self.session.execute(select(Submission).where(
            Submission.id == submission_id,
            Submission.workspace_id == workspace_id
        ))
        submission_to_rejected = result.scalar_one_or_none()

        if not submission_to_rejected:
            raise SubmissionInReviewError("Could not change status of the submission to IN-REVIEW. 403 or 404")
        #TODO: Accepted transitions check

        submission_to_rejected.status = Status.REJECTED
        await self.session.commit()
        await self.session.refresh(submission_to_rejected)
        return submission_to_rejected