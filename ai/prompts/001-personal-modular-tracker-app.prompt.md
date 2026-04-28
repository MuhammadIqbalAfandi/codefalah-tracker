# Prompt: Personal Modular Tracker App

## Context

Build the first version of a personal modular tracker app based on the issue file for feature `001-personal-modular-tracker-app`.

The app should help the user record, monitor, and evaluate important personal activities across daily, weekly, monthly, and yearly periods. The core product concept is a modular tracker: each tracker is a separate module, while the dashboard provides a compact summary of progress across modules.

Follow the project rules and tech stack exactly:

- Backend: Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and go-playground/validator.
- Frontend: React Router v7 framework mode, Shadcn UI, Tailwind CSS, React Hook Form and Zod only when needed, Zustand only when needed.
- Keep backend and frontend clearly separated.
- Keep the first implementation focused on the MVP.

## Goal

Implement the MVP foundation for the Personal Modular Tracker App.

The MVP should provide:

- A dashboard that summarizes the user's tracker progress.
- A modular navigation structure.
- MVP tracker modules:
  - Sholat Tracker.
  - Puasa Tracker.
  - Keuangan Tracker.
  - Olahraga Tracker.
  - Jurnal Harian.
  - Simple contribution graph support.
- Basic create, read, update, and delete behavior where relevant for each tracker.
- Simple statistics and progress summaries where useful.

## Requirements

- Use the same feature ID and feature name across workflow files: `001-personal-modular-tracker-app`.
- Read existing project structure before changing files.
- Follow existing conventions if the repository already has backend or frontend structure.
- If the repository has no implementation structure yet, create a simple separated backend/frontend structure that matches `/ai/context/tech-stack.md`.
- Keep modules independent where possible.
- Do not implement non-MVP modules in the first pass.
- Use RESTful API design for backend endpoints.
- Keep business logic in backend services, not handlers.
- Keep route-level data loading or actions in React Router route modules where appropriate.
- Keep reusable UI components small and composable.
- Use forms only as complex as needed for the tracker input.
- Use validation for user input.
- Store dates consistently and make daily records easy to query.
- Provide simple summaries for dashboard cards and contribution graph data.
- Avoid introducing new dependencies without explicit approval.

## Constraints

- Do not work outside the selected task during implementation.
- Do not change unrelated files.
- Do not refactor unrelated code.
- Do not implement future modules before the MVP is stable.
- Do not add public social features such as follow, like, comments, or public posts.
- Do not integrate external services, wearable devices, banks, or third-party calendars.
- Do not add reminder or notification features in the first MVP unless they are later approved as a separate enhancement.
- Prefer simple data models over complex generalized abstractions.

## Expected Output

When implementing this feature later, produce:

- Backend API foundation for MVP tracker data.
- Database migrations and sqlc query definitions for MVP tracker records.
- Frontend routes and feature modules for dashboard and MVP trackers.
- Tracker input forms or checklists.
- Tracker history views.
- Basic dashboard summaries.
- Simple contribution graph display or data structure.
- Focused tests or manual verification notes based on project maturity.
- Updated task checkbox and log entry after each completed task.

## Files That Should Be Read Before Working

- `/ai/context/tech-stack.md`
- `/ai/context/project-rules.md`
- `/ai/issues/001-personal-modular-tracker-app.issue.md`
- `/ai/prompts/001-personal-modular-tracker-app.prompt.md`
- `/ai/plans/001-personal-modular-tracker-app.plan.md`
- `/ai/tasks/001-personal-modular-tracker-app.tasks.md`

## Notes

- This prompt is for implementation work after planning is accepted.
- Implementation must start from the next unchecked task in the task file unless the user specifies a task.
- The initial MVP should prioritize a useful tracker foundation over full feature breadth.
