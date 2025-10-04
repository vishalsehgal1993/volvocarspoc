from __future__ import annotations

from typing import Optional

from psycopg_pool import ConnectionPool

from .config import settings

_pool: Optional[ConnectionPool] = None


def _build_dsn() -> str:
    return (
        f"host={settings.postgres_host} "
        f"port={settings.postgres_port} "
        f"dbname={settings.postgres_db} "
        f"user={settings.postgres_user} "
        f"password={settings.postgres_password} "
        f"sslmode={settings.postgres_sslmode}"
    )


def get_pool() -> ConnectionPool:
    global _pool
    if _pool is None:
        _pool = ConnectionPool(conninfo=_build_dsn(), min_size=0, max_size=4, open=False)
    if not _pool.opened:
        _pool.open()
    return _pool


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
