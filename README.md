# 🐾 CozyCritters API

A cute virtual pet management API built with **FastAPI** and **PostgreSQL**. Create your own digital pets, feed them, play with them, and watch them grow!

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 🎮 **Pet Interactions** - Feed, play, and put your pets to sleep
- 📊 **Pet Stats** - Track hunger, happiness, and energy levels
- 💾 **PostgreSQL Database** - Persistent data storage with proper user isolation
- 🚀 **RESTful API** - Clean, intuitive endpoints with automatic documentation
- 🤖 **Emoji Status** - Real-time pet mood indicators

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- PostgreSQL 15+ (or Docker)
- macOS/Linux/Windows

### Installation

1. **Clone the repository**

   ```bash
   cd /Users/sadhanauprety/Desktop/CozyCritters
   ```

2. **Create and activate virtual environment**

   ```bash
   python3.12 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   uv pip install -r requirements.txt
   # Or manually:
   uv add fastapi uvicorn sqlalchemy 'psycopg[binary]' \
     'python-jose[cryptography]' python-multipart 'passlib[bcrypt]' pydantic-settings
   ```

4. **Set up PostgreSQL**

   **Option A: Using Homebrew (macOS)**

   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   createdb -U postgres cozycritters
   ```

   **Option B: Using Docker**

   ```bash
   docker run -d -p 5432:5432 \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=cozycritters \
     postgres:15
   ```

5. **Configure database connection**

   Edit `database.py` and update the `DATABASE_URL`:

   ```python
   DATABASE_URL = "postgresql+psycopg://postgres:password@localhost:5432/cozycritters"
   ```

6. **Run the server**

   ```bash
   source .venv/bin/activate
   uvicorn main:app --reload
   ```

7. **Access the API**
   - Main API: http://localhost:8000
   - Interactive Docs (Swagger): http://localhost:8000/docs
   - Alternative Docs (ReDoc): http://localhost:8000/redoc

---

## 📚 API Documentation

### Authentication Endpoints

#### 1. **Sign Up** `POST /signup`

Create a new user account and get a starter pet automatically!

**Request:**

```json
{
  "email": "user@example.com",
  "username": "sadhana",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "sadhana"
}
```

**Notes:**

- Username must be unique
- Email must be unique
- A default pet is automatically created with a name based on the first letter of your username
- Example: username "sadhana" → pet "Snuggly" 🐾

---

#### 2. **Login** `POST /login`

Authenticate and get a JWT access token.

**Request (form data):**

```
username: sadhana
password: securepassword123
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Notes:**

- Token expires in 30 minutes
- Use this token in the `Authorization: Bearer <token>` header for authenticated requests

---

#### 3. **Get Current User** `GET /me`

Retrieve information about the logged-in user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "sadhana"
}
```

---

### Pet Management Endpoints

#### 4. **Create Pet** `POST /critters/`

Create a new pet for the current user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Fluffy",
  "species": "Bunny",
  "description": "My adorable pet bunny"
}
```

**Response:**

```json
{
  "id": 2,
  "user_id": 1,
  "name": "Fluffy",
  "species": "Bunny",
  "description": "My adorable pet bunny",
  "hunger": 50,
  "happiness": 80,
  "energy": 80,
  "last_updated": "2026-05-29T12:33:25.886Z",
  "last_interaction_time": "2026-05-29T12:33:25.886Z",
  "status": "🙂 Content"
}
```

---

#### 5. **Get All Pets** `GET /critters/`

Retrieve all pets for the current user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Snuggly",
    "species": "Critter",
    "description": "Default pet for sadhana",
    "hunger": 45,
    "happiness": 75,
    "energy": 70,
    "last_updated": "2026-05-29T13:00:00.000Z",
    "last_interaction_time": "2026-05-29T13:00:00.000Z",
    "status": "🙂 Content"
  },
  ...
]
```

---

#### 6. **Get Specific Pet** `GET /critters/{critter_id}`

Retrieve details of a specific pet.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** Same as Create Pet response

---

#### 7. **Update Pet** `PUT /critters/{critter_id}`

Update pet details (name, species, description).

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Snuggly Jr.",
  "species": "Super Critter",
  "description": "Updated description"
}
```

**Notes:**

- Only send fields you want to update
- Other fields remain unchanged

---

#### 8. **Delete Pet** `DELETE /critters/{critter_id}`

Remove a pet from the system.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Critter deleted successfully"
}
```

---

### Pet Interaction Endpoints

#### 9. **Feed Pet** `POST /critters/{critter_id}/feed`

Give food to your pet.

**Effects:**

- 🍽️ Hunger: `-30`
- ⚡ Energy: `-5`
- ⏰ Updates: `last_interaction_time`

**Requirements:**

- Pet must have energy ≥ 10

**Response:** Updated pet state with new stats

---

#### 10. **Play with Pet** `POST /critters/{critter_id}/play`

Have fun with your pet!

**Effects:**

- 😊 Happiness: `+25`
- 🍽️ Hunger: `+15`
- ⚡ Energy: `-20`
- ⏰ Updates: `last_interaction_time`

**Requirements:**

- Pet must have energy ≥ 20

**Response:** Updated pet state with new stats

---

#### 11. **Sleep** `POST /critters/{critter_id}/sleep`

Let your pet rest and recharge.

**Effects:**

- ⚡ Energy: `+40`
- 🍽️ Hunger: `+5`
- ⏰ Updates: `last_interaction_time`

**Requirements:**

- No minimum energy requirement

**Response:** Updated pet state with new stats

---

## 📊 Pet Stats Explained

### Hunger (0-100)

- **0**: Not hungry at all
- **50**: Normal
- **100**: Starving!
- **Increases when:** Playing, sleeping
- **Decreases when:** Feeding

### Happiness (0-100)

- **0**: Very sad
- **80+**: Happy!
- **100**: Extremely happy
- **Increases when:** Playing
- **Decreases over time:** When neglected

### Energy (0-100)

- **0**: Exhausted (can't interact)
- **50**: Normal
- **80+**: Full of energy!
- **Increases when:** Sleeping
- **Decreases when:** Playing, feeding

---

## 😊 Pet Status Emoji

The API automatically computes your pet's mood:

| Status  | Emoji | Condition                      |
| ------- | ----- | ------------------------------ |
| Tired   | 😴    | Energy < 30                    |
| Hungry  | 😫    | Hunger > 70                    |
| Sad     | 😢    | Happiness < 30                 |
| Happy   | 😊    | Happiness > 80 AND Energy > 70 |
| Content | 🙂    | Happiness > 60                 |
| Neutral | 😐    | Default state                  |







