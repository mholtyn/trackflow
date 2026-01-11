from typing import Annotated

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
import zxcvbn
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from trackflow.app.schemas.schemas import UserCreate, UserPublic, Token
from trackflow.app.models.models import User
from app.depedencies import SessionDep, CurrentUserDep, UserServiceDep
from trackflow.app.services.auth import generate_access_token


router = APIRouter(tags=["Users"])
ph = PasswordHasher()


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserPublic)
async def register(user_data: UserCreate, service: UserServiceDep) -> UserPublic:
    return await service.create_user(user_data) 


@router.post("/token", status_code=status.HTTP_200_OK, response_model=Token)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                     session: SessionDep) -> Token:
    result = await session.execute(select(User).where(User.username == form_data.username))
    existing_user = result.scalars().first()

    if existing_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    
    if not ph.verify(existing_user.pwd_hash, form_data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    token = generate_access_token(existing_user.id)
    
    return Token(access_token=token, token_type="bearer")


@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserPublic)
async def read_user(session: SessionDep, current_user: CurrentUserDep) -> UserPublic:
    result = await session.execute(select(User).where(User.id == current_user["sub"]))
    db_user = result.scalars().first()

    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find user.")
    
    return db_user


#TODO: update labelstaff profile



#TODO: update producer profile