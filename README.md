# Internal Task & Management Dashboard (TaskHub Pro)

An enterprise-grade internal task and workflow management dashboard application built with a modern, decoupled full-stack architecture.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [How to Run Backend](#how-to-run-backend)
7. [How to Run Frontend](#how-to-run-frontend)
8. [API Documentation](#api-documentation)
9. [Any Assumptions Made](#any-assumptions-made)

---

## Project Overview
TaskHub Pro is a professional internal workspace platform designed for teams to collaborate, track task flows, comment on updates, and audit activity history metrics in real-time. It delivers responsive layouts optimized for mobile, tablet, and desktop views.

### Key Features
- **Dashboard Hub**: Displays analytics, status counts, assignee lists, upcoming targets, and recent updates.
- **Task Management**: Fully searchable, filterable, and paginated task grid. Support for low-to-urgent priorities, custom assignees, and due date alerts.
- **Task Details & Collaboration**: Chronological commentary thread allowing team members to communicate updates.
- **Audit Logging History**: Interactive change timeline recording task modifications (`TASK_CREATED`, `STATUS_CHANGED`, etc.).
- **Authentication & RBAC**: Secure JSON Web Token (JWT) strategies. Restricts critical actions (e.g. task deletions and users view) based on roles (`ADMIN`, `MANAGER`, `MEMBER`).
- **External Integration**: Cached list displaying metadata queries from third-party APIs. Allows admins to dynamically customize the source API URL and headers in real-time.

---

## Tech Stack

### Frontend
- **Framework**: React 18 (compiled via Vite)
- **State Management**: Redux Toolkit & React Redux
- **Data Querying**: TanStack Query (React Query) & Axios
- **Form Management**: React Hook Form & Zod Client validations
- **Styling**: Vanilla CSS custom styles
- **Icons & Alerts**: Lucide React & Sonner toaster popups

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Password Security**: bcryptjs for salt hashing
- **Security Middlewares**: Helmet, CORS, Compression, and Express Rate Limit

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or v20.x)
- **npm** (v9.x or v10.x)
- **PostgreSQL** server running locally or on a cloud instance

### 2. General Setup Steps
Clone the project repository and navigate to the project directory:
```bash
cd TaskDashboradProject
```

---

## Environment Variables

### Backend Environment Configuration
Create a `.env` file in the `backend/` directory by copying the example:
```bash
cd backend
cp .env.example .env
```

Configure the following variables in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/task_dashboard?schema=public
JWT_SECRET=supersecretfallbackkey
JWT_EXPIRES_IN=1d
API_TIMEOUT=30000
CORS_ORIGIN=*
```

### Frontend Environment Configuration
Create a `.env` file in the `frontend/` directory:
```bash
cd ../frontend
cp .env.example .env
```

Configure the following variable in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

Initialize the PostgreSQL database, execute migrations, and seed default seed settings:
```bash
cd ../backend
# 1. Install dependencies
npm install

# 2. Run Prisma migrations to construct tables
npx prisma migrate dev --name init

# 3. Seed default Admin and API integration settings
npm run prisma:seed
```

---

## How to Run Backend

Start the backend API development server:
```bash
cd backend
npm run dev
```
The API server will run on `http://localhost:5000`.

---

## How to Run Frontend

Start the React Vite SPA development server:
```bash
cd frontend
npm run dev
```
The application will run locally on `http://localhost:3000`.

---

## API Documentation

All API requests must be prefixed with `/api`. Authenticated routes require standard header format: `Authorization: Bearer <JWT_TOKEN>`.

### 1. Health Status Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check API server health and uptime | Public |

### 2. Authentication Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | Public |
| `POST` | `/api/auth/logout` | Terminate session cookies/state | Public |
| `GET` | `/api/auth/me` | Fetch active logged-in user profile | Bearer JWT |

### 3. Users Management Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Retrieve all system users (Dropdown helpers) | Bearer JWT |
| `GET` | `/api/users/:id` | Fetch specific user metadata by ID | Bearer JWT |
| `POST` | `/api/users` | Create a new user profile record | Admin / Manager |
| `PUT` | `/api/users/:id` | Update name, role, or credentials | Admin / Manager |
| `DELETE`| `/api/users/:id` | Terminate a user account from system | Admin Only |

### 4. Tasks Operations Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retrieve search, sort, and paginate tasks | Bearer JWT |
| `GET` | `/api/tasks/:id` | Fetch detailed single task data | Bearer JWT |
| `POST` | `/api/tasks` | Create a new task record | Bearer JWT |
| `PUT` | `/api/tasks/:id` | Update task status, priority, or assignees | Bearer JWT |
| `DELETE`| `/api/tasks/:id` | Terminate task record | Admin / Manager |
| `GET` | `/api/tasks/:id/activity`| Get chronological task activity audit logs | Bearer JWT |

### 5. Comments Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/:id/comments` | Retrieve comment thread history for a task | Bearer JWT |
| `POST` | `/api/tasks/:id/comments` | Post a new comment update | Bearer JWT |

### 6. Notifications Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Fetch active notifications for logged-in user | Bearer JWT |
| `PATCH`| `/api/notifications/read` | Mark all notifications as read | Bearer JWT |
| `PATCH`| `/api/notifications/:id/read` | Mark a specific notification as read | Bearer JWT |

### 7. Dashboard Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Compile task analytics counters & stats | Bearer JWT |

### 8. External Integration Endpoints
| Method | Endpoint | Description | Auth Scope |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/external/users` | Retrieve dynamic contacts list from API | Bearer JWT |
| `GET` | `/api/external/settings`| Fetch current custom API URL/Headers settings | Admin / Manager |
| `POST`| `/api/external/settings`| Save custom API settings and flush cache | Admin / Manager |

---

## Any Assumptions Made

1. **Default Administrator Credentials**: Seeding creates a default administrator account:
   - **Email**: `kamalpreet@example.com`
   - **Password**: `password`
2. **Caching Strategy**: The backend implements an in-memory cache proxy for third-party directories to prevent excessive outbound requests and network latency. Saving new API integration settings automatically flushes the cache.
3. **Role Restrictions**:
   - `ADMIN` & `MANAGER`: Can delete tasks, register API gateway configurations, and view external users.
   - `MEMBER`: Access is restricted to basic task tracking and commenting. The "External Users" page is hidden from navigation.
