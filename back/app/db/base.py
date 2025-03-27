from collections.abc import AsyncGenerator

from app.config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import (AsyncSession, async_sessionmaker,
                                    create_async_engine)
from sqlalchemy.orm import DeclarativeMeta, declarative_base, sessionmaker

Base: DeclarativeMeta = declarative_base()

# Async database URL and engine
async_db_url = f"postgresql+asyncpg://{settings.POSTGRES_URL}"
async_engine = create_async_engine(url=async_db_url)
async_sessionmaker = async_sessionmaker(async_engine, expire_on_commit=False)

# Sync database URL and engine
sync_db_url = f"postgresql+psycopg2://{settings.POSTGRES_URL}"
sync_engine = create_engine(url=sync_db_url)
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_sessionmaker() as session:
        yield session
