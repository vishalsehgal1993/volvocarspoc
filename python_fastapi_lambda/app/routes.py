from typing import List, Optional

from fastapi import APIRouter, HTTPException

from .db import PostgresPool

router = APIRouter()


@router.get("/db/ping")
async def db_ping() -> dict:
    try:
        pool = await PostgresPool.get_pool()
        async with pool.acquire() as connection:
            value = await connection.fetchval("SELECT 1")
            ok = value == 1
        return {"ok": ok}
    except Exception as exc:  # surface minimal diagnostic in non-prod
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/users")
async def list_users(limit: int = 50, offset: int = 0) -> List[dict]:
    pool = await PostgresPool.get_pool()
    async with pool.acquire() as connection:
        rows = await connection.fetch(
            "SELECT id, name, email FROM users ORDER BY id LIMIT $1 OFFSET $2",
            limit,
            offset,
        )
        return [dict(row) for row in rows]


@router.get("/users/{user_id}")
async def get_user(user_id: int) -> dict:
    pool = await PostgresPool.get_pool()
    async with pool.acquire() as connection:
        row = await connection.fetchrow(
            "SELECT id, name, email FROM users WHERE id = $1",
            user_id,
        )
        if row is None:
            raise HTTPException(status_code=404, detail="User not found")
        return dict(row)
