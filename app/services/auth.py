from uuid import UUID
from datetime import timedelta, timezone, datetime

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


from app.settings import settings


#TODO: refactor, add exceptions.py
class InvalidTokenError(Exception):
    """Raise when token is invalid or expired."""
    pass


class AuthService:
    def __init__(self):
        self.ph = PasswordHasher()
        self.secret_key = settings.secret_key
        self.algorithm = settings.algorithm
        self.access_token_expire_days = 3


    def hash_password(self, password: str) -> str:
        return self.ph.hash(password)
    

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return self.ph.verify(hash=hashed_password, password=plain_password)
        except VerifyMismatchError:
            return False
    

    def generate_access_token(self, user_id: UUID) -> str:
        now = datetime.now(timezone.utc)
        expire = now + timedelta(days=self.access_token_expire_days)

        payload = {
            "sub": str(user_id),
            "iat": now,
            "exp": expire,
        }

        return jwt.encode(payload=payload, key=self.secret_key, algorithm=self.algorithm)


    def verify_access_token(self, token: str) -> dict:
        try:
            payload: dict = jwt.decode(jwt=token, key=self.secret_key, algorithms=[self.algorithm])
            payload["sub"] = UUID(payload.get("sub"))
            return payload
        except (jwt.exceptions.PyJWTError, ValueError, TypeError):
            raise InvalidTokenError