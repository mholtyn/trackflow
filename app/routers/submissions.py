from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Response

from app.schemas.schemas import SubmissionCreate
from app.depedencies import WorkspaceServiceDep, MembershipServiceDep
from app.services.workspaces import WorkspaceForbiddenError, WorkspaceNotFoundError


router = APIRouter(tags=["Submissions"])


# -------------- READ Operations (SubmissionQueryService) ---------------------
@router.get("/submissions", status_code=status.HTTP_200_OK)
async def list_producer_submissions():
    pass


@router.get("/workspaces/{workspace_id}/submissions", status_code=status.HTTP_200_OK)
async def list_label_submissions():
    pass



# -------------- STATE Transitions (SubmissionWorkflowService) ----------------
@router.post("/submissions", status_code=status.HTTP_201_CREATED)
async def create_submission():
    """
    Initialize process:
    1. Creates snapshot (Submission)
    2. Creates first event (Status: PENDING)
    """
    pass


@router.post("/submissions/{submission_id}/withdraw", status_code=status.HTTP_204_NO_CONTENT)
async def transition_to_withdrawn():
    """Transition: PENDING -> WITHDRAWN"""
    pass


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/start-review",
             status_code=status.HTTP_200_OK)
async def transition_to_in_review():
    """Transition: PENDING -> IN-REVIEW"""
    pass


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/shortlist",
             status_code=status.HTTP_200_OK)
async def transition_to_shortlisted():
    """Transition: IN-REVIEW -> SHORTLISTED"""
    pass


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/accept",
             status_code=status.HTTP_200_OK)
async def transition_to_accepted():
    """Transition: IN-REVIEW -> ACCEPTED | SHORTLISTED -> ACCEPTED"""
    pass


@router.post("/workspaces/{workspace_id}/submissions/{submission_id}/reject",
             status_code=status.HTTP_200_OK)
async def transition_to_rejected():
    """Transition: IN-REVIEW -> REJECTED | SHORTLISTED -> REJECTED"""
    pass