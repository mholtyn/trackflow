from typing import Annotated

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
import zxcvbn
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.schemas import UserCreate, UserPublic, Token
from app.models import User
from app.depedencies import SessionDep, CurrentUserDep
from app.auth import generate_access_token


router = APIRouter(tags=["Users"])
ph = PasswordHasher()


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserPublic)
async def create_user(user: UserCreate, session: SessionDep) -> UserPublic:
    result_username = await session.execute(select(User).where(User.username == user.username))
    existing_username = result_username.scalars().first()
    
    if existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username taken.")

    if len(user.password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least 6 characters.")

    if zxcvbn.zxcvbn(user.password)["score"] < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password is too weak.")
    
    hashed_pwd = ph.hash(user.password)
    
    db_user = User(email=user.email,
                   username=user.username,
                   pwd_hash=hashed_pwd,
                   first_name=user.first_name,
                   last_name=user.last_name,
                   gender=user.gender,
                   user_type=user.user_type)
    
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)

    return db_user


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