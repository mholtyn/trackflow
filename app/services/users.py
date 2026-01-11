import zxcvbn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.schemas import UserCreate
from app.models.models import User
from app.services.auth import AuthService


class PasswordTooWeakError(Exception):
    """Raise when password is below 1 in zxcvbn check."""
    pass


class UsernameAlreadyTakenError(Exception):
    """Raise when username is taken."""
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
        await self.session.commit()
        await self.session.refresh(new_user)

        return new_user


    def _check_password_strength(self, password: str):
        if zxcvbn.zxcvbn(password)["score"] < 1:
            raise PasswordTooWeakError


    async def _is_username_taken(self, username: str):
        result = await self.session.execute(select(User).where(User.username == username))
        existing_username = result.scalar_one_or_none()

        if existing_username:
            raise UsernameAlreadyTakenError


