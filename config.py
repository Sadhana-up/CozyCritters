from pydantic_settings import BaseSettings
from datetime import timedelta


class Settings(BaseSettings):
    """Application settings."""
    # JWT Settings - MUST be set via environment variables for security
    SECRET_KEY: str  # Required environment variable, no default
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./test.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
