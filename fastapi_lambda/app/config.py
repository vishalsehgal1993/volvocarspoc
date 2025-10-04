from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "postgres"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_sslmode: str = "prefer"

    class Config:
        env_prefix = "APP_"
        case_sensitive = False


settings = Settings()  # type: ignore
