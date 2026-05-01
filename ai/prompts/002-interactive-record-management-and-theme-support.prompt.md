# Prompt: Interactive Record Management and Theme Support

## Context

Implement the next major enhancement for the Personal Modular Tracker App based on:

- `/ai/issues/002-interactive-record-management-and-theme-support.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement extends feature `001-personal-modular-tracker-app` without introducing new tracker modules.

The focus is to complete the record lifecycle and improve usability for the existing MVP modules:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

The enhancement should replace placeholder history behavior with real backend-backed history, add record detail flows, add edit and delete support, and add application-wide dark theme support.

## Goal

Implement a maintainable enhancement that makes the existing MVP modules feel complete for day-to-day use.

The result should let the user:

- View real saved records in each module history
- Open a dedicated detail view for a selected record
- Edit existing records
- Delete records with a clear confirmation step
- Switch between light and dark themes with a persistent preference

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/`.
- Keep frontend code inside `frontend/`.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator for the backend.
- Use React Router v7 framework mode with Shadcn UI and Tailwind CSS for the frontend.
- Use React Router loaders and actions for record read/write flows where appropriate.
- Use React Hook Form and Zod only if the edit forms become complex enough to need them.
- Use Zustand only if theme or shared UI state cannot be handled cleanly with simpler frontend patterns.
- Reuse the module boundaries and existing architecture established in feature `001`.
- Keep the implementation incremental and easy to verify per task.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not add new tracker modules in this enhancement.
- Do not broaden the scope into authentication, exports, backup, or cloud sync.
- Do not redesign the dashboard beyond what is required to keep history and summaries consistent after record changes.
- Do not refactor unrelated files.
- Do not work on future tasks when running a single checklist task.

## Expected Output

The implementation should produce:

- Backend support for reading, updating, and deleting existing MVP records where needed.
- Frontend history views backed by real data for each supported module.
- Frontend detail routes or detail flows for supported module records.
- Edit flows for Sholat, Puasa, Keuangan, Olahraga, and Jurnal records.
- Delete flows with confirmation for Sholat, Puasa, Keuangan, Olahraga, and Jurnal records.
- Theme support for light and dark mode across the app with persisted preference.
- Updated `/ai/logs/002-interactive-record-management-and-theme-support.log.md` after each completed task.
- Updated `/ai/reviews/002-interactive-record-management-and-theme-support.review.md` when review notes are discovered or after the feature is completed.

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/002-interactive-record-management-and-theme-support.issue.md`
- `/ai/plans/002-interactive-record-management-and-theme-support.plan.md`
- `/ai/tasks/002-interactive-record-management-and-theme-support.tasks.md`
- `/ai/logs/002-interactive-record-management-and-theme-support.log.md`
- `/ai/reviews/002-interactive-record-management-and-theme-support.review.md`
