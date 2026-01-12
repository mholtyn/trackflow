from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth import AuthService, InvalidTokenError
from app.services.users import UserService
from app.models.models import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def get_auth_service() -> AuthService:
       return AuthService()


SessionDep = Annotated[AsyncSession, Depends(get_db)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


def get_user_service(session: SessionDep, auth_service: AuthServiceDep) -> UserService:
       return UserService(session, auth_service)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]


async def get_current_user(auth_service: AuthServiceDep,
                     user_service: UserServiceDep,
                     token: Annotated[str,Depends(oauth2_scheme)],
                     ) -> User:
        try:
            payload = auth_service.verify_access_token(token)
            user_id = payload.get("sub")

            user = await user_service.get_user_by_id(user_id)
            if not user:
                   raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
            return user
        
        except InvalidTokenError as e:
               raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                   detail=str(e))


CurrentUserDep = Annotated[User, Depends(get_current_user)]