from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Track
from app.schemas.schemas import TrackCreate, TrackUpdate


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
        pass


    async def delete_track(self, track_id: UUID) -> None:
        pass


    async def list_tracks(self) -> list[Track]:
        pass