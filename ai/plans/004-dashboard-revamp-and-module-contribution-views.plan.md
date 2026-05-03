# Plan: Dashboard Revamp and Module Contribution Views

## Summary

Revamp the current dashboard so it becomes a contribution-first overview of the Personal Tracker App.

This enhancement builds on the existing dashboard foundation and the clarity improvements from feature `003`, but moves further by making module-specific contribution views the main dashboard structure instead of treating contribution as a secondary section.

The work should favor clear information flow over broad redesign. The goal is to help users understand daily consistency across modules, then move into a module-specific contribution detail page that still keeps the visual contribution context visible.

## Scope

Included in this enhancement:

- restructuring the dashboard so contribution views become a primary dashboard element
- rendering contribution sections or cards for the existing MVP modules where relevant
- showing a 12-month contribution range for each supported module
- representing each day as one contribution cell
- keeping the contribution view aligned with the real number of days in each month
- supporting click-through from dashboard contribution views into module-specific contribution detail pages
- showing the selected module contribution graph at the top of the detail page
- showing a related activity or record list below the graph on the detail page
- adding or adjusting backend dashboard/contribution support only if the current API shape does not support the required module-level views
- focused verification for dashboard layout, contribution accuracy, navigation flow, and detail-page usefulness

Not included in this enhancement:

- new tracker modules
- authentication or multi-user support
- reminders, notifications, export, backup, or integrations
- a full redesign of unrelated form, CRUD, or module detail flows
- advanced scoring systems beyond the basic meaning of daily contribution presence unless existing data already supports it cleanly
- stack replacement or major dependency additions outside the approved tech stack

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's current frontend convention:

- route and UI work should align with `frontend/app/`

Backend responsibilities:

- review the current dashboard summary and contribution endpoints
- determine whether the existing dashboard API can provide module-level contribution summaries for 12 months
- add or adjust contribution-related handlers only if the current response shape blocks the planned frontend behavior
- preserve chi-based routing, current validation patterns, and existing handler style
- keep response changes targeted to dashboard contribution needs

Frontend responsibilities:

- reshape the dashboard route around module contribution sections instead of generic summary emphasis
- reuse and evolve the existing contribution graph component where possible
- add one or more route modules for contribution detail views through the existing route registration flow
- keep activity-list logic close to the route layer rather than burying it inside presentation-only components
- keep visual changes consistent with Tailwind CSS and current app styling patterns

## Data Flow

Typical dashboard contribution flow:

1. User opens the dashboard route.
2. Frontend loads dashboard summary and contribution data from the existing dashboard endpoints or updated equivalents.
3. Frontend maps the returned data into module-specific contribution sections for the supported trackers.
4. The user sees a 12-month contribution overview for each module.

Typical contribution detail flow:

1. User clicks a contribution section or card for a module on the dashboard.
2. Frontend navigates to a module contribution detail route.
3. The detail route loads the contribution graph context and the related activity or record list for that module.
4. The page renders the contribution graph at the top and the activity list below it.
5. The user can understand both the visual contribution pattern and the underlying records without losing context.

Possible data-refresh flow:

1. Module records are created, edited, or deleted in other parts of the app.
2. Existing dashboard refresh behavior or route revalidation runs where needed.
3. Dashboard contribution sections and contribution detail pages reflect the updated records.

## Implementation Steps

1. Review the current dashboard route, contribution component, dashboard handlers, and route registration to confirm how contribution data is loaded today.
2. Confirm which parts of the current dashboard can be kept, reduced, or replaced to support a contribution-first layout.
3. Confirm whether the current backend contribution endpoint already supports per-module, 12-month contribution data in the shape needed by the frontend.
4. Adjust backend contribution and related activity-list support only where the current API shape is insufficient.
5. Refactor the dashboard route so supported modules each have a dedicated contribution section or card.
6. Update or extend the shared contribution graph component so it can render module-level contribution views clearly in the new dashboard layout.
7. Register a contribution detail route pattern in the frontend route configuration.
8. Build the module contribution detail page so the selected contribution graph stays visible at the top.
9. Add the related activity or record list below the graph using the existing module data model and route loader patterns.
10. Verify navigation between dashboard and contribution detail views remains clear and consistent.
11. Verify contribution visuals, day mapping, and activity-list data remain consistent with real stored records.
12. Update workflow logs after each completed task and capture review notes for follow-up risks.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/prompts/004-dashboard-revamp-and-module-contribution-views.prompt.md`
- `ai/plans/004-dashboard-revamp-and-module-contribution-views.plan.md`
- `ai/tasks/004-dashboard-revamp-and-module-contribution-views.tasks.md`
- `ai/logs/004-dashboard-revamp-and-module-contribution-views.log.md`
- `ai/reviews/004-dashboard-revamp-and-module-contribution-views.review.md`

Frontend files:

- `frontend/app/routes.ts`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/components/summary-card.tsx`
- `frontend/app/lib/navigation.ts`
- `frontend/app/root.tsx`
- `frontend/app/app.css`
- one or more new contribution-detail route files under `frontend/app/routes/`

Potential backend files if contribution data changes are needed:

- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/router.go`
- `backend/internal/handlers/dashboard_integration_test.go`

## Risks And Edge Cases

- The current contribution endpoint may be designed around one combined dashboard view rather than five module-specific contribution views, which could require a careful API adjustment.
- A 12-month contribution layout can become visually dense if spacing, month grouping, or labels are unclear.
- Some modules may not have equally obvious daily contribution rules, so the product meaning of a filled day must stay simple and explicit.
- A dashboard revamp can accidentally duplicate module-history pages if contribution detail pages become too broad.
- Navigation can become confusing if the dashboard and contribution detail pages use inconsistent module naming or period labels.
- Real month-length handling can be error-prone if the frontend assumes fixed-size month grids without respecting the true calendar.
- If contribution data is recomputed differently between dashboard and detail pages, users may see mismatched totals or day states.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and current repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a later implementation step reveals a real limitation, propose it before adding anything new.

## Testing Plan

Backend:

- Verify dashboard contribution responses still align with the intended frontend usage
- Verify any changed dashboard or contribution handler behavior with focused handler or integration tests
- Verify per-module contribution responses remain consistent with stored records and dates

Frontend:

- Verify the dashboard route renders module contribution views clearly
- Verify each supported module contribution view covers the intended 12-month range
- Verify day cells align with real month lengths
- Verify clicking a module contribution section opens the correct detail page
- Verify the detail page keeps the graph visible at the top and shows the related activity list below
- Verify the dashboard and detail page remain compatible with existing light and dark theme behavior
- Run frontend type checks or tests when available

Manual verification:

- Open the dashboard with existing sample data and confirm each supported module shows contribution activity in a readable way
- Compare a few known days against stored records to confirm filled and empty contribution cells make sense
- Open contribution detail pages for multiple modules and confirm the graph stays visible while the activity list explains the underlying data
- Create, edit, or delete sample records and confirm the affected contribution views update as expected

## Assumptions

- Feature `004` builds directly on the current dashboard, routing, and contribution work from features `001`, `002`, and `003`.
- The current `frontend/app/` structure should continue to be used instead of forcing a restructure to a different frontend layout.
- The existing dashboard route and contribution graph component are the correct starting points for this enhancement.
- The contribution detail page should reuse existing module naming and data concepts rather than inventing a new reporting domain.
- A simple and explicit definition of daily contribution is preferable to a more complex scoring model unless the existing backend data already supports deeper logic cleanly.
