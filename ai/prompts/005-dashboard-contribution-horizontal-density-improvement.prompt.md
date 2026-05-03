# Prompt: Dashboard Contribution Horizontal Density Improvement

## Context

Implement the next enhancement for the Personal Tracker App based on:

- `/ai/issues/005-dashboard-contribution-horizontal-density-improvement.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `004-dashboard-revamp-and-module-contribution-views`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a shared contribution graph component used by the dashboard and contribution detail route
- dashboard module contribution cards
- module contribution detail pages that keep the graph visible above the activity list

The focus of this enhancement is not changing contribution meaning, module coverage, or detail-page purpose. The focus is to improve graph density and browsing behavior so the contribution UI becomes more compact and horizontally explorable.

## Goal

Implement a maintainable contribution-graph layout improvement that:

- makes contribution cells smaller
- allows one visible card area to show about three months at once
- lets remaining months be browsed by horizontal scrolling
- preserves readability, month boundaries, and real-day alignment

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is needed.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing contribution graph component and current dashboard/detail routes instead of introducing a parallel graph implementation.
- Keep one contribution cell equal to one day.
- Keep the visual aligned with the real number of days in each month.
- Make the graph compact enough that roughly three months can be visible in one card area before horizontal scrolling is needed.
- Support horizontal browsing for the remaining months without forcing the user to scroll through a long vertical month stack.
- Keep the graph usable on both dashboard cards and module contribution detail pages.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce new frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not change contribution scoring rules from feature `004`.
- Do not redesign unrelated dashboard or module flows.
- Do not broaden the scope into custom filters, zooming, drag interactions, or date-range selection.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a denser contribution graph with smaller cells
- a card or graph layout that shows around three months in one visible area
- horizontal overflow behavior for the remaining months
- consistent graph behavior across dashboard and contribution detail pages
- preserved readability for month labels, active-day meaning, and contribution density
- updated `/ai/logs/005-dashboard-contribution-horizontal-density-improvement.log.md` after each completed task
- updated `/ai/reviews/005-dashboard-contribution-horizontal-density-improvement.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/prompts/004-dashboard-revamp-and-module-contribution-views.prompt.md`
- `/ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `/ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`
- `/ai/issues/005-dashboard-contribution-horizontal-density-improvement.issue.md`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css`
