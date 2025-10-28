import os
import asyncio
from typing import Optional

import asyncpg


class PostgresPool:
    _pool: Optional[asyncpg.pool.Pool] = None

    @classmethod
    async def get_pool(cls) -> asyncpg.pool.Pool:
        if cls._pool is None:
            database_url = os.environ.get("DATABASE_URL")
            if not database_url:
                # Construct from discrete env vars if URL not provided
                user = os.environ.get("PGUSER", "postgres")
                password = os.environ.get("PGPASSWORD", "postgres")
                host = os.environ.get("PGHOST", "127.0.0.1")
                port = int(os.environ.get("PGPORT", "5432"))
                database = os.environ.get("PGDATABASE", "postgres")
                database_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"

            cls._pool = await asyncpg.create_pool(dsn=database_url, min_size=1, max_size=5)
        return cls._pool

    @classmethod
    async def close_pool(cls) -> None:
        if cls._pool is not None:
            await cls._pool.close()
            cls._pool = None


async def ping_database() -> bool:
    pool = await PostgresPool.get_pool()
    async with pool.acquire() as connection:
        value = await connection.fetchval("SELECT 1")
        return value == 1
