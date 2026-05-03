# Plan: Dashboard Redesign and Actionable Insight Experience

## Summary

Redesign the dashboard so it feels more actionable, more insightful, and easier to understand at a glance. This enhancement extends feature `004` by preserving the contribution-based dashboard foundation while significantly improving the information hierarchy, daily guidance, and long-term readability of the page.

The redesign should favor product clarity over decorative density. The goal is to help users quickly understand today's progress, long-term consistency, and the most useful next action.

## Scope

Included in this enhancement:

- redesigning the top dashboard section into a clearer daily action surface
- replacing or refining the current primary card into a `Progress Hari Ini` experience or equivalent
- improving the supporting quick-summary area with better status clarity and lightweight insight
- simplifying contribution reading so it feels lighter and easier to scan
- supporting year-based browsing for contribution history if needed
- adding dashboard-level insight surfaces such as streak, weekly summary, trend, recommendation guidance, or similar useful summary layers
- improving empty states so they lead users toward action
- verifying the redesign remains aligned with the existing personal habit-tracker direction

Not included in this enhancement:

- backend architecture redesign
- new tracker modules
- unrelated route redesign outside the dashboard unless a small supporting change is clearly justified
- authentication, reminders, notifications, export, backup, or integrations
- broad redesign of module CRUD pages

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's actual frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- redesign the dashboard route around faster comprehension and clearer action surfaces
- reuse or evolve the current contribution graph rather than replacing the contribution system entirely
- add or adjust dashboard-only building blocks where needed
- keep styling aligned with the existing app shell and route structure

Backend responsibilities:

- review whether the current dashboard response shape already supports the redesigned summary and insight needs
- add or adjust dashboard data support only if the current API shape blocks the planned redesign
- keep any backend change targeted to dashboard summary or contribution needs

## Data Flow

Expected dashboard redesign flow:

1. User opens the dashboard route.
2. Frontend loads dashboard summary and contribution data from the current dashboard endpoints or updated equivalents.
3. Frontend maps the returned data into a clearer daily progress surface, a cleaner supporting summary area, and a lighter contribution section.
4. Additional dashboard-level insight blocks reuse existing data where possible and only request new backend support if needed.
5. The user understands current progress and likely next action much faster than before.

## Implementation Steps

1. Review the current dashboard route structure and identify which sections feel passive, heavy, or too text-dense.
2. Redefine the top-section hierarchy so the main card becomes a stronger daily action surface.
3. Improve the supporting summary area so it gives faster status understanding and lightweight insight.
4. Review the contribution section and decide how to simplify its reading without discarding its role.
5. Add year-based contribution browsing if that is needed for long-term usage.
6. Add insight-oriented supporting cards such as streak, weekly summary, trend, or recommendations where they genuinely improve decision-making.
7. Improve empty states so they encourage meaningful next actions.
8. Verify the redesigned dashboard still feels focused and does not become overly busy.
9. Adjust backend dashboard support only if the redesigned UI clearly requires new summary fields or data shapes.
10. Update workflow logs and review notes with findings, risks, and validation results.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/008-dashboard-redesign-and-actionable-insight-experience.issue.md`
- `ai/prompts/008-dashboard-redesign-and-actionable-insight-experience.prompt.md`
- `ai/plans/008-dashboard-redesign-and-actionable-insight-experience.plan.md`
- `ai/tasks/008-dashboard-redesign-and-actionable-insight-experience.tasks.md`
- `ai/logs/008-dashboard-redesign-and-actionable-insight-experience.log.md`
- `ai/reviews/008-dashboard-redesign-and-actionable-insight-experience.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/app.css`
- one or more new dashboard-focused components under `frontend/app/components/`

Potential backend files if data support changes are needed:

- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/dashboard_integration_test.go`
- related dashboard SQL files if new summary fields are required

## Risks And Edge Cases

- The redesign can become too crowded if too many insight cards are added without strong prioritization.
- A stronger actionable dashboard can accidentally drift into a generic analytics product instead of staying grounded in personal habit tracking.
- Year filtering and long-term contribution browsing can complicate the current interaction if not introduced carefully.
- Empty-state guidance can become repetitive or noisy if every zero-value condition tries to compete for attention.
- Reworking the top hierarchy can unintentionally weaken the contribution-focused direction from feature `004` if the new structure is not balanced well.
- New insight cards may appear useful in theory but provide little practical value if they are not backed by meaningful signals.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a later implementation step reveals a real limitation, propose it before adding anything new.

## Testing Plan

Backend:

- verify any changed dashboard response shape still aligns with frontend usage
- verify any new summary or contribution fields remain consistent with stored records
- add or update focused dashboard tests if backend behavior changes

Frontend:

- verify the dashboard is faster to understand and more actionable in its layout
- verify the primary progress surface clearly communicates today's status
- verify the supporting summary area gives useful quick insight
- verify the contribution section remains helpful but lighter to scan
- verify year-based browsing works correctly if added
- verify insight cards and empty states improve clarity rather than noise
- run frontend type checks or tests when available

Manual verification:

- open the dashboard and judge whether the primary action surface is understandable within a few seconds
- confirm zero or empty states now lead toward meaningful next steps
- compare the redesigned dashboard against the previous one to ensure the page feels more useful, not just different

## Assumptions

- This is a major dashboard follow-up to feature `004`, not a new product direction outside the existing tracker.
- The current `frontend/app/` structure should continue to be used.
- The redesigned dashboard should still preserve the value of contribution history rather than removing it.
- Some requested insight cards may be implemented in a lighter or combined form if that produces a cleaner dashboard.
