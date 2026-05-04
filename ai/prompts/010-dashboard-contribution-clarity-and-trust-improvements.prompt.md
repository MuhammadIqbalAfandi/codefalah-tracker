# Prompt: Dashboard Contribution Clarity and Trust Improvements

## Context

Implement the next dashboard enhancement for the Personal Tracker App based on:

- `/ai/issues/010-dashboard-contribution-clarity-and-trust-improvements.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `008-dashboard-redesign-and-actionable-insight-experience`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a redesigned dashboard with `Progress Hari Ini`, `Quick Summary`, insight cards, and year-based contribution browsing from feature `008`
- a shared contribution graph component
- dashboard summary and module contribution API endpoints

The focus of this enhancement is not another broad dashboard redesign. The focus is refining the current dashboard so its richer information becomes easier to understand, easier to trust, and less likely to confuse users.

## Goal

Implement a maintainable dashboard clarity enhancement that:

- makes dashboard meaning easier to understand
- improves the usability of year-based contribution browsing
- adds explanation or guidance for important dashboard concepts
- clarifies contribution intensity interpretation, especially for Sholat
- helps distinguish between explanation problems, scoring-rule problems, and real backend/data mismatches

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing dashboard route, shared contribution graph component, and current dashboard data flow instead of building a parallel dashboard system.
- Preserve the dashboard role and visual direction established in feature `008`.
- Improve the year selector so it remains usable when contribution history grows.
- Add a help, explanation, or lightweight documentation surface for key dashboard concepts.
- Clarify the meaning of progress, reference date, streak, and contribution intensity labels.
- Review whether contribution intensity scoring and presentation, especially for Sholat, feel correct and understandable.
- Treat any discovered mismatch between displayed dashboard values and stored data as a real bug to be validated and fixed if it falls inside the defined implementation scope.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not replace the current contribution-centered dashboard direction with a new dashboard concept.
- Do not broaden the scope into authentication, reminders, notifications, exports, backups, or integrations.
- Do not redesign unrelated routes or module CRUD flows unless a small supporting change is clearly justified.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.
- Do not assume every confusing dashboard value is only a copywriting problem; validate whether the issue is explanation, scoring logic, or real data mismatch.

## Expected Output

The implementation should produce:

- a clearer and more trustworthy version of the current redesigned dashboard
- a more scalable year-browsing control for contribution history
- a dashboard explanation surface for important concepts and signals
- clearer explanation or adjustment of contribution intensity labels
- better explanation or validation of how progress, streak, and reference-date signals work
- updated `/ai/logs/010-dashboard-contribution-clarity-and-trust-improvements.log.md` after each completed task
- updated `/ai/reviews/010-dashboard-contribution-clarity-and-trust-improvements.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/008-dashboard-redesign-and-actionable-insight-experience.issue.md`
- `/ai/prompts/008-dashboard-redesign-and-actionable-insight-experience.prompt.md`
- `/ai/plans/008-dashboard-redesign-and-actionable-insight-experience.plan.md`
- `/ai/tasks/008-dashboard-redesign-and-actionable-insight-experience.tasks.md`
- `/ai/logs/008-dashboard-redesign-and-actionable-insight-experience.log.md`
- `/ai/reviews/008-dashboard-redesign-and-actionable-insight-experience.review.md`
- `/ai/issues/010-dashboard-contribution-clarity-and-trust-improvements.issue.md`
- `/ai/improvements/009-revert-dashbord-contribute.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/dashboard_integration_test.go`
