from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.models import Gender, LabelRole, UserType, Status


# -------------------- Users -----------------------------
class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    username: str
    password: str
    gender: Gender | None = None
    
    user_type: UserType


class UserPublic(BaseModel):
    id: UUID
    username: str
    created_at: datetime
    user_type: UserType

    model_config = {"from_attributes": True}


# -------------------- Tokens -----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str


# -------------------- LabelStaffProfiles -----------------------------
class LabelStaffProfileUpdate(BaseModel):
    bio: str | None
    location: str | None
    contact_email: EmailStr | None
    social_links: dict | None
    position: str | None


class LabelStaffProfilePublic(BaseModel):
    bio: str | None
    location: str | None
    contact_email: EmailStr | None
    social_links: dict | None
    position: str | None


# -------------------- ProducerProfiles -----------------------------
class ProducerProfileUpdate(BaseModel):
    artist_name: str | None
    music_genre: list[str] | None
    bio: str | None
    location: str | None
    contact_email: EmailStr | None
    social_links: dict | None


class ProducerProfilePublic(BaseModel):
    artist_name: str | None
    music_genre: list[str] | None
    bio: str | None
    location: str | None
    contact_email: EmailStr | None
    social_links: dict | None