# Prompt: Dashboard and Sidebar Clarity Improvements

## Context

Implement the next major enhancement for the Personal Tracker App based on:

- `/ai/issues/003-dashboard-and-sidebar-clarity-improvements.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement builds on:

- feature `001-personal-modular-tracker-app`
- feature `002-interactive-record-management-and-theme-support`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- chi-based backend handlers for the MVP tracker modules
- a React Router v7 frontend under `frontend/app/`
- dashboard, module routes, record detail flows, delete confirmation, and theme support

The focus of this enhancement is not new CRUD support. The focus is to improve the clarity of the shared sidebar and the readability of the dashboard so users can understand their activity data more easily.

## Goal

Implement a maintainable dashboard and navigation enhancement that makes the app easier to understand at a glance.

The result should help the user:

- open and close the sidebar clearly
- navigate comfortably across modules on different screen sizes
- understand what dashboard cards and progress indicators mean
- read activity summaries across useful time ranges
- see dashboard sections that better reflect real stored records

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/`.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator for backend changes if backend work is required.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer improving existing dashboard routes, loaders, components, and shared layout pieces instead of introducing parallel structures.
- Reuse existing summary, contribution, navigation, and layout patterns where possible.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not add brand-new tracker modules in this enhancement.
- Do not broaden the scope into authentication, reminders, notifications, exports, backup, or external integrations.
- Do not rewrite unrelated record creation, edit, detail, or delete flows unless needed to support dashboard clarity or sidebar behavior.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- clearer shared sidebar behavior with explicit open and close interaction
- dashboard summaries that are easier to understand
- progress indicators with clearer meaning or labels
- more readable contribution or activity-pattern visualization
- improved time-range-based summaries for relevant MVP modules
- dashboard sections that better reflect real stored records for Sholat, Puasa, Keuangan, Olahraga, and Jurnal
- updated `/ai/logs/003-dashboard-and-sidebar-clarity-improvements.log.md` after each completed task
- updated `/ai/reviews/003-dashboard-and-sidebar-clarity-improvements.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/003-dashboard-and-sidebar-clarity-improvements.issue.md`
- `/ai/plans/003-dashboard-and-sidebar-clarity-improvements.plan.md`
- `/ai/tasks/003-dashboard-and-sidebar-clarity-improvements.tasks.md`
- `/ai/logs/003-dashboard-and-sidebar-clarity-improvements.log.md`
- `/ai/reviews/003-dashboard-and-sidebar-clarity-improvements.review.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/lib/navigation.ts`
- `frontend/app/components/summary-card.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/router.go`
