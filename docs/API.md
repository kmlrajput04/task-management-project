# API Documentation

This project exposes all application endpoints under the `/api` prefix. The backend is served by Express and is documented in Swagger at `/api-docs`.

---

## 1. Health

### GET `/api/health`
- Description: Check whether the API server is running.
- Auth: Public
- Response example:
  ```json
  {
    "success": true,
    "message": "API is running",
    "data": {
      "status": "healthy",
      "uptime": 124.5
    }
  }
  ```

---

## 2. Authentication

### POST `/api/auth/login`
- Description: Authenticate a user with email/password and return a JWT.
- Auth: Public
- Request body:
  ```json
  {
    "email": "kamalpreet@example.com",
    "password": "password"
  }
  ```
- Response example:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid",
        "name": "Kamalpreet Singh",
        "email": "kamalpreet@example.com",
        "role": "ADMIN",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamalpreet"
      }
    }
  }
  ```

### POST `/api/auth/logout`
- Description: Returns a success response for client-side logout.
- Auth: Public
- Response example:
  ```json
  {
    "success": true,
    "message": "Logout successful",
    "data": null
  }
  ```

### GET `/api/auth/me`
- Description: Get the current logged-in user's profile from the JWT.
- Auth: Bearer token required
- Response example:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "id": "uuid",
      "name": "Kamalpreet Singh",
      "email": "kamalpreet@example.com",
      "role": "ADMIN",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamalpreet"
    }
  }
  ```

---

## 3. Dashboard

### GET `/api/dashboard`
- Description: Return task summary metrics and dashboard aggregates.
- Auth: Bearer token required
- Query parameters:
  - `userId` (optional): Filter metrics for a specific user
- Response example:
  ```json
  {
    "success": true,
    "message": "Dashboard data retrieved successfully",
    "data": {
      "summary": {
        "totalTasks": 12,
        "pendingTasks": 4,
        "inProgressTasks": 3,
        "completedTasks": 4,
        "blockedTasks": 1,
        "myTasks": 5,
        "overdueTasks": 2
      },
      "statusDistribution": [
        { "status": "PENDING", "count": 4 },
        { "status": "IN_PROGRESS", "count": 3 }
      ],
      "priorityDistribution": [
        { "priority": "HIGH", "count": 5 }
      ],
      "recentTasks": [
        {
          "id": "task-id",
          "title": "Build API",
          "status": "IN_PROGRESS",
          "priority": "HIGH",
          "updatedAt": "2026-08-14T12:00:00.000Z"
        }
      ],
      "upcomingTasks": [],
      "myTasks": []
    }
  }
  ```

---

## 4. Tasks

### GET `/api/tasks`
- Description: List tasks with filtering, search, sorting, and pagination.
- Auth: Bearer token required
- Query parameters:
  - `page` (default: `1`)
  - `limit` (default: `10`)
  - `search`
  - `status`
  - `priority`
  - `assignee`
  - `sortBy` (allowed: `title`, `priority`, `status`, `dueDate`, `createdAt`, `updatedAt`)
  - `sortOrder` (`asc` / `desc`)
- Response example:
  ```json
  {
    "success": true,
    "message": "Tasks retrieved successfully",
    "data": [
      {
        "id": "uuid",
        "title": "Build Authentication",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "dueDate": "2026-08-25T00:00:00.000Z",
        "assignee": {
          "id": "user-uuid",
          "name": "Team Member"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "timestamp": "2026-08-15T00:00:00.000Z"
  }
  ```

### GET `/api/tasks/:id`
- Description: Fetch a single task by ID.
- Auth: Bearer token required

### POST `/api/tasks`
- Description: Create a new task.
- Auth: Bearer token required
- Request body:
  ```json
  {
    "title": "New Task",
    "description": "Task specification details",
    "status": "PENDING",
    "priority": "MEDIUM",
    "assignedToId": "user-uuid",
    "createdById": "creator-uuid",
    "dueDate": "2026-08-25T00:00:00.000Z",
    "externalClient": "Acme Corp"
  }
  ```

### PUT `/api/tasks/:id`
- Description: Update a task.
- Auth: Bearer token required
- The API also accepts current user context in middleware and tracks task activity automatically.

### DELETE `/api/tasks/:id`
- Description: Delete a task.
- Auth: Required roles `ADMIN` or `MANAGER`

### GET `/api/tasks/:id/comments`
- Description: Retrieve all comments attached to a task.
- Auth: Bearer token required

### POST `/api/tasks/:id/comments`
- Description: Add a comment to a task.
- Auth: Bearer token required
- Request body:
  ```json
  {
    "comment": "Updated the deployment status."
  }
  ```

### GET `/api/tasks/:id/activity`
- Description: Retrieve activity/audit entries for a task.
- Auth: Bearer token required

---

## 5. Users

### GET `/api/users`
- Description: Get the list of users for assignee dropdowns and user management.
- Auth: Bearer token required

### GET `/api/users/:id`
- Description: Get a single user profile by ID.
- Auth: Bearer token required

### POST `/api/users`
- Description: Create a user record.
- Auth: `ADMIN` or `MANAGER`
- Request body:
  ```json
  {
    "name": "New Member",
    "email": "newmember@example.com",
    "password": "securepassword123",
    "role": "MEMBER",
    "avatar": "https://example.com/avatar.png",
    "phone": "+1-555-0100"
  }
  ```

### PUT `/api/users/:id`
- Description: Update a user record.
- Auth: `ADMIN` or `MANAGER`

### DELETE `/api/users/:id`
- Description: Delete a user record.
- Auth: `ADMIN` only

---

## 6. Notifications

### GET `/api/notifications`
- Description: Get notifications for the current user.
- Auth: Bearer token required

### PATCH `/api/notifications/read`
- Description: Mark all notifications as read for the current user.
- Auth: Bearer token required

### PATCH `/api/notifications/:id/read`
- Description: Mark one notification as read.
- Auth: Bearer token required

---

## 7. External Integrations

### GET `/api/external/users`
- Description: Fetch external users from the configured API source and cache the result.
- Auth: Bearer token required
- Response includes metadata:
  ```json
  {
    "success": true,
    "message": "External users retrieved successfully",
    "data": [
      {
        "id": "1",
        "name": "Leanne Graham",
        "email": "Sincere@april.biz",
        "company": "Romaguera-Crona",
        "city": "Gwenborough",
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org"
      }
    ],
    "meta": {
      "source": "https://jsonplaceholder.typicode.com/users",
      "cached": false
    }
  }
  ```

### GET `/api/external/settings`
- Description: Retrieve the configured external source URL and headers.
- Auth: `ADMIN` or `MANAGER`

### POST `/api/external/settings`
- Description: Save external API settings and clear the cache.
- Auth: `ADMIN` or `MANAGER`
- Request body:
  ```json
  {
    "apiUrl": "https://jsonplaceholder.typicode.com/users",
    "apiHeaders": "{\"Authorization\":\"Bearer token\"}"
  }
  ```

---

## 8. Response Format

The API uses a consistent JSON wrapper shape:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {},
  "timestamp": "2026-08-15T00:00:00.000Z"
}
```

- `success`: Boolean success indicator
- `message`: Description of the result
- `data`: Response payload or null
- `meta`: Additional metadata, such as pagination or external-source context
- `timestamp`: ISO timestamp of the response

---

## 9. Authorization Model

Role-based access control is enforced in middleware:
- `ADMIN`: full access
- `MANAGER`: can manage users, tasks, and external settings
- `MEMBER`: basic task and comment access only

Protected routes check `req.user.role` using the JWT payload from `authMiddleware`.
