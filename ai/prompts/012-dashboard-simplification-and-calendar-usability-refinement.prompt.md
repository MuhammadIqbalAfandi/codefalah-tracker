# Prompt: Dashboard Simplification and Calendar Usability Refinement

## Context

Implement the next dashboard-focused enhancement for the Personal Tracker App based on:

- `/ai/issues/012-dashboard-simplification-and-calendar-usability-refinement.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `011-dashboard-local-date-input-and-documentation-polish`

It also preserves and refines the dashboard direction established in:

- feature `008-dashboard-redesign-and-actionable-insight-experience`
- feature `010-dashboard-contribution-clarity-and-trust-improvements`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- Jakarta-aligned dashboard date handling from feature `011`
- shared date/select field work and a dialog-based help surface from feature `011`
- contribution year browsing, contribution detail, and dashboard summary flows from features `008` through `011`

The focus of this enhancement is not a new dashboard redesign. The focus is refining the current experience so it feels lighter, more focused, more mobile-friendly, and closer to the intended calendar interaction pattern.

## Goal

Implement a maintainable dashboard refinement that:

- improves the date-input interaction across tracker modules toward a clearer calendar-based experience
- simplifies dashboard density by removing or reducing non-essential surfaces such as `Quick Summary`
- improves the contribution year filter presentation and responsiveness on mobile
- keeps dashboard help accessible without occupying space in the default layout
- improves contribution-detail usability by bringing the current month into view more quickly

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Reuse and extend the existing work from feature `011` instead of replacing it with a parallel pattern.
- Review how the current shared date field works and refine it only if needed to support a clearer calendar-driven interaction.
- Keep the scope centered on tracker-module date input, dashboard density, year-filter usability, help-surface placement, and contribution-detail month targeting.
- Remove `Quick Summary` only if that clearly improves dashboard focus without weakening the main dashboard purpose.
- Keep the dashboard help entry point easy to discover near the top-level dashboard context.
- Ensure the help surface remains responsive and practical on mobile.
- Preserve the local-date correctness improvements already delivered in feature `011`.
- Treat contribution-detail month targeting as an experience improvement and implement it with the narrowest safe approach.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not replace the dashboard direction established by features `008`, `010`, and `011`.
- Do not broaden the scope into unrelated CRUD redesign, authentication, reminders, notifications, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not undo the existing date-correctness improvements from feature `011`.
- Do not expand the enhancement into a full form-system overhaul across the whole app.
- Do not work on future checklist items when implementing a single task.
- Do not assume the contribution-detail month-targeting behavior requires backend changes unless the frontend path proves insufficient.

## Expected Output

The implementation should produce:

- a clearer calendar-oriented date input experience for the in-scope tracker modules
- a simpler and less text-heavy dashboard surface
- a more responsive and visually cleaner dashboard year filter
- a help trigger and help dialog pattern that stays available without occupying dashboard space by default
- a contribution-detail experience that lands nearer the current month
- updated `/ai/logs/012-dashboard-simplification-and-calendar-usability-refinement.log.md` after each completed task
- updated `/ai/reviews/012-dashboard-simplification-and-calendar-usability-refinement.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/011-dashboard-local-date-input-and-documentation-polish.issue.md`
- `/ai/prompts/011-dashboard-local-date-input-and-documentation-polish.prompt.md`
- `/ai/plans/011-dashboard-local-date-input-and-documentation-polish.plan.md`
- `/ai/tasks/011-dashboard-local-date-input-and-documentation-polish.tasks.md`
- `/ai/logs/011-dashboard-local-date-input-and-documentation-polish.log.md`
- `/ai/reviews/011-dashboard-local-date-input-and-documentation-polish.review.md`
- `/ai/improvements/012-fix-date-input-module.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/components/ui/date-field.tsx`
- `frontend/app/components/ui/select-field.tsx`
- `frontend/app/components/ui/dialog.tsx`
- `frontend/app/lib/form-defaults.ts`
- `backend/internal/handlers/dashboard.go`
