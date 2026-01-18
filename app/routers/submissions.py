from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Response

from app.schemas.schemas import SubmissionCreate, SubmissionPublic, SubmissionEventPublic
from app.depedencies import SubmissionQueryServiceDep, MembershipServiceDep, CurrentProducerProfileIdDep, SubmissionWorkflowServiceDep
from app.services.submissions import SubmissionNotFoundError, TransitionNotAllowedError, ActorNotUniqueError
from app.services.memberships import MembershipNotFoundError

router = APIRouter(tags=["Submissions"])


# -------------- READ Operations (SubmissionQueryService) ---------------------
@router.get("/submissions", status_code=status.HTTP_200_OK, response_model=list[SubmissionPublic])
async def list_producer_submissions(submission_query_service: SubmissionQueryServiceDep,
                                    producer_profile_id: CurrentProducerProfileIdDep
                                    ) -> list[SubmissionPublic]:
    """Read submissions | Producer side"""
    submissions = await submission_query_service.list_producer_submissions(producer_profile_id)
    return submissions


@router.get("/workspaces/{workspace_id}/submissions", status_code=status.HTTP_200_OK, response_model=list[SubmissionPublic])
async def list_label_submissions(submission_query_service: SubmissionQueryServiceDep,
                                 workspace_id: UUID,
                                 membership_service: MembershipServiceDep,
                                 ) -> list[SubmissionPublic]:
    """Read submissions | Label side"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        submissions = await submission_query_service.list_label_submissions(workspace_id)
        return submissions
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))



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
        await submission_workflow_service.withdraw(submission_id, producer_profile_id)
        return Response(content=None, status_code=status.HTTP_204_NO_CONTENT)
    except SubmissionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransitionNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ActorNotUniqueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/start-review",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_in_review(workspace_id: UUID,
                                  submission_id: UUID,
                                  submission_workflow_service: SubmissionWorkflowServiceDep,
                                  membership_service: MembershipServiceDep
                                  ) -> SubmissionPublic:
    """Transition: PENDING -> IN-REVIEW"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        actor_id = membership_service.labelstaff_profile_id
        submission_in_review = await submission_workflow_service.start_review(submission_id, workspace_id, actor_id)
        return submission_in_review
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except SubmissionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransitionNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ActorNotUniqueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/shortlist",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_shortlisted(workspace_id: UUID,
                                    submission_id: UUID,
                                    submission_workflow_service: SubmissionWorkflowServiceDep,
                                    membership_service: MembershipServiceDep
                                    ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> SHORTLISTED"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        actor_id = membership_service.labelstaff_profile_id
        submission_shortlisted = await submission_workflow_service.shortlist(submission_id, workspace_id, actor_id)
        return submission_shortlisted
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except SubmissionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransitionNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ActorNotUniqueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/accept",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_accepted(workspace_id: UUID,
                                submission_id: UUID,
                                submission_workflow_service: SubmissionWorkflowServiceDep,
                                membership_service: MembershipServiceDep
                                ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> ACCEPTED | SHORTLISTED -> ACCEPTED"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        actor_id = membership_service.labelstaff_profile_id
        submission_accepted = await submission_workflow_service.accept(submission_id, workspace_id, actor_id)
        return submission_accepted
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except SubmissionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransitionNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ActorNotUniqueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/reject",
             status_code=status.HTTP_200_OK, response_model=SubmissionPublic)
async def transition_to_rejected(workspace_id: UUID,
                                submission_id: UUID,
                                submission_workflow_service: SubmissionWorkflowServiceDep,
                                membership_service: MembershipServiceDep
                                ) -> SubmissionPublic:
    """Transition: IN-REVIEW -> REJECTED | SHORTLISTED -> REJECTED"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        actor_id = membership_service.labelstaff_profile_id
        submission_rejected = await submission_workflow_service.reject(submission_id, workspace_id, actor_id)
        return submission_rejected
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except SubmissionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransitionNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ActorNotUniqueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))    
    

# -------------- READ Events (..) ----------------
@router.get("/submissions/events", status_code=status.HTTP_200_OK, response_model=list[SubmissionEventPublic])
async def list_producer_submission_events(submission_query_service: SubmissionQueryServiceDep,
                                          producer_profile_id: CurrentProducerProfileIdDep) -> list[SubmissionEventPublic]:
    """Read submission events | Producer side"""
    submission_events = await submission_query_service.list_producer_submission_events(producer_profile_id)
    return submission_events


@router.get("/workspaces/{workspace_id}/submissions/events", status_code=status.HTTP_200_OK, response_model=list[SubmissionEventPublic])
async def list_label_submission_events(submission_query_service: SubmissionQueryServiceDep,
                                       workspace_id: UUID,
                                       membership_service: MembershipServiceDep) -> list[SubmissionEventPublic]:
    """Read submission events | Label side"""
    try:
        await membership_service.is_member_of_label(workspace_id)
        submission_events = await submission_query_service.list_label_submission_events(workspace_id)
        return submission_events
    except MembershipNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))