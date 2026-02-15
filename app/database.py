from typing import AsyncGenerator
import ssl

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

from app.settings import settings


class Base(DeclarativeBase):
    pass


if settings.app_env == "local":
    engine = create_async_engine(url=settings.database_url, echo=True)
else:
    ssl_context = ssl.create_default_context()
    engine = create_async_engine(
        settings.database_url.split("?")[0],  # remove ?sslmode=require
        echo=True,
        poolclass=NullPool,
        connect_args={"ssl": ssl_context},
    )

SessionLocal = async_sessionmaker(bind=engine, autoflush=True, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_db() -> None:
    """Used in tests teardown to drop all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)