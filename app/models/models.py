from datetime import datetime
from enum import Enum
import uuid
from typing import Optional

from sqlalchemy import String, DateTime, func, Float, ForeignKey, UUID, Text, ARRAY
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.database import Base


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class LabelRole(str, Enum):
    admin = "admin"
    agent = "agent"


class UserType(str, Enum):
    producer = "producer"
    label_staff = "label_staff"


class Status(str, Enum):
    sent = "sent"
    pending = "pending"
    read = "read"
    accepted = "accepted"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    pwd_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    gender: Mapped[Gender | None] = mapped_column(SAEnum(Gender, name="gender_enums"))

    user_type: Mapped[UserType] = mapped_column(SAEnum(UserType, name="usertype_enums"), nullable=False)
    producer_profile: Mapped[Optional["ProducerProfile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    labelstaff_profile: Mapped[Optional["LabelStaffProfile"]] = relationship(back_populates="user")
    

class ProducerProfile(Base):
    __tablename__ = "producer_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    artist_name: Mapped[str] = mapped_column(String(100), nullable=False)
    music_genre: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String))
    bio: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(String(100))
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    social_links: Mapped[dict | None] = mapped_column(JSONB)

    user: Mapped["User"] = relationship(back_populates="producer_profile")

    tracks: Mapped[list["Track"]] = relationship(back_populates="producer", cascade="all, delete-orphan")
    submission_events: Mapped[list["SubmissionEvent"]] = relationship(back_populates="producer")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="producer")


class LabelStaffProfile(Base):
    __tablename__ = "labelstaff_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(String(100))
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    social_links: Mapped[dict | None] = mapped_column(JSONB)
    position: Mapped[str | None] = mapped_column(String(50))

    user: Mapped["User"] = relationship(back_populates="labelstaff_profile")

    memberships: Mapped[list["Membership"]] = relationship(back_populates="labelstaff", cascade="all, delete-orphan")
    submission_events: Mapped[list["SubmissionEvent"]] = relationship(back_populates="labelstaff")


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    producer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("producer_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    streaming_url: Mapped[str] = mapped_column(Text, nullable=False)
    tempo: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    genre: Mapped[list[str]] = mapped_column(ARRAY(String))
    key: Mapped[str | None] = mapped_column(String(3), index=True)
    extra_metadata: Mapped[dict] = mapped_column(JSONB)

    producer: Mapped["ProducerProfile"] = relationship(back_populates="tracks")    


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    memberships: Mapped[list["Membership"]] = relationship(back_populates="workspace")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="workspace")
    submission_events: Mapped[list["SubmissionEvent"]] = relationship(back_populates="workspace")


class Membership(Base):
    __tablename__ = "memberships"

    labelstaff_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("labelstaff_profiles.id"), primary_key=True)
    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id"), primary_key=True)
    role: Mapped[LabelRole] = mapped_column(SAEnum(LabelRole, name="labelrole_enums"), nullable=False)
    
    labelstaff: Mapped["LabelStaffProfile"] = relationship(back_populates="memberships")
    workspace: Mapped["Workspace"] = relationship(back_populates="memberships")


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    producer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("producer_profiles.id"), nullable=False)
    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    streaming_url: Mapped[str] = mapped_column(Text, nullable=False)
    tempo: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    genre: Mapped[list[str]] = mapped_column(ARRAY(String))
    key: Mapped[str | None] = mapped_column(String(3), index=True)
    extra_metadata: Mapped[dict] = mapped_column(JSONB)

    status: Mapped[Status] = mapped_column(SAEnum(Status, name="status_enums"), nullable=False)

    producer: Mapped["ProducerProfile"] = relationship(back_populates="submissions")
    workspace: Mapped["Workspace"] = relationship(back_populates="submissions")
    events: Mapped[list["SubmissionEvent"]] = relationship(back_populates="submission")


class SubmissionEvent(Base):
    __tablename__ = "submission_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status: Mapped[Status] = mapped_column(SAEnum(Status, name="status_enums"), nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    submission_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("submissions.id"), nullable=False)
    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id"), nullable=False)
    producer_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("producer_profiles.id"), nullable=True, index=True)
    labelstaff_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("labelstaff_profiles.id"), nullable=True, index=True)

    submission: Mapped["Submission"] = relationship(back_populates="events")
    workspace: Mapped["Workspace"] = relationship(back_populates="submission_events")
    producer: Mapped["ProducerProfile"] = relationship(back_populates="submission_events")
    labelstaff: Mapped["LabelStaffProfile"] = relationship(back_populates="submission_events")