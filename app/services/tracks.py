from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import Track
from app.schemas.schemas import TrackCreate, TrackUpdate


class TrackNotFoundError(Exception):
    """Raise when track couldn't be found."""
    pass


class TrackForbiddenError(Exception):
    """Raise when permission is denied to track."""
    pass


class TrackService:
    def __init__(self, session: AsyncSession, producer_profile_id: UUID):
        self.session = session
        self.producer_profile_id = producer_profile_id

    
    async def create_track(self, track_data: TrackCreate) -> Track:
        new_track = Track(producer_profile_id=self.producer_profile_id,
                          title=track_data.title,
                          streaming_url=track_data.streaming_url,
                          tempo=track_data.tempo,
                          genre=track_data.genre,
                          key=track_data.key,
                          extra_metadata=track_data.extra_metadata)
        
        self.session.add(new_track)

        await self.session.commit()
        await self.session.refresh(new_track)

        return new_track


    async def update_track(self, track_data: TrackUpdate, track_id: UUID) -> Track:
        result = await self.session.execute(select(Track).where(Track.id == track_id))
        track = result.scalar_one_or_none()

        if not track:
            raise TrackNotFoundError("Track not found.")

        if track.producer_profile_id != self.producer_profile_id:
            raise TrackForbiddenError("Access denied.")  

        update_data = track_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(track, key, value)
        
        await self.session.commit()
        await self.session.refresh(track)
        return track


    async def delete_track(self, track_id: UUID) -> None:
        result = await self.session.execute(select(Track).where(Track.id == track_id))
        track = result.scalar_one_or_none()

        if not track:
            raise TrackNotFoundError("Track not found.")

        if track.producer_profile_id != self.producer_profile_id:
            raise TrackForbiddenError("Access denied.")    

        self.session.delete(track)
        await self.session.commit()
        return


    async def list_tracks(self) -> list[Track]:
        result = await self.session.execute(select(Track).where(Track.producer_profile_id == self.producer_profile_id))
        tracks = result.scalars().all()

        return tracks