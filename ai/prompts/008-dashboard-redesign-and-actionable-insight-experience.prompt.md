# Prompt: Dashboard Redesign and Actionable Insight Experience

## Context

Implement the next dashboard enhancement for the Personal Tracker App based on:

- `/ai/issues/008-dashboard-redesign-and-actionable-insight-experience.issue.md`
- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`

This enhancement directly extends:

- feature `004-dashboard-revamp-and-module-contribution-views`

The current application already includes:

- a separated `backend/` and `frontend/` structure
- a React Router v7 frontend under `frontend/app/`
- a contribution-centered dashboard direction introduced in feature `004`
- a shared contribution graph component and module contribution detail pages
- existing main layout, sidebar, and theme support

The focus of this enhancement is not changing the overall product domain or abandoning the contribution-based dashboard direction. The focus is to redesign the dashboard so it becomes more actionable, more insight-driven, easier to scan, and more useful for long-term personal tracking.

## Goal

Implement a maintainable dashboard redesign that:

- makes the dashboard faster to understand
- makes daily progress and next actions more obvious
- keeps contribution useful but easier to scan
- adds more meaningful summary and guidance layers
- supports longer-term usage with year-based browsing where appropriate

## Requirements

- Use the workflow and naming rules from `/ai/context/project-rules.md`.
- Follow the stack and folder rules from `/ai/context/tech-stack.md`.
- Keep backend code inside `backend/` if backend work is required.
- Keep frontend code inside `frontend/`.
- Follow the existing repo structure that currently uses `frontend/app/` for the React Router application.
- Use Go with `net/http`, chi, `database/sql`, sqlc, PostgreSQL, golang-migrate, slog, and validator only if backend changes become necessary.
- Use React Router v7, Shadcn UI, and Tailwind CSS for frontend changes.
- Prefer extending the existing dashboard route, shared contribution graph component, and current dashboard data flow instead of building a parallel dashboard system.
- Preserve the dashboard's role as the main progress overview for the existing MVP modules.
- Improve the top dashboard section so users can quickly understand today's progress and next actions.
- Keep contribution as a meaningful section, but reduce the feeling of heavy visual overload.
- Add year-based browsing for contribution if that is needed to support long-term usage.
- Add clearer insight layers such as monthly insight, streak, trend, weekly summary, or recommendation guidance where appropriate.
- Improve empty states so they encourage action rather than only showing `0` values.
- Keep the implementation incremental so one checklist task can be completed and verified at a time.

## Constraints

- Do not introduce frameworks, libraries, databases, or major tools outside `/ai/context/tech-stack.md` unless proposed in the plan first.
- Do not redesign unrelated module flows unless a small supporting change is clearly justified.
- Do not broaden the scope into authentication, reminders, notifications, exports, backups, or integrations.
- Do not refactor unrelated files.
- Do not work on future checklist items when implementing a single task.
- Do not let the redesign become a generic analytics dashboard; it should remain a practical personal habit tracker experience.

## Expected Output

The implementation should produce:

- a redesigned dashboard with clearer daily focus
- a stronger `Progress Hari Ini` area or equivalent primary dashboard surface
- a more useful `Quick Summary` area or equivalent supporting summary surface
- a lighter and more scannable contribution section
- contribution support for longer-term browsing such as year-based viewing if needed
- clearer supportive insight areas such as streak, weekly summary, trend, or recommendations where appropriate
- better empty-state guidance when data is missing or still zero
- updated `/ai/logs/008-dashboard-redesign-and-actionable-insight-experience.log.md` after each completed task
- updated `/ai/reviews/008-dashboard-redesign-and-actionable-insight-experience.review.md` when findings, risks, or follow-up notes are discovered

## Files To Read Before Working

- `/ai/context/project-rules.md`
- `/ai/context/tech-stack.md`
- `/ai/issues/004-dashboard-revamp-and-module-contribution-views.issue.md`
- `/ai/prompts/004-dashboard-revamp-and-module-contribution-views.prompt.md`
- `/ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `/ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `/ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `/ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`
- `/ai/issues/008-dashboard-redesign-and-actionable-insight-experience.issue.md`
- `/ai/improvements/008-dashboard-redisign.md`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/app.css`
- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/dashboard_integration_test.go`
