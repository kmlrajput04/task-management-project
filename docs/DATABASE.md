# Database Documentation

The application uses PostgreSQL as its relational database and Prisma as the ORM layer. The schema is defined in `backend/prisma/schema.prisma` and is the single source of truth for the database structure.

---

## 1. Core Schema Relationships

```mermaid
erDiagram
    users {
        String id PK
        String name
        String email UK
        String passwordHash
        UserRole role
        String avatar
        String phone
        DateTime createdAt
        DateTime updatedAt
    }

    tasks {
        String id PK
        String title
        String description
        TaskStatus status
        TaskPriority priority
        DateTime dueDate
        String externalClient
        String assignedToId FK
        String createdById FK
        DateTime createdAt
        DateTime updatedAt
    }

    comments {
        String id PK
        String comment
        String taskId FK
        String userId FK
        DateTime createdAt
    }

    activity_logs {
        String id PK
        String action
        String oldValue
        String newValue
        String taskId FK
        String userId FK
        DateTime createdAt
    }

    notifications {
        String id PK
        String title
        String message
        String type
        Boolean read
        String userId FK
        DateTime createdAt
    }

    settings {
        String key PK
        String value
    }

    users ||--o{ tasks : "assignedTasks"
    users ||--o{ tasks : "createdTasks"
    users ||--o{ comments : "author"
    users ||--o{ activity_logs : "actor"
    users ||--o{ notifications : "receives"
    tasks ||--o{ comments : "comments"
    tasks ||--o{ activity_logs : "activity"
```

---

## 2. Enum Definitions

### `UserRole`
- `ADMIN`
- `MANAGER`
- `MEMBER`

### `TaskStatus`
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `BLOCKED`

### `TaskPriority`
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

---

## 3. Model Definitions

### `User`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | UUID primary key |
| `name` | `String` | Required |
| `email` | `String` | Unique and required |
| `passwordHash` | `String` | Default seeded bcrypt hash |
| `role` | `UserRole` | Default: `MEMBER` |
| `avatar` | `String?` | Optional profile image URL |
| `phone` | `String?` | Optional contact number |
| `createdAt` | `DateTime` | Automatically set |
| `updatedAt` | `DateTime` | Automatically updated |

Relationships:
- `assignedTasks`: tasks assigned to the user
- `createdTasks`: tasks created by the user
- `comments`: comments authored by the user
- `activityLogs`: task activity records created by the user
- `notifications`: notifications received by the user

### `Task`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | UUID primary key |
| `title` | `String` | Required |
| `description` | `String?` | Optional task description |
| `status` | `TaskStatus` | Default: `PENDING` |
| `priority` | `TaskPriority` | Default: `MEDIUM` |
| `dueDate` | `DateTime?` | Optional due date |
| `externalClient` | `String?` | Optional external client / third-party reference |
| `assignedToId` | `String?` | Foreign key to `User.id` |
| `createdById` | `String` | Foreign key to `User.id` |
| `createdAt` | `DateTime` | Automatically set |
| `updatedAt` | `DateTime` | Automatically updated |

Relationships:
- `assignee`: user assigned to the task
- `creator`: user who created the task
- `comments`: task comments
- `activityLogs`: activity history for the task

### `Comment`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | UUID primary key |
| `comment` | `String` | Required message text |
| `createdAt` | `DateTime` | Automatically set |
| `taskId` | `String` | Foreign key to `Task.id` |
| `userId` | `String` | Foreign key to `User.id` |

### `ActivityLog`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | UUID primary key |
| `action` | `String` | Example: `TASK_CREATED`, `STATUS_CHANGED` |
| `oldValue` | `String?` | Previous value |
| `newValue` | `String?` | New value |
| `taskId` | `String` | Foreign key to `Task.id` |
| `userId` | `String` | Foreign key to `User.id` |
| `createdAt` | `DateTime` | Automatically set |

### `Notification`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | UUID primary key |
| `title` | `String` | Notification title |
| `message` | `String` | Notification body |
| `type` | `String` | Example: `TASK_ASSIGNED`, `TASK_COMPLETED`, `COMMENT_ADDED` |
| `read` | `Boolean` | Default: `false` |
| `createdAt` | `DateTime` | Automatically set |
| `userId` | `String` | Foreign key to `User.id` |

### `Setting`
| Field | Type | Notes |
| :--- | :--- | :--- |
| `key` | `String` | Primary key |
| `value` | `String` | Stored configuration value |

This table holds external integration settings such as:
- `EXTERNAL_API_URL`
- `EXTERNAL_API_HEADERS`

---

## 4. Indexes and Constraints

The schema currently defines these indexes for query performance:
- `tasks`: `status`, `priority`, `assignedToId`, `dueDate`, `createdAt`
- `comments`: `taskId`
- `activity_logs`: `taskId`
- `notifications`: `userId`
- `users`: unique `email`

The database also enforces:
- `User.email` uniqueness
- `Task.assignedToId` nullable relationship to `User`
- `Task.createdById` cascade relationship to `User`
- `Task` / `Comment` / `ActivityLog` cascade behavior for dependent records

---

## 5. Seeded Data

The seed script in `backend/prisma/seed.js` resets the database and creates:
- a default admin user: `kamalpreet@example.com`
- default external API settings with `JSONPlaceholder` as the default source

The default admin password is the hashed version of `password`.

---

## 6. Runtime Configuration

The app connects to PostgreSQL via the `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://postgres:8141@localhost:5432/task_dashboard?schema=public
```

The database service is defined in Docker Compose with the PostgreSQL container name `task_dashboard_postgres`.
