from pydantic_settings import BaseSettings
from datetime import timedelta


class Settings(BaseSettings):
    """Application settings."""
    # JWT Settings
    SECRET_KEY: str = "a62vchdkandakjshdflkjh234234234234234234234234234EXAMPLE SECRET"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"


settings = Settings()
