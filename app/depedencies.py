from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth import get_current_user


SessionDep = Annotated[AsyncSession, Depends(get_db)]
CurrentUserDep = Annotated[dict, Depends(get_current_user)]