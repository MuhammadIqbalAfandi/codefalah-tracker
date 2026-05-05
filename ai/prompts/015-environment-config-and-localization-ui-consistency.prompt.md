# Prompt: Environment Config And Localization UI Consistency

## Context

Implement the next application-level enhancement for the Personal Tracker App based on:

- `/ai/issues/015-environment-config-and-localization-ui-consistency.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `014-language-and-date-localization-foundation`

It should preserve the localization baseline already introduced in:

- feature `014-language-and-date-localization-foundation`
- feature `013-date-field-width-and-picker-sizing-polish`
- feature `011-dashboard-local-date-input-and-documentation-polish`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a Go backend using `net/http` and `chi`
- a React Router v7 frontend under `frontend/app/`
- an initial language and date-localization foundation
- some remaining environment configuration scattered across backend and frontend code
- a few visible localization polish gaps in control sizing, navigation text, and back-button consistency

The focus of this enhancement is not a broad redesign. The focus is hardening environment configuration handling and completing a tight follow-up polish pass on the localization UI foundation created by `014`.

## Goal

Implement a maintainable follow-up enhancement that:

- standardizes important backend and frontend configuration around a clear `.env`-based pattern
- keeps the backend configuration approach simple and aligned with the current Go stack
- preserves the existing language and date-localization foundation
- fixes the highest-visibility localization UI consistency gaps that remain after `014`

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/`.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, `chi`, `database/sql`, `sqlc`, PostgreSQL, golang-migrate, slog, and validator only if backend changes are required.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Review the current backend and frontend configuration access patterns before changing them.
- Use a `.env`-based approach for important configuration values in both apps where it materially improves clarity and maintainability.
- If backend `.env` loading needs an additional helper, propose it in the plan first and keep the choice minimal.
- Preserve the active-language behavior and localization structure introduced by `014`.
- Fix the high-visibility localization gaps called out in the improvement note, including:
  - control sizing consistency for language and theme actions
  - remaining labels that do not follow the active language
  - inconsistent back-button placement patterns in the scoped pages
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not broaden the scope into unrelated dashboard redesign, authentication, reminders, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not replace the current localization foundation with a different architecture unless a real maintainability problem justifies it.
- Do not change working date-only correctness logic unless required for the scoped UI consistency cleanup.
- Do not treat this as a full-app localization parity project; keep the language polish targeted to the follow-up scope described in the issue.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a clearer environment-configuration pattern for the backend
- a clearer environment-configuration pattern for the frontend
- maintainable notes or structure for required environment values
- improved consistency in the shared localization and theme control area
- localized high-visibility labels that now follow the active language in the scoped pages
- more consistent back-navigation placement in the scoped follow-up surfaces
- updated `/ai/logs/015-environment-config-and-localization-ui-consistency.log.md` after each completed task
- updated `/ai/reviews/015-environment-config-and-localization-ui-consistency.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/014-language-and-date-localization-foundation.issue.md`
- `/ai/prompts/014-language-and-date-localization-foundation.prompt.md`
- `/ai/plans/014-language-and-date-localization-foundation.plan.md`
- `/ai/tasks/014-language-and-date-localization-foundation.tasks.md`
- `/ai/logs/014-language-and-date-localization-foundation.log.md`
- `/ai/reviews/014-language-and-date-localization-foundation.review.md`
- `/ai/improvements/015-add-env-file.md`
- backend config or startup files that currently define important runtime settings
- frontend localization and config files under `frontend/app/lib/`
- shared layout files that host the language and theme controls
- scoped module or detail routes where back-navigation labels and placement still need alignment
