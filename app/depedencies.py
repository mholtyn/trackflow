from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth import AuthService, InvalidTokenError
from app.services.users import UserService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def get_auth_service() -> AuthService:
        return AuthService()

def get_user_service() -> UserService:
       return UserService()


SessionDep = Annotated[AsyncSession, Depends(get_db)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]


def get_current_user(auth_service: AuthServiceDep,
                     token: Annotated[str,Depends(oauth2_scheme)],
                     ) -> dict:
        try:
            return auth_service.verify_access_token(token)
        except InvalidTokenError as e:
               raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                   detail=str(e))


CurrentUserDep = Annotated[dict, Depends(get_current_user)]