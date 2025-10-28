from fastapi import FastAPI
from mangum import Mangum

from app.routers import health, users

app = FastAPI(title="Lambda FastAPI with PostgreSQL")

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(users.router, prefix="/users", tags=["users"])

handler = Mangum(app)  # AWS Lambda entrypoint
