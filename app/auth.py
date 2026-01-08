from uuid import UUID
from datetime import timedelta, timezone, datetime
from typing import Annotated

import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status, Depends

from app.settings import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def generate_access_token(user_id: UUID) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(days=3)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(payload=payload, key=settings.secret_key, algorithm=settings.algorithm)


def verify_access_token(token: str) -> dict:
    try:
        payload: dict = jwt.decode(jwt=token, key=settings.secret_key, algorithms=[settings.algorithm])
        payload["sub"] = UUID(payload.get("sub"))
        return payload
    except (jwt.exceptions.PyJWTError, ValueError, TypeError) as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or user ID format.")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    return verify_access_token(token=token)