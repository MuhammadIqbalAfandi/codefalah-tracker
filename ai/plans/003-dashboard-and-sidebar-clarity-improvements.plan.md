# Plan: Dashboard and Sidebar Clarity Improvements

## Summary

Improve the existing Personal Tracker App so the shared sidebar is easier to use and the dashboard is easier to understand.

This enhancement builds on the current MVP module foundation and record-management flows by refining how dashboard data is presented, how time-based summaries are explained, and how the main navigation behaves on different screen sizes.

The work should favor clarity over feature expansion. The goal is to make existing data more readable and meaningful rather than adding new product areas.

## Scope

Included in this enhancement:

- shared sidebar open and close behavior improvements
- sidebar usability improvements for small and large screens
- dashboard card clarity improvements
- clearer progress indicators and labels
- clearer contribution or activity-pattern presentation
- stronger time-range-based summaries for relevant MVP modules
- improved dashboard use of real stored records for:
  - Sholat
  - Puasa
  - Keuangan
  - Olahraga
  - Jurnal
- focused verification for dashboard readability, navigation behavior, and summary consistency

Not included in this enhancement:

- new tracker modules
- authentication or multi-user support
- notifications, reminders, export, backup, or integrations
- full redesign of unrelated module CRUD flows
- stack replacement or major dependency additions outside the approved tech stack

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's current frontend convention:

- route and UI work should align with `frontend/app/`

Backend responsibilities:

- review existing dashboard handlers and related summary endpoints
- adjust backend summary payloads only if the current data shape blocks clearer dashboard behavior
- preserve chi-based routing and existing validation patterns
- keep response changes minimal and targeted to dashboard clarity needs

Frontend responsibilities:

- refine the shared layout and navigation behavior in the existing frontend shell
- improve dashboard route behavior, sections, and summary presentation
- reuse existing reusable components where possible
- keep time-range and summary logic close to the dashboard route or relevant shared helpers
- keep visual changes consistent with Tailwind CSS and Shadcn UI patterns already in the repo

## Data Flow

Typical dashboard summary flow:

1. User opens the dashboard route.
2. Frontend loads dashboard summary data from the existing backend summary endpoint or related existing loaders.
3. Frontend maps the returned data into cards, progress displays, contribution sections, and module-level summaries.
4. The UI presents the data with clearer labels, grouping, and time-range meaning.

Typical sidebar flow:

1. User opens the app on desktop or mobile.
2. The shared layout renders module navigation.
3. User can explicitly open or close the sidebar.
4. The layout preserves a clear navigation experience across screen sizes without making the dashboard harder to use.

Possible dashboard refresh flow when stored records change:

1. A module create, edit, or delete action completes.
2. Existing frontend refresh or change-notification patterns trigger dashboard revalidation where needed.
3. The dashboard re-renders summaries so cards, progress, and contribution sections stay consistent with current records.

## Implementation Steps

1. Review the current shared layout, sidebar behavior, dashboard route, dashboard API payload, and reusable dashboard UI components.
2. Identify which current cards, labels, progress values, and contribution sections are ambiguous or too generic.
3. Identify whether current backend dashboard data already supports clearer time-range summaries for MVP modules.
4. Adjust backend dashboard summary behavior only where missing or unclear data blocks the intended frontend clarity improvements.
5. Improve the shared sidebar interaction so open and close behavior is explicit and understandable.
6. Refine dashboard summary cards so their meaning, labels, and data context are clearer.
7. Improve progress presentation so percentages and totals explain what is being measured.
8. Improve contribution or activity-pattern presentation so users can understand active and inactive periods more quickly.
9. Improve module-related dashboard summaries for Sholat, Puasa, Keuangan, Olahraga, and Jurnal using useful time ranges such as today, this week, this month, and this year where appropriate.
10. Verify that dashboard values remain consistent with real stored records and recent record changes.
11. Update workflow logs after each completed task and capture follow-up review notes.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/prompts/003-dashboard-and-sidebar-clarity-improvements.prompt.md`
- `ai/plans/003-dashboard-and-sidebar-clarity-improvements.plan.md`
- `ai/tasks/003-dashboard-and-sidebar-clarity-improvements.tasks.md`
- `ai/logs/003-dashboard-and-sidebar-clarity-improvements.log.md`
- `ai/reviews/003-dashboard-and-sidebar-clarity-improvements.review.md`

Frontend files:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/lib/navigation.ts`
- `frontend/app/components/summary-card.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/empty-state.tsx`
- `frontend/app/root.tsx`
- `frontend/app/app.css`

Potential backend files if dashboard payload updates are needed:

- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/router.go`
- `backend/internal/handlers/dashboard_integration_test.go`

## Risks And Edge Cases

- The current dashboard may already be coupled to a specific backend summary shape, so UI clarity improvements may expose gaps in backend payload naming or granularity.
- Some progress values may be conceptually ambiguous if the product still lacks explicit target definitions for certain modules.
- Time-range summaries can become confusing if labels, local date handling, and empty states are not aligned.
- Dashboard improvements can accidentally duplicate module detail/history information if summary sections become too dense.
- Sidebar behavior can become inconsistent across breakpoints if state handling is split across too many components.
- Contribution-style visuals can look polished but still be unclear if legends, labels, or period context are missing.
- Visual redesign effort can spread too widely unless tasks stay focused on clarity and comprehension.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and current repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a later implementation step reveals a genuine limitation, propose it before adding anything new.

## Testing Plan

Backend:

- Verify dashboard summary responses still match the intended frontend usage
- Verify any changed dashboard endpoint behavior with focused handler or integration tests
- Verify summary values remain consistent after record changes where backend aggregation is involved

Frontend:

- Verify the sidebar can be clearly opened and closed
- Verify sidebar behavior is understandable on small and large screens
- Verify dashboard cards and summary sections are easier to interpret
- Verify progress indicators show enough context to explain the displayed values
- Verify contribution or activity-pattern sections remain readable
- Verify dashboard summaries stay consistent with real stored records
- Verify dashboard behavior remains theme-compatible across light and dark mode
- Run frontend type checks or tests when available

Manual verification:

- Open the dashboard with existing sample data and confirm the card meanings are understandable without guessing
- Check each relevant MVP module summary area and confirm the selected time range is clear
- Create, edit, or delete sample records and confirm dashboard summaries remain sensible afterward
- Open the app on narrow and wide layouts and confirm the sidebar interaction remains easy to use

## Assumptions

- Feature `003` builds directly on the current state created by features `001` and `002`.
- The existing dashboard route and summary endpoint are the correct starting points for this enhancement.
- The frontend should follow the current `frontend/app/` scaffold rather than forcing a restructure to a different folder layout.
- The MVP modules remain Sholat, Puasa, Keuangan, Olahraga, and Jurnal for this dashboard-focused enhancement.
- Any deeper product definition for targets, scoring, or advanced analytics can stay lightweight unless the existing data model already supports more detail.
