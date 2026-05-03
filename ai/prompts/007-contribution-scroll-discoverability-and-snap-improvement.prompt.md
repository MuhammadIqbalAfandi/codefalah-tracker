# Prompt: Contribution Scroll Discoverability and Snap Improvement

## Context

Implement the next enhancement for the Personal Tracker App based on:

- `/ai/issues/007-contribution-scroll-discoverability-and-snap-improvement.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `004-dashboard-revamp-and-module-contribution-views`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a shared contribution graph component used by the dashboard and contribution detail route
- horizontally scrollable contribution month cards from later contribution-graph refinements
- contribution detail pages that keep the graph visible above the activity list

The focus of this enhancement is not changing contribution meaning, module data flow, or route structure. The focus is to make horizontal browsing more obvious and polished through stronger visual hints and snap behavior.

## Goal

Implement a maintainable contribution-scroll UX improvement that:

- makes horizontal scroll affordance much more obvious
- prevents users from assuming only the first visible months exist
- adds a cleaner snapping feel per month card or per scroll section
- keeps the experience clear across dashboard cards and contribution detail pages

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` only if backend work becomes necessary.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing shared contribution graph component instead of introducing a separate graph implementation.
- Add a stronger visual hint for horizontal scrolling. This is required.
- Consider cues such as:
  - a right-side fade or shadow gradient
  - a small directional arrow
  - stronger or more visible guidance text
- Add snapping behavior so scrolling feels aligned per month card or per contribution section.
- Keep the graph usable on both dashboard cards and contribution detail pages.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not change contribution scoring rules or module routing semantics from feature `004`.
- Do not redesign unrelated dashboard, detail-page, sidebar, theme, or CRUD behavior.
- Do not broaden the scope into filters, zoom interactions, drag-based navigation, or date-range selection.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.

## Expected Output

The implementation should produce:

- a contribution view with stronger horizontal scroll discoverability
- at least one clear required visual hint that more months exist to the right
- snapping behavior that feels aligned and intentional
- consistent behavior across dashboard cards and contribution detail pages
- updated `/ai/logs/007-contribution-scroll-discoverability-and-snap-improvement.log.md` after each completed task
- updated `/ai/reviews/007-contribution-scroll-discoverability-and-snap-improvement.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/prompts/004-dashboard-revamp-and-module-contribution-views.prompt.md`
- `/ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `/ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`
- `/ai/issues/007-contribution-scroll-discoverability-and-snap-improvement.issue.md`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css`
