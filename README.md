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

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL
);
```

### Critters Table

```sql
CREATE TABLE critters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL FOREIGN KEY REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50),
  description VARCHAR(500),
  hunger INTEGER DEFAULT 50,
  happiness INTEGER DEFAULT 80,
  energy INTEGER DEFAULT 80,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_interaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing the API

### Using Swagger UI

1. Go to http://localhost:8000/docs
2. Click on an endpoint to expand it
3. Click **"Try it out"**
4. Fill in the parameters
5. Click **"Execute"**

### Using cURL

**Sign Up:**

```bash
curl -X POST "http://localhost:8000/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

**Get Pets (replace TOKEN):**

```bash
curl -X GET "http://localhost:8000/critters/" \
  -H "Authorization: Bearer TOKEN"
```

**Feed Pet:**

```bash
curl -X POST "http://localhost:8000/critters/1/feed" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcrypt with salt for secure password storage
- ✅ **User Isolation** - Each user can only access their own pets
- ✅ **Foreign Keys** - Database-level referential integrity
- ✅ **Input Validation** - Pydantic models validate all requests

---

## 📁 Project Structure

```
CozyCritters/
├── main.py              # FastAPI app, routes, and models
├── database.py          # Database configuration and session management
├── auth.py              # JWT and password hashing utilities
├── config.py            # Application settings
├── pyproject.toml       # Dependencies
├── README.md            # This file
└── .venv/               # Virtual environment
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file to override defaults:

```env
SECRET_KEY=your-super-secret-key-here-change-in-production
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/cozycritters
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### JWT Secret

**⚠️ IMPORTANT:** Change the `SECRET_KEY` in `config.py` for production!

```python
# In config.py
SECRET_KEY = "your-production-secret-key-here"
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Change `SECRET_KEY` to a long, random string
- [ ] Set `echo=False` in `database.py` (disable SQL logging)
- [ ] Use environment variables for sensitive data
- [ ] Set up proper CORS if needed
- [ ] Use a production ASGI server (Gunicorn, Uvicorn cluster)
- [ ] Set up SSL/TLS certificates

### Deploy with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## 🔮 Future Enhancements

- 🎯 **Hunger Decay** - Pets get hungrier based on time offline
- 🏆 **Leaderboards** - Track top pet owners by happiness/stats
- 🎨 **Pet Customization** - Change pet colors, accessories
- 💾 **Save/Load** - Export and import pet data
- 📱 **Mobile App** - React Native frontend
- ⚡ **Multiplayer** - Pet interactions between users
- 🎁 **Achievements** - Badges and milestones
- 🐕 **Pet Evolution** - Pets grow and evolve over time
- 🌍 **Breeding System** - Create offspring from two pets
- 💰 **In-game Currency** - Buy items and upgrades

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error

```
ModuleNotFoundError: No module named 'psycopg'
```

**Solution:**

```bash
source .venv/bin/activate
uv add 'psycopg[binary]'
```

### Port Already in Use

```
Address already in use: ('127.0.0.1', 8000)
```

**Solution:**

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
# Or use different port
uvicorn main:app --port 8001
```

### Token Expired

```
"Could not validate credentials"
```

**Solution:** Login again to get a fresh token

---

## 📝 License

This project is open source and available for personal and educational use.

---

## 👤 Author

Created by **Sadhana Uprety** 🎉

---

## 📞 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the API documentation at `/docs`
3. Check PostgreSQL is running: `brew services list`
4. Verify virtual environment is activated

---

**Happy Critter caring! 🐾**
