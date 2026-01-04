from typing import AsyncGenerator

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.settings import settings


class Base(DeclarativeBase):
    pass


if settings.app_env == "local":
    engine = create_async_engine(url=settings.database_url, echo=True)
else:
    #TODO: prod engine
    pass

SessionLocal = async_sessionmaker(bind=engine, autoflush=True, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)