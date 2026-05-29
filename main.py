from contextlib import asynccontextmanager
from datetime import timedelta, datetime
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import Base, get_db, create_tables, engine
from auth import hash_password, verify_password, create_access_token, get_current_user
from config import settings


# --- Lifespan context manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # Startup
    create_tables()
    print("Database tables created successfully!")
    yield
    # Shutdown
    print("Application shutting down...")


app = FastAPI(
    title="CozyCritters API",
    description="A cute pet management API with PostgreSQL",
    version="0.1.0",
    lifespan=lifespan,
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Database Models ---
class User(Base):
    """Database model for a user."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))


class Critter(Base):
    """Database model for a critter (pet)."""
    __tablename__ = "critters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign key to users
    name = Column(String(100), index=True)
    species = Column(String(50))
    description = Column(String(500), nullable=True)
    
    # Pet stats
    hunger = Column(Integer, default=50)  # 0-100 (0 = not hungry, 100 = starving)
    happiness = Column(Integer, default=80)  # 0-100
    energy = Column(Integer, default=80)  # 0-100
    
    # Timestamps
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_interaction_time = Column(DateTime, default=datetime.utcnow)  # Track last interaction for offline progress


# --- Pydantic Models for API ---
class UserRegister(BaseModel):
    """Schema for user registration."""
    email: str
    username: str
    password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for returning user data."""
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for token data."""
    user_id: Optional[int] = None


class CritterCreate(BaseModel):
    """Schema for creating a new critter."""
    name: str
    species: str
    description: str = None


class CritterUpdate(BaseModel):
    """Schema for updating a critter."""
    name: str = None
    species: str = None
    description: str = None


class CritterResponse(BaseModel):
    """Schema for returning critter data."""
    id: int
    user_id: int
    name: str
    species: str
    description: str = None
    hunger: int
    happiness: int
    energy: int
    last_updated: datetime
    last_interaction_time: datetime
    status: str = None  # Computed field

    class Config:
        from_attributes = True
    
    @staticmethod
    def get_pet_status(hunger: int, happiness: int, energy: int) -> str:
        """Compute pet status based on stats."""
        if energy < 30:
            return "😴 Tired"
        elif hunger > 70:
            return "😫 Hungry"
        elif happiness < 30:
            return "😢 Sad"
        elif happiness > 80 and energy > 70:
            return "😊 Happy"
        elif happiness > 60:
            return "🙂 Content"
        else:
            return "😐 Neutral"



@app.get("/", tags=["Root"])
async def root():
    """Welcome endpoint."""
    return {
        "message": "Welcome to CozyCritters API",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


# --- Authentication Endpoints ---
@app.post("/signup", response_model=UserResponse, tags=["Auth"])
async def signup(user: UserRegister, db: Session = Depends(get_db)):
    """Register a new user and automatically create a pet."""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Automatically create a pet for the new user
    pet_names = {
        "a": "Fuzzy", "b": "Bouncy", "c": "Cozy", "d": "Drifty", "e": "Echo",
        "f": "Fluffy", "g": "Giggly", "h": "Happy", "i": "Iris", "j": "Jumpy",
        "k": "Kindly", "l": "Lucky", "m": "Merry", "n": "Nifty", "o": "Olive",
        "p": "Playful", "q": "Quick", "r": "Rascal", "s": "Snuggly", "t": "Tiny",
        "u": "Unity", "v": "Vivid", "w": "Wiggly", "x": "Xeric", "y": "Yoyo",
        "z": "Zippy"
    }
    
    # Get pet name based on first letter of username
    first_letter = user.username[0].lower()
    pet_name = pet_names.get(first_letter, "Buddy")
    
    now = datetime.utcnow()
    default_pet = Critter(
        user_id=db_user.id,
        name=pet_name,
        species="Critter",
        description=f"Default pet for {user.username}",
        hunger=50,
        happiness=80,
        energy=80,
        last_interaction_time=now,
    )
    db.add(default_pet)
    db.commit()
    
    return db_user


@app.post("/login", response_model=Token, tags=["Auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token."""
    # Find user by username
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=UserResponse, tags=["Auth"])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user


@app.post("/critters/", response_model=CritterResponse, tags=["Critters"])
async def create_critter(critter: CritterCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new critter in the database."""
    now = datetime.utcnow()
    db_critter = Critter(
        user_id=current_user.id,
        name=critter.name,
        species=critter.species,
        description=critter.description,
        last_interaction_time=now,
    )
    db.add(db_critter)
    db.commit()
    db.refresh(db_critter)
    
    response = CritterResponse.from_orm(db_critter)
    response.status = CritterResponse.get_pet_status(db_critter.hunger, db_critter.happiness, db_critter.energy)
    return response


@app.get("/critters/", response_model=list[CritterResponse], tags=["Critters"])
async def get_critters(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all critters for the current user."""
    critters = db.query(Critter).filter(Critter.user_id == current_user.id).all()
    
    # Add computed status to each critter
    responses = []
    for critter in critters:
        response = CritterResponse.from_orm(critter)
        response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
        responses.append(response)
    
    return responses


@app.get("/critters/{critter_id}", response_model=CritterResponse, tags=["Critters"])
async def get_critter(critter_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific critter by ID."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    # Add computed status
    response = CritterResponse.from_orm(critter)
    response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
    return response


@app.put("/critters/{critter_id}", response_model=CritterResponse, tags=["Critters"])
async def update_critter(critter_id: int, critter_update: CritterUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update a critter's details."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    # Update fields if provided
    if critter_update.name is not None:
        critter.name = critter_update.name
    if critter_update.species is not None:
        critter.species = critter_update.species
    if critter_update.description is not None:
        critter.description = critter_update.description
    
    db.commit()
    db.refresh(critter)
    
    response = CritterResponse.from_orm(critter)
    response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
    return response


@app.delete("/critters/{critter_id}", tags=["Critters"])
async def delete_critter(critter_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a critter."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    db.delete(critter)
    db.commit()
    return {"message": "Critter deleted successfully"}


# --- Pet Interaction Endpoints ---
@app.post("/critters/{critter_id}/feed", response_model=CritterResponse, tags=["Interactions"])
async def feed_critter(critter_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Feed the critter - decreases hunger, costs energy."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    if critter.energy < 10:
        raise HTTPException(status_code=400, detail="Pet is too tired to eat! Let them sleep first.")
    
    # Feed interaction
    now = datetime.utcnow()
    critter.hunger = max(0, critter.hunger - 30)  # Decrease hunger by 30
    critter.energy = max(0, critter.energy - 5)   # Costs 5 energy
    critter.last_updated = now
    critter.last_interaction_time = now
    
    db.commit()
    db.refresh(critter)
    
    response = CritterResponse.from_orm(critter)
    response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
    return response


@app.post("/critters/{critter_id}/play", response_model=CritterResponse, tags=["Interactions"])
async def play_with_critter(critter_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Play with the critter - increases happiness, increases hunger and tiredness."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    if critter.energy < 20:
        raise HTTPException(status_code=400, detail="Pet is too tired to play! Let them sleep first.")
    
    # Play interaction
    now = datetime.utcnow()
    critter.happiness = min(100, critter.happiness + 25)  # Increase happiness by 25
    critter.hunger = min(100, critter.hunger + 15)        # Increase hunger by 15
    critter.energy = max(0, critter.energy - 20)          # Costs 20 energy
    critter.last_updated = now
    critter.last_interaction_time = now
    
    db.commit()
    db.refresh(critter)
    
    response = CritterResponse.from_orm(critter)
    response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
    return response


@app.post("/critters/{critter_id}/sleep", response_model=CritterResponse, tags=["Interactions"])
async def sleep_critter(critter_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Let the critter sleep - restores energy, decreases hunger slightly."""
    critter = db.query(Critter).filter(
        (Critter.id == critter_id) & (Critter.user_id == current_user.id)
    ).first()
    
    if not critter:
        raise HTTPException(status_code=404, detail="Critter not found")
    
    # Sleep interaction
    now = datetime.utcnow()
    critter.energy = min(100, critter.energy + 40)        # Increase energy by 40
    critter.hunger = min(100, critter.hunger + 5)         # Slight hunger increase
    critter.last_updated = now
    critter.last_interaction_time = now
    
    db.commit()
    db.refresh(critter)
    
    response = CritterResponse.from_orm(critter)
    response.status = CritterResponse.get_pet_status(critter.hunger, critter.happiness, critter.energy)
    return response


def main():
    """Run the FastAPI application."""
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  
    )


if __name__ == "__main__":
    main()
