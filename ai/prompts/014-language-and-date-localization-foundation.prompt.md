# Prompt: Language and Date Localization Foundation

## Context

Implement the next application-level enhancement for the Personal Tracker App based on:

- `/ai/issues/014-language-and-date-localization-foundation.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `013-date-field-width-and-picker-sizing-polish`

It also preserves the date behavior and shared input foundation established in:

- feature `011-dashboard-local-date-input-and-documentation-polish`
- feature `012-dashboard-simplification-and-calendar-usability-refinement`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- shared frontend date helpers used for date display and date-only handling
- a UI that is currently written primarily in one language without a dedicated language-selection system
- date display surfaces across dashboard, tracker lists, and detail views that still need locale-aware presentation

The focus of this enhancement is not only translating a few labels. The focus is creating a maintainable language foundation so that text and date formatting can follow the active language cleanly across the application.

## Goal

Implement a maintainable localization enhancement that:

- supports `Bahasa Indonesia` and `English` as the initial application languages
- makes displayed dates follow the active language context
- introduces a clear language-selection setting or control
- creates a maintainable path for managing localized text without scattering language logic across routes

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required, though frontend work is expected to dominate this enhancement.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Review the current text and date-formatting paths before introducing a language system.
- Support at least `Bahasa Indonesia` and `English`.
- Ensure displayed dates are formatted according to the active language, especially on the dashboard and other date-heavy screens.
- Add a user-facing setting or control for choosing the active language.
- Use a maintainable approach for localization; an i18n library is allowed if it materially improves consistency and maintainability.
- Preserve the existing date-only correctness and shared date-field behavior from earlier features.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not broaden the scope into unrelated dashboard redesign, authentication, reminders, notifications, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not change working date-only correctness logic unless localization requires a display-layer adjustment.
- Do not attempt to support many languages at once; keep the first pass focused on `Bahasa Indonesia` and `English`.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- an application-level language foundation for `Bahasa Indonesia` and `English`
- locale-aware date formatting that follows the active language
- a clear language-selection control or setting
- more consistent user-facing text behavior across the application
- updated `/ai/logs/014-language-and-date-localization-foundation.log.md` after each completed task
- updated `/ai/reviews/014-language-and-date-localization-foundation.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/013-date-field-width-and-picker-sizing-polish.issue.md`
- `/ai/prompts/013-date-field-width-and-picker-sizing-polish.prompt.md`
- `/ai/plans/013-date-field-width-and-picker-sizing-polish.plan.md`
- `/ai/tasks/013-date-field-width-and-picker-sizing-polish.tasks.md`
- `/ai/logs/013-date-field-width-and-picker-sizing-polish.log.md`
- `/ai/reviews/013-date-field-width-and-picker-sizing-polish.review.md`
- `/ai/improvements/014-fix-sentence-date.md`
- `frontend/app/lib/form-defaults.ts`
- `frontend/app/routes/dashboard.tsx`
- tracker-module routes that display formatted dates
- layout or settings-related files that could host a language selector
