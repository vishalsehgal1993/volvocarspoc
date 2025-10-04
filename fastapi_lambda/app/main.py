import json
import boto3
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from botocore.exceptions import ClientError
from contextlib import asynccontextmanager
from fastapi import FastAPI
from mangum import Mangum

from .db import get_pool, close_pool

SECRET_NAME = "my-fastapi-secret"
AWS_REGION = "us-east-1"
app_secrets = {}

def get_aws_secret(secret_name: str, region_name: str) -> dict:
    """Retrieves a secret from AWS Secrets Manager."""
    try:
        session = boto3.Session()
        client = session.client(service_name='secretsmanager', region_name=region_name)
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            return json.loads(get_secret_value_response['SecretString'])
        else:
            raise ValueError("Secret is not a string type.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads secrets into app_secrets dictionary at startup."""
    print("Application starting up: Fetching secrets...")
    try:
        secrets = get_aws_secret(SECRET_NAME, AWS_REGION)
        app_secrets.update(secrets)
        print("Successfully loaded secrets.")
    except Exception as e:
        print(f"Error loading secrets: {e}")
        raise RuntimeError("Failed to load secrets at startup.")

    yield
    print("Application shutting down.")

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
