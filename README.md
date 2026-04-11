# Task Flow

A clean and modern productivity app for managing tasks and tracking job applications — built with React, Express, and Prisma.

---

## Features

- **Task Manager** — Create, prioritize (High / Medium / Low), and complete tasks
- **Job Application Tracker** — Track companies, roles, and interview statuses (Applied / Interviewing / Offered / Rejected)
- **Authentication** — Email & password sign-up / sign-in with session persistence
- **Dark / Light Mode** — System-aware theme toggle across all pages
- **Time-aware Greeting** — Personalized greeting based on local time
- **AWS Ready** — Static serving, health check endpoint, and RDS-compatible Prisma config

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Node.js, Express |
| Database | Prisma ORM — SQLite (dev) / PostgreSQL (prod) |
| Auth | localStorage session (JWT-ready) |
| Deployment | AWS EC2 + RDS + ALB |

---

## Project Structure

```
Task Flow/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Logo, ThemeToggle, HowItWorks
│   │   ├── context/         # ThemeContext (dark/light mode)
│   │   ├── pages/           # LandingPage, SignIn, SignUp, Dashboard
│   │   └── utils/           # auth.js, greeting.js
│   └── index.html
│
├── server/                  # Express backend
│   ├── src/
│   │   └── client.js        # Prisma singleton
│   ├── prisma/
│   │   └── schema.prisma    # DB schema (User, Task, Job)
│   ├── index.js             # Entry point — API + static serving
│   └── .env.example         # Environment variable template
│
├── package.json             # Root monorepo scripts
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repository
```bash
git clone https://github.com/your-username/task-flow.git
cd task-flow
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Set up environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

### 4. Set up the database
```bash
cd server
npx prisma migrate dev --name init
cd ..
```

### 5. Run in development
Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Available Scripts (Root)

| Script | Description |
|---|---|
| `npm run install-all` | Install dependencies for both client and server |
| `npm run build-client` | Build the React app for production |
| `npm run start-server` | Start the Express server in production |
| `npm run build` | Full production build (install + build client) |
| `npm start` | Start the server |

---

## Deployment (AWS)

### Environment Variables (set in AWS EC2 / Elastic Beanstalk)
```
NODE_ENV=production
PORT=3000
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://user:pass@your-rds.amazonaws.com:5432/taskflow
JWT_SECRET=your-secret-key
```

### Build & Start
```bash
npm run build        # Installs deps + builds React
npm start            # Starts Express which serves both API and React
```

### AWS Load Balancer Health Check
The server exposes a `/health` endpoint that returns `200 OK` for ALB health checks.

---

## Created by

**Mustafa Abdulrahman**
"# TaskFlow-App" 
