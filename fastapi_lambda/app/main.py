from contextlib import asynccontextmanager
from fastapi import FastAPI
from mangum import Mangum

from .db import get_pool, close_pool


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Open pool on startup (Lambda cold start) and close on shutdown (local dev)
    get_pool()
    try:
        yield
    finally:
        # In Lambda, process freeze keeps connections. FastAPI won't call shutdown.
        # When running locally, this ensures a clean shutdown.
        close_pool()


app = FastAPI(title="Lambda FastAPI with PostgreSQL", lifespan=lifespan)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db/info")
def db_info():
    pool = get_pool()
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("select version();")
            version_row = cur.fetchone()
            cur.execute("select current_database(), current_user;")
            db_row = cur.fetchone()

    return {
        "postgres_version": version_row[0] if version_row else None,
        "database": db_row[0] if db_row else None,
        "user": db_row[1] if db_row else None,
        "pool_stats": {
            "max_size": pool.max_size,
            "min_size": pool.min_size,
            "num_connections": pool.total_connections,
        },
    }


handler = Mangum(app)
