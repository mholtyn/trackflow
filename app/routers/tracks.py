from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Depends

from app.schemas.schemas import TrackCreate, TrackPublic, TrackUpdate
from app.depedencies import TrackServiceDep
from app.services.users import AuthenticationError, PasswordTooWeakError, UsernameAlreadyTakenError, LabelStaffProfileMissingError, ProducerProfileMissingError


router = APIRouter(tags=["Tracks"])


@router.post("/tracks", status_code=status.HTTP_201_CREATED, response_model=TrackPublic)
async def add_track(track_data: TrackCreate, track_service: TrackServiceDep) -> TrackPublic:
    new_track = await track_service.create_track(track_data)
    return new_track


@router.patch("/tracks/{track_id}", status_code=status.HTTP_200_OK, response_model=TrackPublic)
async def edit_track(track_data: TrackUpdate, track_id: UUID, track_service: TrackServiceDep) -> TrackPublic:
    pass


@router.delete("/tracks/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_track(track_id: UUID, track_service: TrackServiceDep) -> None:
    pass


@router.get("/tracks", status_code=status.HTTP_200_OK, response_model=list[TrackPublic])
async def list_tracks(track_service: TrackServiceDep) -> list[TrackPublic]:
    pass