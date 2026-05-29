from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool

import os

# PostgreSQL database URL
# Format: postgresql+psycopg://username:password@host:port/database
# Default PostgreSQL port is 5432.
# On macOS Homebrew, we fallback to a passwordless connection using the local OS user.
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+psycopg://localhost:5432/cozycritters"
)

# Create the database engine
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # Disable connection pooling for development
    echo=True,  # Set to False in production; logs SQL queries
)

# Create a session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for database models
Base = declarative_base()


def get_db():
    """Dependency for injecting database sessions into FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
