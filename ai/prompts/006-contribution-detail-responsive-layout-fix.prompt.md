# Prompt: Contribution Detail Responsive Layout Fix

## Context

Implement the next enhancement for the Personal Tracker App based on:

- `/ai/issues/006-contribution-detail-responsive-layout-fix.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `004-dashboard-revamp-and-module-contribution-views`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a dashboard contribution flow that opens `/dashboard/contributions/:module`
- a contribution detail route that keeps the graph at the top and shows the related activity list below it
- existing shared layout, theme, and sidebar behavior from earlier features

The focus of this enhancement is not changing contribution meaning or module-level data flow. The focus is to fix the responsive layout of the contribution detail page so the content no longer stretches horizontally on narrower screens.

## Goal

Implement a maintainable responsive-layout fix for the contribution detail page that:

- prevents the page content from extending unnecessarily to the right
- keeps the graph and activity list readable on smaller screens
- contains any needed horizontal overflow to the appropriate UI region only

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` only if backend work becomes necessary.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing contribution detail route and shared contribution graph usage instead of creating a parallel detail page.
- Keep the contribution graph visible at the top of the detail page.
- Keep the related activity list below the graph.
- Ensure the detail page remains usable on smaller widths without the full page overflowing to the right.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not change contribution scoring rules or module routing semantics from feature `004`.
- Do not redesign unrelated dashboard, CRUD, sidebar, or theme behavior.
- Do not broaden the scope into new filters, graph interactions, or data model changes.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a responsive contribution detail page that no longer makes the full content area overflow to the right
- a graph section that remains usable on smaller screens
- an activity-list section that stays readable within the responsive page layout
- limited and intentional overflow behavior only where it is truly needed
- updated `/ai/logs/006-contribution-detail-responsive-layout-fix.log.md` after each completed task
- updated `/ai/reviews/006-contribution-detail-responsive-layout-fix.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/prompts/004-dashboard-revamp-and-module-contribution-views.prompt.md`
- `/ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `/ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`
- `/ai/issues/006-contribution-detail-responsive-layout-fix.issue.md`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/app.css`
