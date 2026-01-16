from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Response

from app.schemas.schemas import SubmissionCreate, SubmissionPublic
from app.depedencies import SubmissionQueryServiceDep, WorkspaceServiceDep, MembershipServiceDep, CurrentProducerProfileIdDep, SubmissionWorkflowServiceDep
from app.services.submissions import (
    SubmissionWithdrawnError, SubmissionInReviewError, SubmissionAcceptedError,
    SubmissionRejectedError, SubmissionShortlistedError, SubmissionTransitionNotAllowedError
    )


router = APIRouter(tags=["Submissions"])


# -------------- READ Operations (SubmissionQueryService) ---------------------
@router.get("/submissions", status_code=status.HTTP_200_OK, response_model=list[SubmissionPublic])
async def list_producer_submissions(submission_query_service: SubmissionQueryServiceDep,
                                    producer_profile_id: CurrentProducerProfileIdDep
                                    ) -> list[SubmissionPublic]:
    submissions = await submission_query_service.list_producer_submissions(producer_profile_id)
    return submissions


@router.get("/workspaces/{workspace_id}/submissions", status_code=status.HTTP_200_OK, response_model=list[SubmissionPublic])
async def list_label_submissions(submission_query_service: SubmissionQueryServiceDep,
                                 workspace_id: UUID) -> list[SubmissionPublic]:
    submissions = await submission_query_service.list_label_submissions(workspace_id)
    return submissions



# -------------- STATE Transitions (SubmissionWorkflowService) ----------------
@router.post("/submissions", status_code=status.HTTP_201_CREATED, response_model=SubmissionPublic)
async def create_submission(submission_data: SubmissionCreate,
                            producer_profile_id: CurrentProducerProfileIdDep,
                            submission_workflow_service: SubmissionWorkflowServiceDep) -> SubmissionPublic:
    """
    Initialize process:
    1. Creates snapshot (Submission)
    2. Creates first event (Status: PENDING)
    """
    new_submission = await submission_workflow_service.create_submission(submission_data, producer_profile_id)
    return new_submission


@router.post("/submissions/{submission_id}/withdraw", status_code=status.HTTP_204_NO_CONTENT)
async def transition_to_withdrawn(submission_id: UUID,
                                  submission_workflow_service: SubmissionWorkflowServiceDep,
                                  producer_profile_id: CurrentProducerProfileIdDep) -> Response:
    """Transition: PENDING -> WITHDRAWN"""
    try:
        await submission_workflow_service.transition_to_withdrawn(submission_id, producer_profile_id)
        return Response(content=None, status_code=status.HTTP_204_NO_CONTENT)
    except SubmissionWithdrawnError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/start-review",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_in_review(workspace_id: UUID,
                                  submission_id: UUID,
                                  submission_workflow_service: SubmissionWorkflowServiceDep
                                  ) -> SubmissionPublic:
    """Transition: PENDING -> IN-REVIEW"""
    try:
        submission_in_review = await submission_workflow_service.transition_to_in_review(submission_id, workspace_id)
        return submission_in_review
    except SubmissionInReviewError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/shortlist",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_shortlisted(workspace_id: UUID,
                                    submission_id: UUID,
                                    submission_workflow_service: SubmissionWorkflowServiceDep
                                    ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> SHORTLISTED"""
    try:
        submission_shortlisted = await submission_workflow_service.transition_to_shortlisted(submission_id, workspace_id)
        return submission_shortlisted
    except SubmissionShortlistedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/accept",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_accepted(workspace_id: UUID,
                                submission_id: UUID,
                                submission_workflow_service: SubmissionWorkflowServiceDep
                                ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> ACCEPTED | SHORTLISTED -> ACCEPTED"""
    try:
        submission_accepted = await submission_workflow_service.transition_to_accepted(submission_id, workspace_id)
        return submission_accepted
    except SubmissionAcceptedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/reject",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_rejected(workspace_id: UUID,
                                submission_id: UUID,
                                submission_workflow_service: SubmissionWorkflowServiceDep
                                ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> REJECTED | SHORTLISTED -> REJECTED"""
    try:
        submission_rejected = await submission_workflow_service.transition_to_rejected(submission_id, workspace_id)
        return submission_rejected
    except SubmissionRejectedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))