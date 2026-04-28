# Plan: Personal Modular Tracker App

## Summary

Build the MVP foundation for a personal modular tracker app with a separated Go backend and React Router frontend.

The MVP should focus on a practical first version: dashboard, modular navigation, Sholat Tracker, Puasa Tracker, Keuangan Tracker, Olahraga Tracker, Jurnal Harian, and simple contribution graph support.

The implementation should be incremental. Each task should be completed, logged, and reviewed before moving to the next task.

## Scope

In scope for the MVP:

- Backend project foundation using Go, `net/http`, chi, slog, validator, PostgreSQL, golang-migrate, sqlc, and `database/sql`.
- Frontend project foundation using React Router v7 framework mode, Shadcn UI, and Tailwind CSS.
- Database schema for MVP tracker modules.
- RESTful API endpoints for MVP tracker records.
- Dashboard summary API.
- Frontend routes for dashboard and MVP modules.
- Basic input, checklist, history, and summary views.
- Simple contribution graph data and UI.
- Focused validation, error handling, and empty states.
- Manual verification notes or tests appropriate to the existing project setup.

Out of scope for the MVP:

- Non-MVP modules such as Makan, Minum, Jadwal, Habit, Tidur, Belajar, Ibadah Tambahan, and Target Hidup.
- Reminder and notification system.
- Public social diary features.
- External integrations.
- Advanced analytics or complex reporting.
- Mobile app packaging.

## Assumptions

- The repository may not yet contain application code; if missing, create the minimum separated backend/frontend structure from `/ai/context/tech-stack.md`.
- The app is for a single user unless authentication is introduced later as a separate feature.
- Jurnal Harian starts as a private diary timeline, not a public social feature.
- Contribution graph can start with simple daily completion counts or completion status per module.
- MVP tracker data can use clear per-module tables instead of one overly generic tracker table.

## Process Flow

1. User opens the frontend app.
2. Frontend loads the dashboard route.
3. Dashboard requests summary data from the backend.
4. User opens one tracker module from navigation.
5. Frontend loads tracker records and current-day status.
6. User creates or updates a tracker record through a form or checklist.
7. Backend validates input, persists the record, and returns the updated data.
8. Frontend refreshes the tracker view, dashboard summary, and contribution data as needed.

## Data Model Direction

Use simple MVP-oriented tables for:

- Sholat daily records.
- Puasa records.
- Finance transactions or monthly budget data.
- Sport activity records.
- Journal entries.

Each table should include timestamps and fields needed for the module's expected behavior. Use migrations for schema changes and sqlc query files for typed database access.

Avoid premature generalization. A shared summary or contribution endpoint can aggregate data from module-specific tables.

## Backend Implementation Strategy

- Create or follow the Go backend structure from the tech stack.
- Add configuration and database connection setup.
- Add migration files for MVP tables.
- Add sqlc query files for CRUD and summary needs.
- Add services for module business logic and dashboard aggregation.
- Add handlers for RESTful endpoints.
- Add validation structs and request handling.
- Add clear error responses.
- Add basic tests where practical, or document manual verification steps if the project has no test setup yet.

## Frontend Implementation Strategy

- Create or follow the React Router v7 framework mode structure from the tech stack.
- Add layout and navigation for dashboard and MVP modules.
- Add route modules for each MVP tracker.
- Add API client functions in the frontend service layer.
- Add small reusable UI components for summary cards, tracker forms, checklists, history lists, and contribution graph.
- Use React Hook Form and Zod only where form complexity justifies them.
- Keep local UI state local. Use Zustand only if shared state becomes necessary.
- Add loading, empty, success, and error states.

## Implementation Steps

1. Inspect repository structure and confirm whether backend/frontend scaffolding already exists.
2. Create any missing workflow-compatible project folders required for the app foundation.
3. Set up backend application entry point, router, config, logger, database connection, and health endpoint.
4. Set up frontend app foundation, layout, navigation, and dashboard route.
5. Create database migrations for MVP tracker tables.
6. Create sqlc query definitions for MVP tracker CRUD and summary data.
7. Implement backend services and handlers for Sholat Tracker.
8. Implement backend services and handlers for Puasa Tracker.
9. Implement backend services and handlers for Keuangan Tracker.
10. Implement backend services and handlers for Olahraga Tracker.
11. Implement backend services and handlers for Jurnal Harian.
12. Implement dashboard summary and contribution graph endpoints.
13. Implement frontend Sholat Tracker route and UI.
14. Implement frontend Puasa Tracker route and UI.
15. Implement frontend Keuangan Tracker route and UI.
16. Implement frontend Olahraga Tracker route and UI.
17. Implement frontend Jurnal Harian route and UI.
18. Implement dashboard summary cards and contribution graph UI.
19. Add validation, empty states, error states, and basic user feedback.
20. Run available checks and document manual verification.
21. Update log and review files.

## Files Likely to Be Created or Changed

Backend areas likely to be created or changed:

- `cmd/app/`
- `internal/handlers/`
- `internal/services/`
- `internal/middleware/`
- `internal/db/`
- `pkg/config/`
- `pkg/logger/`
- `migrations/`
- `sql/`

Frontend areas likely to be created or changed:

- `src/routes/`
- `src/components/`
- `src/features/`
- `src/hooks/`
- `src/lib/`
- `src/services/`
- `src/styles/`
- `src/schemas/` if complex form validation is needed.
- `src/store/` only if global/shared state is needed.

Workflow files to update during implementation:

- `/ai/tasks/001-personal-modular-tracker-app.tasks.md`
- `/ai/logs/001-personal-modular-tracker-app.log.md`
- `/ai/reviews/001-personal-modular-tracker-app.review.md`

## Risks and Edge Cases

- The MVP scope can become too large if all modules are implemented with full analytics immediately.
- Dashboard aggregation can become complex if module data models are over-generalized too early.
- Date handling can cause inconsistent daily summaries if timezone assumptions are unclear.
- Finance records need careful validation for amounts and transaction type.
- Journal entries may include long text and optional media later; MVP should avoid overbuilding media support.
- Contribution graph should work with sparse data and empty history.
- The repository may not yet contain dependency setup, so setup tasks may need extra care before feature work begins.

## Dependency Proposal

No new dependency is proposed at this stage.

Use only the dependencies listed in `/ai/context/tech-stack.md`. If implementation reveals a missing required dependency, propose it in the plan or log before using it.

## Testing Plan

- Backend:
  - Verify health endpoint.
  - Verify CRUD behavior for each MVP tracker module.
  - Verify validation errors for invalid payloads.
  - Verify dashboard summary output with empty and populated data.
  - Verify contribution graph data with empty and populated records.
- Frontend:
  - Verify navigation between dashboard and MVP modules.
  - Verify forms or checklists can submit valid data.
  - Verify empty states, loading states, and error states.
  - Verify dashboard cards update after tracker data changes.
  - Verify contribution graph renders empty and populated states.
- Database:
  - Verify migrations apply cleanly.
  - Verify sqlc generation succeeds.
  - Verify basic queries return expected records.
- Workflow:
  - After each task, update the task checkbox and log file.
  - After the feature is implemented, update the review file with findings and follow-up ideas.
