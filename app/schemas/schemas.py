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

    model_config = {"from_attributes": True}


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

    model_config = {"from_attributes": True}


# -------------------- Tracks -----------------------------
class TrackCreate(BaseModel):
    title: str
    streaming_url: str
    tempo: float
    genre: list[str]
    key: str | None = None
    extra_metadata: dict | None = None


class TrackPublic(BaseModel):
    id: UUID
    producer_profile_id: UUID
    title: str
    streaming_url: str
    tempo: float
    genre: list[str]
    key: str | None = None
    extra_metadata: dict | None = None

    model_config = {"from_attributes": True}


class TrackUpdate(BaseModel):
    title: str | None
    streaming_url: str | None
    tempo: float | None
    genre: list[str] | None
    key: str | None
    extra_metadata: dict | None


# -------------------- Workspaces -----------------------------
class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceUpdate(BaseModel):
    name: str


class WorkspacePublic(BaseModel):
    id: UUID
    name: str

    model_config = {"from_attributes": True}


# -------------------- Memberships -----------------------------
class MembershipCreate(BaseModel):
    role: LabelRole


class MembershipPublic(BaseModel):
    id: UUID
    role: LabelRole

    model_config = {"from_attributes": True}


# -------------------- Submissions -----------------------------
class SubmissionCreate(BaseModel):
    workspace_id: UUID
    title: str
    streaming_url: str
    tempo: float
    genre: list[str] | None = None
    key: str | None = None
    extra_metadata: dict | None = None


class SubmissionPublic(BaseModel):
    id: UUID
    producer_profile_id: UUID
    workspace_id: UUID
    title: str
    streaming_url: str
    tempo: float
    genre: list[str] | None = None
    key: str | None = None
    extra_metadata: dict | None = None

    status: Status

    model_config = {"from_attributes": True}