# Plan: Personal Modular Tracker App

## Summary

Build the Personal Modular Tracker App MVP as a separated full stack application with a Go API backend and React Router frontend.

The MVP should establish the app foundation, module navigation, basic persistence, simple CRUD-style tracker flows, dashboard summaries, and contribution graph data for the selected initial modules.

## Scope

Included in the MVP:

- Backend app foundation in `backend/`
- Frontend app foundation in `frontend/`
- Dashboard summary API and UI
- Simple contribution graph API and UI
- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian
- Basic create, list, update, and delete behavior where appropriate
- Simple statistics and summaries for dashboard/module views

Not included in the MVP:

- Non-MVP tracker modules
- Public social diary features
- Likes, comments, follow behavior, or public feeds
- Advanced reminder/notification system
- External integrations
- Mobile packaging

## Architecture

Use separated root folders:

- `backend/` for the Go API service.
- `frontend/` for the React Router application.

Backend responsibilities:

- HTTP routing with chi.
- Request validation with validator.
- Structured logging with slog.
- PostgreSQL persistence through `database/sql` and sqlc-generated queries.
- Database migrations through golang-migrate.
- RESTful JSON API endpoints for dashboard and MVP modules.

Frontend responsibilities:

- React Router v7 framework-mode routes.
- Route loaders/actions for server interaction where suitable.
- API client helpers in `frontend/src/services/`.
- Domain UI under `frontend/src/features/`.
- Reusable components under `frontend/src/components/`.
- Styling through Tailwind CSS and Shadcn UI.

## Data Flow

Typical record creation flow:

1. User opens a module route in the frontend.
2. User submits a small form or checklist action.
3. React Router action or route handler calls the frontend API client.
4. API client sends a request to the Go backend.
5. Backend validates the request.
6. Backend stores the record using sqlc queries and PostgreSQL.
7. Backend returns the created or updated record.
8. Frontend refreshes the module history and summary.
9. Dashboard and contribution graph data reflect the updated records.

Typical dashboard flow:

1. User opens the dashboard route.
2. Frontend loads dashboard summary data from the backend.
3. Backend aggregates MVP module records for the current day/month.
4. Frontend renders summary cards, quick module links, and contribution graph data.

## Implementation Steps

1. Initialize the separated project folders and baseline backend/frontend app structure.
2. Create backend app entry point, configuration, logger, router, and health endpoint.
3. Create database migration structure and MVP tables for tracker records.
4. Add sqlc configuration and queries for each MVP tracker.
5. Create backend handlers and services for dashboard, contribution graph, and MVP modules.
6. Add backend validation and consistent JSON response/error handling.
7. Initialize the frontend React Router app structure.
8. Add global layout, navigation, and shared UI primitives.
9. Create dashboard route with summary cards and contribution graph placeholder/first version.
10. Create routes and simple UIs for Sholat, Puasa, Keuangan, Olahraga, and Jurnal.
11. Wire frontend route loaders/actions or API calls to backend endpoints.
12. Add focused tests or verification notes for backend endpoints and key frontend flows.
13. Update logs after each completed task and review notes after implementation.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/prompts/001-personal-modular-tracker-app.prompt.md`
- `ai/plans/001-personal-modular-tracker-app.plan.md`
- `ai/tasks/001-personal-modular-tracker-app.tasks.md`
- `ai/logs/001-personal-modular-tracker-app.log.md`
- `ai/reviews/001-personal-modular-tracker-app.review.md`

Backend files:

- `backend/go.mod`
- `backend/cmd/app/main.go`
- `backend/internal/handlers/`
- `backend/internal/services/`
- `backend/internal/models/`
- `backend/internal/middleware/`
- `backend/internal/db/`
- `backend/pkg/config/`
- `backend/pkg/logger/`
- `backend/migrations/`
- `backend/sql/`
- `backend/sqlc.yaml`

Frontend files:

- `frontend/package.json`
- `frontend/app/` or `frontend/src/`, depending on React Router scaffold conventions
- `frontend/src/routes/`
- `frontend/src/components/`
- `frontend/src/features/`
- `frontend/src/hooks/`
- `frontend/src/lib/`
- `frontend/src/services/`
- `frontend/src/styles/`

## Risks And Edge Cases

- The MVP can grow too large if all modules are implemented at full depth immediately.
- Dashboard aggregation can become inconsistent if modules store dates or statuses differently.
- Date handling needs clear rules for daily, weekly, monthly, and yearly summaries.
- Finance records need validation for positive amounts, categories, and transaction type.
- Journal entries may need length limits and safe rendering.
- Contribution graph rules should stay simple at first so they can support multiple modules.
- Frontend and backend folder conventions must remain separated according to the tech stack file.
- Existing project files should be checked before implementation to avoid overwriting unrelated work.

## Dependency Proposal

The MVP needs one PostgreSQL driver package so Go's `database/sql` can connect to PostgreSQL.

Proposed dependency:

- `github.com/jackc/pgx/v5/stdlib`
- `github.com/fergusstrange/embedded-postgres` for test-only database-backed verification when local PostgreSQL is unavailable

Reason:

- `/ai/context/tech-stack.md` requires `database/sql + PostgreSQL`, but `database/sql` needs a driver implementation at runtime.
- The pgx stdlib package keeps application code on `database/sql` while providing the PostgreSQL driver.
- The embedded Postgres package keeps verification close to the approved PostgreSQL stack without requiring Docker or a preinstalled local PostgreSQL service.

Use the stack already listed:

- Go standard library, chi, validator, slog, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Shadcn UI, Tailwind CSS
- React Hook Form and Zod only if needed for complex forms
- Zustand only if shared global state is needed

## Testing Plan

Backend:

- Verify the health endpoint.
- Verify CRUD endpoints for each MVP tracker.
- Verify request validation failures.
- Verify dashboard summary aggregation.
- Verify contribution graph aggregation.
- Run Go tests where test files exist.

Frontend:

- Verify dashboard renders summary sections.
- Verify navigation between MVP modules.
- Verify forms/checklists can submit data.
- Verify histories update after create/update/delete actions.
- Verify empty states render clearly.
- Run frontend tests or build checks when available.

Manual verification:

- Create sample records for each MVP module.
- Confirm dashboard values update.
- Confirm contribution graph values update.
- Confirm invalid input shows a clear error.

## Assumptions

- The MVP is private and single-user unless a later issue introduces authentication or multi-user support.
- Local development can use PostgreSQL according to `/ai/context/tech-stack.md`.
- Reminder and social diary features will be handled in future issues after the MVP tracker foundation is stable.
