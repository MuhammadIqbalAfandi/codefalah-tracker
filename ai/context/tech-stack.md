# 🧭 Full Stack Reference (Separated) - Go Backend

This document defines the standard full stack architecture for projects with separated backend and frontend, using Go for the backend.
Use this as the default unless there is a strong reason to deviate.

---

## 🎯 Objective

Provide a consistent, scalable, and maintainable full stack architecture with clear separation between backend and frontend.

---

## 🧱 Tech Stack

### Backend

- HTTP Framework: net/http + chi
- Database: database/sql + sqlc + PostgreSQL
- Migration: golang-migrate
- Logging: slog
- Validation: go-playground/validator

### Frontend

- Framework: React Router v7 (framework mode)
- UI: Shadcn UI + Tailwind CSS
- Form Handling: React Hook Form + Zod (use only when needed)
- State Management: Zustand (use only when needed)

---

## 📌 Principles

- Prefer simplicity over complexity
- Avoid over-engineering
- Use only necessary libraries
- Follow convention over configuration
- Keep code readable and maintainable
- Maintain clear separation between backend and frontend

---

## 🗂 Folder Structure (Recommended)

Generated projects must use separated root folders:

```md
backend/ # Go API service and backend-only files
frontend/ # React Router app and frontend-only files
```

Backend files must be placed inside `backend/`.
Frontend files must be placed inside `frontend/`.
Do not generate backend files at the project root unless explicitly requested.
Do not generate frontend files at the project root unless explicitly requested.

### Backend

```md
backend/
├── cmd/ # main applications
│ └── app/ # application entry point
├── internal/ # private application code
│ ├── handlers/ # HTTP handlers
│ ├── models/ # data models
│ ├── services/ # business logic
│ ├── middleware/ # custom middleware
│ └── db/ # database connection and queries
├── pkg/ # public libraries
│ ├── config/ # configuration
│ └── logger/ # logging utilities
├── migrations/ # database migrations (golang-migrate)
└── sql/ # sqlc generated code
```

### Frontend

```md
frontend/
└── src/
├── routes/ # route modules (React Router framework mode)
├── components/ # reusable UI components
├── features/ # domain-based modules
├── hooks/ # custom hooks
├── lib/ # utilities, helpers
├── store/ # zustand state (if needed)
├── schemas/ # zod schemas (if needed)
├── services/ # API client layer
└── styles/ # global styles
```

---

## 🛠 Generation & Setup Rules

When generating a new project, create and initialize both apps in their own folders:

- Create the backend inside `backend/`
- Create the frontend inside `frontend/`
- Run backend dependency installation commands inside `backend/`
- Run frontend dependency installation commands inside `frontend/`
- Do not only print installation commands unless the user explicitly asks for manual setup
- If a command cannot be executed, explain the reason clearly and list the exact command the user must run manually

Expected setup flow:

```sh
mkdir -p backend frontend

cd backend
go mod init <module-name>
go get github.com/go-chi/chi/v5
go get github.com/go-playground/validator/v10
go mod tidy

cd ../frontend
npm install
```

If the frontend is scaffolded with a tool such as React Router, Vite, or another generator, run the scaffold command first, then run package installation in `frontend/`.

---

## 📛 Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Files: `kebab-case.ts` (frontend), `snake_case.go` (backend)
- Variables/functions: `camelCase` (frontend), `camelCase` for private, `PascalCase` for public (Go)
- Route files: follow respective framework conventions
- API endpoints: RESTful conventions
- Go packages: lowercase, single word if possible

---

## ⚙️ Usage Rules

### Backend

- Use chi for routing and middleware
- Place sqlc queries in `sql/` directory
- Keep business logic in `internal/services/`
- Use middleware for authentication and validation
- Follow RESTful API design
- Use slog for structured logging
- Use go-playground/validator for input validation
- Run migrations with golang-migrate

### Frontend

- Use Zustand only for global/shared state
- Use React Hook Form + Zod only for complex forms
- Keep components small and composable
- Separate business logic into `features/`
- Keep route logic inside `routes/`, not in components
- Use API client in `services/` for backend communication

---

## 🗄 Database Guidelines

- Use PostgreSQL as primary database
- Use sqlc for type-safe SQL queries
- Keep schema in SQL files under `migrations/`
- Use golang-migrate for schema migrations
- Prefer simple relations over complex joins
- Generate types from SQL with sqlc

---

## 🔌 Data Fetching Strategy

### Backend

- Use chi routes for API endpoints
- Handle data fetching and mutations in handlers
- Use sqlc-generated functions for database operations
- Validate inputs with go-playground/validator

### Frontend

- Use loaders/actions (React Router) for server interaction
- Keep data fetching close to routes
- Avoid fetching directly inside UI components when possible
- Use API client for backend communication

---

## 🚫 Anti-Patterns

- Do not introduce unnecessary abstraction
- Do not use global state for local UI state
- Do not mix unrelated logic in one component
- Do not bypass ORM/query builder without clear reason
- Do not place business logic in UI components
- Do not tightly couple backend and frontend logic
- Do not expose database details in API responses
- Do not use panic for error handling in production

---

## 🧪 Output Guidelines (for AI usage)

- Use clear and structured Markdown
- Provide file structure when relevant
- Include code examples when necessary
- Keep explanations concise and actionable
- Specify backend/frontend context when relevant
