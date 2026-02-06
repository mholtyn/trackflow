from uuid import UUID

import zxcvbn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.schemas import UserCreate, ProducerProfileUpdate, LabelStaffProfileUpdate, UserUpdate
from app.models.models import User, LabelStaffProfile, ProducerProfile
from app.services.auth import AuthService


class PasswordTooWeakError(Exception):
    """Raise when password is below 1 in zxcvbn check."""
    pass


class UsernameAlreadyTakenError(Exception):
    """Raise when username is taken."""
    pass


class AuthenticationError(Exception):
    """Raise when authentication failed."""
    pass


class LabelStaffProfileMissingError(Exception):
    """Raise when labelstaff profile couldn't be found."""
    pass


class ProducerProfileMissingError(Exception):
    """Raise when producer profile couldn't be found."""
    pass


class UserMissingError(Exception):
    """Raise when user couldn't be found."""
    pass


class UserService:
    def __init__(self, session: AsyncSession, auth_service: AuthService):
        self.session = session
        self.auth_service = auth_service


    async def create_user(self, user_data: UserCreate):
        self._check_password_strength(user_data.password)
        await self._is_username_taken(user_data.username)

        hashed_pwd = self.auth_service.hash_password(user_data.password)

        new_user = User(email=user_data.email,
                username=user_data.username,
                pwd_hash=hashed_pwd,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                gender=user_data.gender,
                user_type=user_data.user_type)
        
        self.session.add(new_user)
        await self.session.flush()

        # create producerprofile or labelstaff profile while creating user
        if new_user.user_type == "producer":
            await self._create_producer_profile(new_user.id, artist_name="", contact_email=new_user.email)
        elif new_user.user_type == "labelstaff":
            await self._create_labelstaff_profile(new_user.id, contact_email=new_user.email)


        await self.session.commit()
        await self.session.refresh(new_user)

        return new_user


    def _check_password_strength(self, password: str):
        if zxcvbn.zxcvbn(password)["score"] < 1:
            raise PasswordTooWeakError("Password too weak")


    async def _is_username_taken(self, username: str):
        result = await self.session.execute(select(User).where(User.username == username))
        existing_username = result.scalar_one_or_none()

        if existing_username:
            raise UsernameAlreadyTakenError("Username taken")
        
    
    async def authenticate_user(self, username: str, password: str) -> User:
        result = await self.session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()

        if not user or not self.auth_service.verify_password(password, user.pwd_hash):
            raise AuthenticationError("Authentication failed")
        
        return user
    
    
    async def get_user_by_id(self, id: UUID) -> User:
        result = await self.session.execute(select(User).where(User.id == id))
        user = result.scalar_one_or_none()
        return user


    async def update_labelstaff_profile(self, user_id: UUID, data: LabelStaffProfileUpdate) -> LabelStaffProfile:
        result = await self.session.execute(select(LabelStaffProfile).where(LabelStaffProfile.user_id == user_id))
        labelstaff_profile = result.scalar_one_or_none()

        if not labelstaff_profile:
            raise LabelStaffProfileMissingError("Labelstaff profile not found")
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(labelstaff_profile, key, value)

        await self.session.commit()
        await self.session.refresh(labelstaff_profile)

        return labelstaff_profile
    

    async def update_producer_profile(self, user_id: UUID, data: ProducerProfileUpdate) -> ProducerProfile:
        result = await self.session.execute(select(ProducerProfile).where(ProducerProfile.user_id == user_id))
        producer_profile = result.scalar_one_or_none()

        if not producer_profile:
            raise ProducerProfileMissingError("Producer profile not found")
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(producer_profile, key, value)
        
        await self.session.commit()
        await self.session.refresh(producer_profile)

        return producer_profile
    

    async def _create_producer_profile(self, user_id: UUID, artist_name: str, contact_email: str) -> ProducerProfile:
        producer_profile = ProducerProfile(user_id=user_id,
                                           artist_name=artist_name,
                                           contact_email=contact_email)
        self.session.add(producer_profile)
        return producer_profile


    async def _create_labelstaff_profile(self, user_id: UUID, contact_email: str) -> LabelStaffProfile:
        labelstaff_profile = LabelStaffProfile(user_id=user_id,
                                               contact_email=contact_email)
        self.session.add(labelstaff_profile)
        return labelstaff_profile
    
    
    async def get_producer_profile(self, user_id: UUID) -> ProducerProfile:
        result = await self.session.execute(select(ProducerProfile).where(ProducerProfile.user_id == user_id))
        producer_profile = result.scalar_one_or_none()
        if not producer_profile:
            raise ProducerProfileMissingError("Producer profile not found")
        return producer_profile
    

    async def get_labelstaff_profile(self, user_id: UUID) -> LabelStaffProfile:
        result = await self.session.execute(select(LabelStaffProfile).where(LabelStaffProfile.user_id == user_id))
        labelstaff_profile = result.scalar_one_or_none()
        if not labelstaff_profile:
            raise LabelStaffProfileMissingError("Labelstaff profile not found")
        return labelstaff_profile

    
    async def update_user(self, user_id: UUID, data: UserUpdate) -> User:
        """Update user data except password"""
        result = await self.session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise UserMissingError("User not found")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        await self.session.commit()
        await self.session.refresh(user)

        return user