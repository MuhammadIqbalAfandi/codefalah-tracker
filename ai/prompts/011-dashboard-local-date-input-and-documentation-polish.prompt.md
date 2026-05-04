# Prompt: Dashboard Local Date, Input Consistency, and Documentation Polish

## Context

Implement the next dashboard enhancement for the Personal Tracker App based on:

- `/ai/issues/011-dashboard-local-date-input-and-documentation-polish.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `010-dashboard-contribution-clarity-and-trust-improvements`

It also continues the dashboard direction established in:

- feature `008-dashboard-redesign-and-actionable-insight-experience`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- dashboard explanation and contribution improvements from feature `010`
- shared dashboard and contribution flows that depend heavily on correct local date handling
- existing frontend helpers and backend handlers that already support dashboard summary and contribution views

The focus of this enhancement is not a new redesign. The focus is tightening the current dashboard experience by improving UI consistency, validating local-date correctness, and moving explanation content into a more appropriate interaction pattern.

## Goal

Implement a maintainable dashboard refinement that:

- makes date and select interactions feel more consistent with the current UI system
- verifies and fixes local `Asia/Jakarta` date handling if a real mismatch exists
- keeps dashboard documentation easy to access without keeping it always expanded in the main layout
- improves the visual clarity of time-period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini`

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending existing dashboard routes, detail routes, form helpers, and shared UI components instead of building parallel flows.
- Review native browser date and select controls that affect dashboard-related experiences and replace them with repo-aligned UI components where appropriate.
- Verify the full date path for dashboard summary date, contribution date, default form date, and dashboard contribution detail date handling.
- Treat any UTC or parsing-related day shift as a correctness bug if it affects user-visible behavior.
- Move dashboard explanation content into a popup, dialog, or similarly lightweight surface if that best preserves layout hierarchy.
- Keep the documentation entry point obvious and easy to discover.
- Refine period-label typography without making those labels visually heavier than the primary content.
- Preserve the clarity and trust improvements already delivered in feature `010`.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not replace the dashboard direction established by features `008` and `010`.
- Do not broaden the scope into unrelated CRUD redesign, authentication, reminders, notifications, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not assume the timezone problem is frontend-only; validate the full frontend/backend date flow before deciding the fix location.
- Do not keep the documentation surface permanently expanded by default if that continues to overload the main dashboard layout.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a more visually consistent dashboard-related date and select experience
- corrected local-date behavior for dashboard and contribution flows if a real timezone mismatch exists
- a lighter dashboard documentation interaction pattern with a clear entry point
- cleaner and more intentional typography for key period labels
- updated `/ai/logs/011-dashboard-local-date-input-and-documentation-polish.log.md` after each completed task
- updated `/ai/reviews/011-dashboard-local-date-input-and-documentation-polish.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/010-dashboard-contribution-clarity-and-trust-improvements.issue.md`
- `/ai/prompts/010-dashboard-contribution-clarity-and-trust-improvements.prompt.md`
- `/ai/plans/010-dashboard-contribution-clarity-and-trust-improvements.plan.md`
- `/ai/tasks/010-dashboard-contribution-clarity-and-trust-improvements.tasks.md`
- `/ai/logs/010-dashboard-contribution-clarity-and-trust-improvements.log.md`
- `/ai/reviews/010-dashboard-contribution-clarity-and-trust-improvements.review.md`
- `/ai/improvements/011-fix-detail-contibute-doc.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/lib/form-defaults.ts`
- `frontend/app/components/empty-state.tsx`
- `backend/internal/handlers/dashboard.go`
- any dashboard- or date-related helper files currently used by the active implementation
