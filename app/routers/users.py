from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.engine import Engine

from app.services.db import get_engine

router = APIRouter()

@router.get("/", summary="List users")
def list_users(engine: Engine = Depends(get_engine)):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, name, email FROM users ORDER BY id LIMIT 100"))
        rows = [dict(row._mapping) for row in result]
    return {"users": rows}
