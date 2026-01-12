from typing import Annotated

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm


from app.schemas.schemas import UserCreate, UserPublic, Token
from app.depedencies import CurrentUserDep, UserServiceDep
from app.services.users import AuthenticationError, PasswordTooWeakError, UsernameAlreadyTakenError


router = APIRouter(tags=["Users"])


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserPublic)
async def register(user_data: UserCreate, service: UserServiceDep) -> UserPublic:
    try:
        return await service.create_user(user_data)
    except PasswordTooWeakError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except UsernameAlreadyTakenError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/token", status_code=status.HTTP_200_OK, response_model=Token)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                     user_service: UserServiceDep) -> Token:
    try:
        user = await user_service.authenticate_user(form_data.username, form_data.password)
        token = user_service.auth_service.generate_access_token(user.id)
        return Token(access_token=token, token_type="bearer")
    except AuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    

@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserPublic)
async def read_user(current_user: CurrentUserDep) -> UserPublic:
    return current_user


#TODO: update labelstaff profile



#TODO: update producer profile