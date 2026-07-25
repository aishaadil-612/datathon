import os
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(dotenv_path=env_path, override=True)
except ImportError:
    pass

try:
    from pydantic_settings import BaseSettings
    from pydantic import Field
except ImportError:
    # Fallback lightweight BaseSettings implementation if pydantic_settings is not pre-installed
    class BaseSettings:  # type: ignore
        def __init__(self, **data):
            for key, val in self.__annotations__.items():
                env_val = os.getenv(key.upper(), getattr(self, key, None))
                setattr(self, key, env_val if env_val is not None else data.get(key))

        class Config:
            env_file = ".env"

    def Field(default=None, **kwargs):  # type: ignore
        return default

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    ENV: str = Field("development")
    DEBUG: bool = Field(True)
    PORT: int = Field(8000)
    HOST: str = Field("0.0.0.0")
    APP_NAME: str = Field("ARGUS - Intelligence & Investigation Platform")

    # LLM Settings
    GEMINI_API_KEY: str = Field("mock_gemini_key_for_testing")
    GEMINI_MODEL: str = Field("gemini-2.0-flash-exp")

    # Postgres & Supabase Database Settings
    POSTGRES_USER: str = Field("postgres")
    POSTGRES_PASSWORD: str = Field("argus_secure_password")
    POSTGRES_DB: str = Field("postgres")
    POSTGRES_HOST: str = Field("localhost")
    POSTGRES_PORT: int = Field(5432)
    POSTGRES_SSLMODE: str = Field("prefer")
    DATABASE_URL: Optional[str] = Field(None)
    SUPABASE_URL: Optional[str] = Field(None)
    SUPABASE_ANON_KEY: Optional[str] = Field(None)
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(None)

    # Neo4j Database
    NEO4J_URI: str = Field("bolt://localhost:7687")
    NEO4J_USER: str = Field("neo4j")
    NEO4J_PASSWORD: str = Field("argus_graph_password")

    # JWT Security
    JWT_SECRET: str = Field("argus_jwt_super_secret_key_change_in_production_32_bytes")
    JWT_ALGORITHM: str = Field("HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(480)

    # Governance
    RATE_LIMIT_PER_MINUTE: int = Field(120)
    REQUIRE_EXPLANATION_SHAP: bool = Field(True)
    AUDIT_LOG_IMMUTABLE: bool = Field(True)

    def get_postgres_url(self) -> str:
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith("postgresql://"):
                return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
            return self.DATABASE_URL
        ssl_query = f"?sslmode={self.POSTGRES_SSLMODE}" if self.POSTGRES_SSLMODE else ""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_query}"

    def get_sync_postgres_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        ssl_query = f"?sslmode={self.POSTGRES_SSLMODE}" if self.POSTGRES_SSLMODE else ""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_query}"

settings = Settings()
