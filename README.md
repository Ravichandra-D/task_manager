# ⚡ TaskFlow — Task Manager App

A clean, full-stack Task Manager where users can manage tasks across three stages: **Todo**, **In Progress**, and **Done**.

---

## ✨ Features

- **Authentication** — Register & Login with JWT-based sessions (tokens stored in localStorage, expire after 7 days)
- **Task CRUD** — Create, update, and delete tasks; each task has a title, optional description, and a stage
- **Kanban Board** — Three-column view (Todo / In Progress / Done) with live counts
- **Quick Stage Change** — Move tasks forward/backward with arrow buttons directly on the card
- **Responsive UI** — Works on desktop and mobile
- **Error & Loading States** — All async operations have loading spinners and user-facing error messages
- **Delete Confirmation** — Modal confirmation before deleting any task

---

## 🛠 Tech Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Frontend  | React 18 + Vite, React Router, Axios   |
| Backend   | Node.js + Express, JWT, bcryptjs       |
| Storage   | In-memory (no database required to run) |
| Styling   | Pure CSS with CSS Variables            |

> **Backend is mandatory** per the assignment requirement (AI tools were used during development).

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── server.js          # Express entry point
│   ├── .env               # JWT_SECRET and PORT
│   ├── routes/
│   │   ├── auth.js        # POST /register, POST /login, GET /me
│   │   └── tasks.js       # GET/POST /tasks, GET/PUT/DELETE /tasks/:id
│   ├── middleware/
│   │   └── auth.js        # JWT verification middleware
│   └── data/
│       └── store.js       # In-memory users & tasks arrays
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.js  # Axios instance with JWT interceptors
    │   │   ├── auth.js    # Auth API calls
    │   │   └── tasks.js   # Task API calls
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── components/
    │   │   ├── UI.jsx          # Shared UI components (Button, Input, Modal, etc.)
    │   │   ├── TaskCard.jsx    # Individual task card
    │   │   ├── TaskForm.jsx    # Create/Edit task modal
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       └── Dashboard.jsx   # Main kanban board
    └── vite.config.js          # Dev proxy to backend
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone / unzip the project

```bash
unzip task-manager.zip
cd task-manager
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

> Server starts at **http://localhost:5000**

The `.env` file is included with a default `JWT_SECRET`. Change it for production.

### 3. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

> App opens at **http://localhost:5173**

The Vite dev server proxies all `/api` requests to `localhost:5000` automatically.

### 4. Open in browser

Navigate to **http://localhost:5173**, register an account, and start creating tasks.

---

## 🔌 API Reference

All task routes require `Authorization: Bearer <token>` header.

| Method | Endpoint              | Auth | Description            |
|--------|-----------------------|------|------------------------|
| POST   | `/api/auth/register`  | No   | Create account         |
| POST   | `/api/auth/login`     | No   | Login, get token       |
| GET    | `/api/auth/me`        | Yes  | Get current user       |
| GET    | `/api/tasks`          | Yes  | List all tasks         |
| POST   | `/api/tasks`          | Yes  | Create a task          |
| PUT    | `/api/tasks/:id`      | Yes  | Update a task          |
| DELETE | `/api/tasks/:id`      | Yes  | Delete a task          |

---

## 🏗 Architecture Decisions & Tradeoffs

### In-memory storage
**Decision:** Tasks and users are stored in plain arrays in memory, not a database.

**Tradeoff:** Data does not persist across server restarts. For a production app, I'd swap this for MongoDB or PostgreSQL — the store is isolated in `data/store.js` so the swap is straightforward.

**Reason:** Keeps the setup zero-friction (no Docker, no database install). The assignment said backend deployment is optional, so simplicity was prioritized.

### JWT in localStorage
**Decision:** JWT tokens stored in localStorage rather than httpOnly cookies.

**Tradeoff:** Slightly more vulnerable to XSS vs cookies, but simpler to implement in a frontend-only deployment scenario and avoids CSRF complexity. Acceptable for this scope.

### Vite proxy vs CORS
**Decision:** Use Vite's built-in dev proxy (`/api → localhost:5000`) rather than configuring CORS headers for every route.

**Tradeoff:** Works seamlessly in development. For production deployment, you'd configure proper CORS origins or serve the frontend from the same origin as the backend.

### No external state management
**Decision:** React Context + useState instead of Redux/Zustand.

**Reason:** The app state is simple — a list of tasks and an auth user. Adding a state manager would be over-engineering.

### Inline styles vs CSS modules
**Decision:** Inline styles in JSX with CSS variables for theming.

**Reason:** Self-contained components, no build-time CSS processing, easy to read. Tradeoff is slightly more verbose JSX, but fine for this scale.

---

## 🎁 Bonus Features Implemented

- ✅ Custom backend REST API (Express)
- ✅ JWT authentication (register + login + token verification)
- ✅ Input validation on both frontend and backend
- ✅ Quick stage progression buttons on task cards
- ✅ Delete confirmation modal
- ✅ Stats summary bar showing counts per stage
