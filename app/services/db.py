from functools import lru_cache
from typing import Generator

from pydantic_settings import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

class Settings(BaseSettings):
    db_host: str
    db_port: int = 5432
    db_name: str
    db_user: str
    db_password: str

    class Config:
        env_prefix = "APP_"
        case_sensitive = False

@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # reads environment variables

@lru_cache(maxsize=1)
def get_engine_cached() -> Engine:
    settings = get_settings()
    # Use pg8000 driver for AWS Lambda compatibility (pure Python)
    uri = (
        f"postgresql+pg8000://{settings.db_user}:{settings.db_password}"
        f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
    )
    engine = create_engine(uri, pool_pre_ping=True)
    return engine

# FastAPI dependency
def get_engine() -> Engine:
    return get_engine_cached()
