from uuid import UUID

from fastapi import APIRouter, status, HTTPException, Response

from app.schemas.schemas import TrackCreate, TrackPublic, TrackUpdate
from app.depedencies import TrackServiceDep
from app.services.tracks import TrackNotFoundError, TrackForbiddenError


router = APIRouter(tags=["Tracks"])


@router.post("/tracks", status_code=status.HTTP_201_CREATED, response_model=TrackPublic)
async def add_track(track_data: TrackCreate, track_service: TrackServiceDep) -> TrackPublic:
    """Create new track"""
    new_track = await track_service.create_track(track_data)
    return new_track


@router.patch("/tracks/{track_id}", status_code=status.HTTP_200_OK, response_model=TrackPublic)
async def edit_track(track_data: TrackUpdate, track_id: UUID, track_service: TrackServiceDep) -> TrackPublic:
    """Update track"""
    try:
        updated_track = await track_service.update_track(track_data, track_id)
        return updated_track
    except TrackNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TrackForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/tracks/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_track(track_id: UUID, track_service: TrackServiceDep) -> Response:
    """Delete track"""
    try:
        await track_service.delete_track(track_id)
        return Response(content=None, status_code=status.HTTP_204_NO_CONTENT)
    except TrackNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TrackForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/tracks", status_code=status.HTTP_200_OK, response_model=list[TrackPublic])
async def list_tracks(track_service: TrackServiceDep) -> list[TrackPublic]:
    """Read tracks"""
    tracks = await track_service.list_tracks()
    return tracks