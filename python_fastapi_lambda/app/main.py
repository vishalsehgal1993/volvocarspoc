from fastapi import FastAPI
from .routes import router


SERVICE_NAME = "Lambda FastAPI Service"
SERVICE_VERSION = "0.1.0"


def create_app() -> FastAPI:
    app = FastAPI(title=SERVICE_NAME, version=SERVICE_VERSION)
    app.include_router(router)

    @app.get("/health")
    async def health_check() -> dict:
        return {"status": "ok", "service": SERVICE_NAME, "version": SERVICE_VERSION}

    return app


app = create_app()
