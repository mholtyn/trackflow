from typing import Annotated

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.schemas import UserCreate, UserPrivate, UserPublic, UserUpdate, Token, LabelStaffProfileUpdate, LabelStaffProfilePublic, ProducerProfilePublic, ProducerProfileUpdate
from app.dependencies import CurrentUserDep, UserServiceDep
from app.services.users import AuthenticationError, PasswordTooWeakError, UserMissingError, UsernameAlreadyTakenError, LabelStaffProfileMissingError, ProducerProfileMissingError


router = APIRouter(tags=["Users"])


# --------------------------- Authentication ---------------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserPublic)
async def register(user_data: UserCreate, service: UserServiceDep) -> UserPublic:
    """Register new user"""
    try:
        return await service.create_user(user_data)
    except PasswordTooWeakError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except UsernameAlreadyTakenError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/token", status_code=status.HTTP_200_OK, response_model=Token)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                     user_service: UserServiceDep) -> Token:
    """Login"""
    try:
        user = await user_service.authenticate_user(form_data.username, form_data.password)
        token = user_service.auth_service.generate_access_token(user.id)
        return Token(access_token=token, token_type="bearer")
    except AuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    

# ----------------------------- Users ---------------------------------------
@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserPrivate)
async def read_user(current_user: CurrentUserDep) -> UserPrivate:
    """Read user data"""
    return current_user


@router.patch("/me", status_code=status.HTTP_200_OK, response_model=UserPrivate)
async def update_user(user_data: UserUpdate, current_user: CurrentUserDep, user_service: UserServiceDep) -> UserPrivate:
    """Update user data"""
    try:
        updated_user = await user_service.update_user(current_user.id, user_data)
        return updated_user
    except UserMissingError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ---------------- Producer Profiles and Labelstaff Profiles -----------------
@router.get("/users/me/producer_profile", status_code=status.HTTP_200_OK, response_model=ProducerProfilePublic)
async def read_producer_profile(current_user: CurrentUserDep, user_service: UserServiceDep) -> ProducerProfilePublic:
    """Read producer profile data"""
    try:
        return await user_service.get_producer_profile(current_user.id)
    except ProducerProfileMissingError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/users/me/labelstaff_profile", status_code=status.HTTP_200_OK, response_model=LabelStaffProfilePublic)
async def read_labelstaff_profile(current_user: CurrentUserDep, user_service: UserServiceDep) -> LabelStaffProfilePublic:
    """Read labelstaff profile data"""
    try:
        return await user_service.get_labelstaff_profile(current_user.id)
    except LabelStaffProfileMissingError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/users/me/labelstaff_profile", status_code=status.HTTP_200_OK, response_model=LabelStaffProfilePublic)
async def update_labelstaff_profile(profile_data: LabelStaffProfileUpdate,
                                    current_user: CurrentUserDep,
                                    user_service: UserServiceDep) -> LabelStaffProfilePublic:
    """Update labelstaff profile data"""
    try:
        updated_profile = await user_service.update_labelstaff_profile(current_user.id, profile_data)
        return updated_profile
    except LabelStaffProfileMissingError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/users/me/producer_profile", status_code=status.HTTP_200_OK, response_model=ProducerProfilePublic)
async def update_producer_profile(profile_data: ProducerProfileUpdate,
                                  current_user: CurrentUserDep,
                                  user_service: UserServiceDep) -> ProducerProfilePublic:
    """Update producer profile data"""
    try:
        updated_profile = await user_service.update_producer_profile(current_user.id, profile_data)
        return updated_profile
    except ProducerProfileMissingError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))