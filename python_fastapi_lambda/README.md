# Python FastAPI on AWS Lambda with PostgreSQL

This module provides a minimal FastAPI application prepared to run on AWS Lambda using [Mangum](https://github.com/jordaneremieff/mangum), with PostgreSQL access via `asyncpg`.

## Layout

- `app/main.py`: FastAPI application factory and `/health` endpoint
- `app/routes.py`: DB-related GET routes (`/db/ping`, `/users`, `/users/{id}`)
- `app/db.py`: PostgreSQL async connection pool
- `app/handler.py`: AWS Lambda handler (`app.handler.handler`)
- `requirements.txt`: Python dependencies

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export PGHOST=127.0.0.1 PGPORT=5432 PGUSER=postgres PGPASSWORD=postgres PGDATABASE=postgres
uvicorn app.main:app --reload --port 8080
```

Visit `http://localhost:8080/health`.

## Lambda deployment

- Package this folder as a Lambda layer or function. Set the handler to `app.handler.handler`.
- For API Gateway (HTTP or REST), integrate with Lambda proxy to expose FastAPI routes.
- Provide `DATABASE_URL` or the individual `PG*` environment variables.
