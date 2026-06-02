# NUNAP Backend API

Express + MongoDB REST API for the **Njala University Nurses Association Portal**.

## Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT authentication
- bcrypt password hashing
- Multer file uploads (PDFs & images)

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `TAVILY_API_KEY` | Optional key for live web research in assistant |

### 3. Start MongoDB

Use local MongoDB or [MongoDB Atlas](https://www.mongodb.com/atlas).

### 4. Seed database (optional)

```bash
npm run seed
```

Creates:
- **Admin:** `admin@nuna.edu.sl` / `NUNA@Admin2026`
- **Demo student:** `student@nuna.edu.sl` / `Student@2026`
- Sample hospitals, announcements, and leadership

### 5. Run server

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |
| POST | `/api/auth/forgot-password` | Public |
| PUT | `/api/auth/reset-password/:token` | Public |

### Hospitals (Clinical locations)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/hospitals` | Public |
| GET | `/api/hospitals/:id` | Public |
| POST | `/api/hospitals` | Admin |
| PUT | `/api/hospitals/:id` | Admin |
| DELETE | `/api/hospitals/:id` | Admin |

### Clinical applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications` | Student |
| GET | `/api/applications/me` | Student |
| GET | `/api/applications` | Admin, Supervisor |
| PATCH | `/api/applications/:id/status` | Admin, Supervisor |
| GET | `/api/applications/stats` | Admin, Supervisor |

### Announcements
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/announcements` | Public |
| POST | `/api/announcements` | Admin, Leader |
| PUT | `/api/announcements/:id` | Admin, Leader |
| DELETE | `/api/announcements/:id` | Admin, Leader |

### Modules & Timetables
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/modules` | Public |
| POST | `/api/modules` | Admin (multipart PDF) |
| PUT | `/api/modules/:id` | Admin |
| DELETE | `/api/modules/:id` | Admin |
| GET | `/api/timetables` | Public |
| POST | `/api/timetables` | Admin (multipart PDF) |

### Student profile & digital ID
| Method | Endpoint | Access |
|--------|----------|--------|
| PUT | `/api/auth/profile` | Logged-in user (students: name, level, dept, phone) |
| POST | `/api/auth/profile/photo` | Student (`multipart` field `photo`) |
| GET | `/api/id-card/me` | Student (logged in) |
| POST | `/api/id-card/regenerate` | Student |
| GET | `/api/id-card/verify/:code` | Public |

QR codes link to `{CLIENT_URL}/verify-id/NUNA-XXXXXXXXXXXX` for instant membership checks.

### Chat (student messaging)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/chat/contacts` | Logged-in user |
| GET | `/api/chat/conversations` | Logged-in user |
| POST | `/api/chat/conversations` | Logged-in user (`{ userId }`) |
| GET | `/api/chat/conversations/:id/messages` | Participant |
| POST | `/api/chat/conversations/:id/messages` | Participant |

Real-time updates use **Socket.io** on the same server port (authenticate with JWT in `auth.token`).

### AI Assistant (Q&A, research, GPA interpretation)
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/assistant/ask` | Logged-in user |
| POST | `/api/assistant/gpa` | Logged-in user |

- `POST /api/assistant/ask` body:

```json
{
  "question": "What are the latest WHO recommendations for malaria prevention?",
  "doResearch": true
}
```

- `POST /api/assistant/gpa` body:

```json
{
  "scale": 5,
  "courses": [
    { "code": "NSC201", "units": 3, "grade": "A" },
    { "code": "NSC203", "units": 2, "score": 67 },
    { "code": "NSC205", "units": 3, "grade": "B" }
  ]
}
```

The GPA endpoint returns:
- normalized courses (with computed grade points)
- total units and quality points
- `gpa`, `gpaRounded`
- final class interpretation (`First Class`, `Second Class Upper`, etc.)

### Leadership & Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/leadership` | Public |
| CRUD | `/api/leadership/:id` | Admin |
| GET | `/api/users` | Admin |

## Authentication

Send JWT in the header:

```
Authorization: Bearer <token>
```

### Register (student)

```json
POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@email.com",
  "password": "password123",
  "matricNumber": "NUNAP2024010",
  "level": "Year 2",
  "phone": "+232 76 000 000"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "admin@nuna.edu.sl",
  "password": "NUNA@Admin2026"
}
```

## Roles

- `student` — apply for postings, view content, chat with classmates and staff
- `lecturer` — appears in student chat as a lecturer contact
- `leader` — post announcements
- `clinical_supervisor` — review applications
- `admin` — full management access

## Frontend connection

Add to React `.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

- **Backend:** Render, Railway, or similar
- **Database:** MongoDB Atlas
- Set `CLIENT_URL` to your Vercel frontend URL
