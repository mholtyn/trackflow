from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import Submission, Status, SubmissionEvent
from app.schemas.schemas import SubmissionCreate


class SubmissionNotFoundError(Exception):
    """Raise when submission couldn't be found."""
    pass


class TransitionNotAllowedError(Exception):
    """Raise when status change is illegal i.e. ACCEPTED -> PENDING"""
    pass


class ActorNotUniqueError(Exception):
    """Raise when submission event object doesn't have exactly one actor"""
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
    
    
    async def list_producer_submission_events(self, producer_profile_id: UUID) -> list[SubmissionEvent]:
        result = await self.session.execute(select(SubmissionEvent).where(SubmissionEvent.producer_profile_id == producer_profile_id))
        submission_events = result.scalars().all()

        return submission_events


    async def list_label_submission_events(self, workspace_id: UUID) -> list[SubmissionEvent]:
        result = await self.session.execute(select(SubmissionEvent).where(SubmissionEvent.workspace_id == workspace_id))
        submission_events = result.scalars().all()

        return submission_events
    

class SubmissionWorkflowService:
    allowed_transitions = {
        Status.PENDING: {Status.IN_REVIEW, Status.WITHDRAWN},
        Status.IN_REVIEW: {Status.ACCEPTED, Status.REJECTED, Status.SHORTLISTED},
        Status.SHORTLISTED: {Status.ACCEPTED, Status.REJECTED},
        Status.WITHDRAWN: {},
        Status.ACCEPTED: {},
        Status.REJECTED: {},
    }


    def __init__(self, session: AsyncSession):
        self.session = session


    def _is_transition_allowed(self, from_status: Status, to_status: Status) -> bool:
        if to_status in self.allowed_transitions.get(from_status, None):
            return True
        else:
            return False
        
    
    async def _execute_transition(self, submission_id: UUID,
                                  target_status: Status,
                                  producer_profile_id: UUID | None = None,
                                  workspace_id: UUID | None = None,
                                  labelstaff_profile_id: UUID | None = None
                                  ) -> Submission:
        stmt = select(Submission).where(Submission.id == submission_id)

        if workspace_id:
            stmt = stmt.where(Submission.workspace_id == workspace_id)
        if producer_profile_id:
            stmt = stmt.where(Submission.producer_profile_id == producer_profile_id)

        stmt = stmt.with_for_update()

        result = await self.session.execute(stmt)
        submission = result.scalar_one_or_none()

        if not submission:
            raise SubmissionNotFoundError("Could not find submission.")
        
        allowed = self.allowed_transitions.get(submission.status, set())
        if target_status not in allowed:
            raise TransitionNotAllowedError(f"Cannot transition from {submission.status} to {target_status}")

        if bool(producer_profile_id) == bool(labelstaff_profile_id):
            raise ActorNotUniqueError("Exactly one actor must be provided")

        submission.status = target_status
        await self.session.flush()

        event = SubmissionEvent(
                status=target_status,
                submission_id=submission.id,
                workspace_id=submission.workspace_id,
                producer_profile_id=producer_profile_id,
                labelstaff_profile_id=labelstaff_profile_id
        )
        self.session.add(event)

        await self.session.commit()
        await self.session.refresh(submission)
        return submission
    

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


    async def withdraw(self, submission_id: UUID, producer_profile_id: UUID) -> Submission:
        return await self._execute_transition(
            submission_id=submission_id, target_status=Status.WITHDRAWN, producer_profile_id=producer_profile_id
        )


    async def start_review(self, submission_id: UUID, workspace_id: UUID, labelstaff_profile_id: UUID) -> Submission:
        return await self._execute_transition(
            submission_id=submission_id, target_status=Status.IN_REVIEW, workspace_id=workspace_id, labelstaff_profile_id=labelstaff_profile_id
        )


    async def shortlist(self, submission_id: UUID, workspace_id: UUID, labelstaff_profile_id: UUID) -> Submission:
        return await self._execute_transition(
            submission_id=submission_id, target_status=Status.SHORTLISTED, workspace_id=workspace_id, labelstaff_profile_id=labelstaff_profile_id
        )


    async def accept(self, submission_id: UUID, workspace_id: UUID, labelstaff_profile_id: UUID) -> Submission:
        return await self._execute_transition(
            submission_id=submission_id, target_status=Status.ACCEPTED, workspace_id=workspace_id, labelstaff_profile_id=labelstaff_profile_id
        )


    async def reject(self, submission_id: UUID, workspace_id: UUID, labelstaff_profile_id: UUID) -> Submission:
        return await self._execute_transition(
            submission_id=submission_id, target_status=Status.REJECTED, workspace_id=workspace_id, labelstaff_profile_id=labelstaff_profile_id
        )