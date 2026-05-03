# Tasks: Dashboard Revamp and Module Contribution Views

## Discovery And Shared Preparation

- [x] Review the current dashboard route, contribution graph component, dashboard handlers, and route registration that affect feature `004`.
- [x] Confirm which current dashboard sections should be kept, reduced, or replaced for a contribution-first layout.
- [x] Confirm whether the current backend contribution endpoint already supports per-module 12-month contribution data.
- [x] Confirm which module record data should appear below each contribution detail view.

## Backend Contribution Support

- [x] Review the current dashboard contribution response shape and identify any gaps for per-module contribution views.
- [x] Adjust backend contribution support only if the current API shape cannot support the required module-level dashboard views.
- [x] Add or update backend verification for contribution aggregation if handler behavior changes.
- [x] Verify route registration for any dashboard or contribution endpoint updates.

## Dashboard Revamp

- [x] Review the current dashboard layout and identify which existing summary sections should no longer be primary.
- [x] Refactor the dashboard route so module contribution views become the primary dashboard structure.
- [x] Add a contribution section or card for Sholat on the dashboard.
- [x] Add a contribution section or card for Puasa on the dashboard.
- [x] Add a contribution section or card for Keuangan on the dashboard.
- [x] Add a contribution section or card for Olahraga on the dashboard.
- [x] Add a contribution section or card for Jurnal on the dashboard.
- [x] Verify the new dashboard still feels focused and not overloaded.

## Shared Contribution Graph

- [x] Review the existing contribution graph component and confirm what should be reused.
- [x] Update the contribution graph component so it can render module-level contribution views clearly.
- [x] Verify the graph correctly represents one day per cell.
- [x] Verify the graph respects the real number of days in each month across the 12-month range.
- [x] Verify the contribution presentation stays understandable without copying GitHub exactly.

## Contribution Detail Route

- [x] Add frontend route registration for a module contribution detail page.
- [x] Create the contribution detail route loader and page structure.
- [x] Keep the selected module contribution graph visible at the top of the detail page.
- [x] Add the related activity or record list below the graph.
- [x] Verify the detail route uses the correct module context and data.

## Contribution Detail By Module

- [x] Verify Sholat contribution detail behavior and activity-list mapping.
- [x] Verify Puasa contribution detail behavior and activity-list mapping.
- [x] Verify Keuangan contribution detail behavior and activity-list mapping.
- [x] Verify Olahraga contribution detail behavior and activity-list mapping.
- [x] Verify Jurnal contribution detail behavior and activity-list mapping.

## Verification And Workflow Updates

- [x] Verify dashboard contribution sections render correctly with real stored records.
- [x] Verify clicking a dashboard contribution view opens the correct contribution detail page.
- [x] Verify the detail page graph and activity list stay consistent with one another.
- [x] Verify contribution views remain compatible with existing sidebar and theme behavior.
- [x] Verify backend and frontend checks still pass after the implementation.
- [x] Update the implementation log after each completed task.
- [x] Update the review file with bugs, risks, validation notes, and follow-up improvements.
