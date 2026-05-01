# Prompt: Personal Modular Tracker App

## Context

Build the MVP for a Personal Modular Tracker App based on:

- `/ai/issues/001-personal-modular-tracker-app.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

The app is a private personal tracker for recording important daily, weekly, monthly, and yearly activities. It uses a modular tracker concept where each tracker has its own module, page, input flow, history, and progress summary.

The MVP should focus on:

- Main dashboard
- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian
- Simple contribution graph support

## Goal

Implement a maintainable MVP foundation for the Personal Modular Tracker App using the approved separated full stack architecture.

The result should let the user open the app, navigate between MVP modules, record basic tracker data, view recent history, and see simple dashboard/contribution summaries.

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/`.
- Keep frontend code inside `frontend/`.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator for the backend.
- Use React Router v7 framework mode with Shadcn UI and Tailwind CSS for the frontend.
- Use React Hook Form and Zod only when forms become complex enough to need them.
- Use Zustand only if global/shared frontend state becomes necessary.
- Keep each tracker module separated by responsibility.
- Build the MVP incrementally in small tasks.
- Preserve simple, readable, maintainable code.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not implement non-MVP modules during the first MVP scope.
- Do not implement public social features for the journal in the MVP.
- Do not build advanced reminders or notifications in the MVP.
- Do not refactor unrelated files.
- Do not work on future tasks when running a single checklist task.

## Expected Output

The implementation should produce:

- A separated backend app under `backend/`.
- A separated frontend app under `frontend/`.
- API routes for dashboard summaries, contribution graph data, and MVP module records.
- Database schema and sqlc queries for MVP tracker records.
- Frontend routes for dashboard and MVP modules.
- Simple input, history, and summary UI for the MVP modules.
- Updated `/ai/logs/001-personal-modular-tracker-app.log.md` after each completed task.
- Updated `/ai/reviews/001-personal-modular-tracker-app.review.md` when review notes are discovered or after the feature is completed.

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/001-personal-modular-tracker-app.issue.md`
- `/ai/plans/001-personal-modular-tracker-app.plan.md`
- `/ai/tasks/001-personal-modular-tracker-app.tasks.md`
- `/ai/logs/001-personal-modular-tracker-app.log.md`
- `/ai/reviews/001-personal-modular-tracker-app.review.md`
