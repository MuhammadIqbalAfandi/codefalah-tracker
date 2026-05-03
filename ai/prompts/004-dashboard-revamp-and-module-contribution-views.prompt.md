# Prompt: Dashboard Revamp and Module Contribution Views

## Context

Implement the next dashboard-focused enhancement for the Personal Tracker App based on:

- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement builds on:

- feature `001-personal-modular-tracker-app`
- feature `002-interactive-record-management-and-theme-support`
- feature `003-dashboard-and-sidebar-clarity-improvements`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- chi-based backend handlers and dashboard endpoints
- a React Router v7 frontend under `frontend/app/`
- an existing dashboard route and contribution graph component
- improved shared layout and sidebar behavior from feature `003`

The focus of this enhancement is not general dashboard wording anymore. The focus is to reshape the dashboard so module-based contribution views become the main way users read activity progress and move into a deeper module-specific contribution detail page.

## Goal

Implement a maintainable dashboard revamp that:

- makes contribution views a primary dashboard experience
- shows contribution activity for each relevant module
- keeps the dashboard visually focused on daily consistency
- lets users move from the dashboard into a module-specific contribution detail page without losing context

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/`.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator for backend changes if backend work is required.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing dashboard route, contribution graph component, dashboard handlers, and route registration rather than creating parallel dashboard systems.
- Support contribution views for the existing MVP modules where relevant:
  - Sholat
  - Puasa
  - Keuangan
  - Olahraga
  - Jurnal
- Present contribution activity in a 12-month visual range for each relevant module.
- Treat one contribution cell as one day and keep the visual aligned with the real number of days in each month.
- Let users open a dedicated contribution detail page for a selected module.
- Keep the contribution graph visible at the top of the detail page and show related activity or record data below it.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not add brand-new tracker modules in this enhancement.
- Do not broaden the scope into authentication, reminders, notifications, exports, backup, or external integrations.
- Do not redesign unrelated CRUD flows unless a small supporting change is needed for contribution detail behavior.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.
- Do not assume a GitHub-like contribution style must be copied exactly; the important requirement is clarity, consistency, and usability within the current app.

## Expected Output

The implementation should produce:

- a more focused dashboard centered on module contribution views
- a contribution card or section for each relevant module
- a 12-month day-based contribution visualization per supported module
- clear navigation from a dashboard contribution view into a module contribution detail page
- a contribution detail page that keeps the graph at the top and shows related activity data below
- backend data support for contribution summaries or detail activity lists if the current API shape is insufficient
- updated `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md` after each completed task
- updated `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `/ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/components/summary-card.tsx`
- `frontend/app/lib/navigation.ts`
- `frontend/app/root.tsx`
- `frontend/app/app.css`
- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/router.go`
- `backend/internal/handlers/dashboard_integration_test.go`
