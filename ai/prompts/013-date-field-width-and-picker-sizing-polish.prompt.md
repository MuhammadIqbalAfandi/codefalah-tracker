# Prompt: Date Field Width and Picker Sizing Polish

## Context

Implement the next shared form-polish enhancement for the Personal Tracker App based on:

- `/ai/issues/013-date-field-width-and-picker-sizing-polish.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `012-dashboard-simplification-and-calendar-usability-refinement`

It also preserves the date behavior baseline established in:

- feature `011-dashboard-local-date-input-and-documentation-polish`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a shared `DateField` component with an integrated calendar surface from feature `012`
- tracker-module forms that reuse the shared date field across multiple routes
- local date-only helpers that already standardize Jakarta-aligned date formatting and display

The focus of this enhancement is not a new date system. The focus is polishing the shared date field so its size feels more aligned with standard inputs and so the opened date picker feels visually proportional within the tracker forms.

## Goal

Implement a maintainable date-field polish that:

- aligns shared date field sizing more closely with neighboring form inputs
- reduces date picker oversizing where it feels visually excessive
- preserves the calendar-based interaction and date-only behavior already introduced in features `011` and `012`
- keeps the result practical on both desktop and mobile

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required, though backend changes are not expected by default.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become unexpectedly necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Reuse and refine the shared `DateField` introduced in feature `012` rather than creating a parallel component.
- Review the current form-field sizing relationship between `DateField` and standard text, number, or select inputs in the in-scope modules.
- Refine the date picker surface so its width and visual weight feel proportionate to the form container.
- Include the reported `Sholat` case in the validation scope, while also checking the other module forms that reuse the shared date field.
- Preserve the existing date-only value contract and Jakarta-aligned display behavior from feature `011`.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not replace the calendar interaction introduced in feature `012`.
- Do not broaden the scope into unrelated dashboard work, CRUD redesign, authentication, reminders, notifications, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not alter local-date logic unless a direct sizing fix unexpectedly depends on it, which is not expected.
- Do not turn this polish pass into a broad form-system redesign across the whole app.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a shared date field that feels more aligned in size with other form inputs
- a date picker surface that opens with more proportional sizing
- preserved calendar interaction and preserved local-date correctness behavior
- improved visual consistency across the in-scope tracker forms
- updated `/ai/logs/013-date-field-width-and-picker-sizing-polish.log.md` after each completed task
- updated `/ai/reviews/013-date-field-width-and-picker-sizing-polish.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/012-dashboard-simplification-and-calendar-usability-refinement.issue.md`
- `/ai/prompts/012-dashboard-simplification-and-calendar-usability-refinement.prompt.md`
- `/ai/plans/012-dashboard-simplification-and-calendar-usability-refinement.plan.md`
- `/ai/tasks/012-dashboard-simplification-and-calendar-usability-refinement.tasks.md`
- `/ai/logs/012-dashboard-simplification-and-calendar-usability-refinement.log.md`
- `/ai/reviews/012-dashboard-simplification-and-calendar-usability-refinement.review.md`
- `/ai/improvements/013-fix-date-width.md`
- `frontend/app/components/ui/date-field.tsx`
- `frontend/app/components/ui/select-field.tsx`
- the tracker-module routes that currently consume the shared date field under `frontend/app/routes/`
