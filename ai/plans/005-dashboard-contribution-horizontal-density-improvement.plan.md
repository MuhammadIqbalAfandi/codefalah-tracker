# Plan: Dashboard Contribution Horizontal Density Improvement

## Summary

Improve the contribution graph introduced in feature `004` so it becomes denser and easier to browse. The main change is a layout shift from vertically stacked month sections toward a horizontally scrollable month strip that can show about three months at a time inside one card.

This enhancement should preserve the existing contribution data model, routing flow, and module coverage. The work is primarily a frontend layout refinement centered on the shared graph component and its container behavior in the dashboard and contribution detail page.

## Scope

Included in this enhancement:

- refining the shared contribution graph layout from feature `004`
- reducing contribution cell size while preserving clarity
- showing roughly three months in one visible graph area
- enabling horizontal scrolling for the remaining months
- keeping month grouping, real day counts, and one-day-per-cell behavior intact
- ensuring the new graph layout works inside dashboard cards
- ensuring the same graph layout also works inside the contribution detail page
- validating overflow, spacing, and usability across the existing app shell

Not included in this enhancement:

- backend scoring rule changes
- new contribution modules
- new filters, custom time windows, or zoom controls
- redesigning non-graph dashboard content
- unrelated route, sidebar, or theme changes

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service if any backend support is required
- `frontend/` for the React Router application

Expected implementation center:

- `frontend/app/components/contribution-graph.tsx`

Supporting frontend areas:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css` if small shared styling support is needed

Backend expectation:

- no backend change by default
- only adjust backend if the current response shape creates a real blocker for the new layout

## Data Flow

The data flow should remain mostly unchanged from feature `004`:

1. Dashboard and detail routes load contribution data.
2. The shared graph component receives a 12-month day-based dataset plus date boundaries.
3. The graph component groups or arranges month segments into a horizontally scrollable presentation.
4. The user sees about three months at once and scrolls sideways to inspect the rest.

## Implementation Steps

1. Review the current `ContributionGraph` structure and identify which parts are tied to the vertical stacked month layout.
2. Define a compact month presentation that can fit about three months in one visible card area.
3. Reduce day-cell dimensions and spacing while keeping active and inactive states distinguishable.
4. Replace or refactor the month stacking layout into a horizontally scrollable arrangement.
5. Verify the new layout still respects real day counts and month grouping.
6. Adjust dashboard card usage if the graph container needs tighter sizing or overflow handling there.
7. Adjust contribution detail page usage if the graph container needs different spacing while preserving the same behavior.
8. Verify readability for labels, legend, and horizontal scrolling cues.
9. Update workflow logs and review notes with any findings, risks, and validation results.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/005-dashboard-contribution-horizontal-density-improvement.issue.md`
- `ai/prompts/005-dashboard-contribution-horizontal-density-improvement.prompt.md`
- `ai/plans/005-dashboard-contribution-horizontal-density-improvement.plan.md`
- `ai/tasks/005-dashboard-contribution-horizontal-density-improvement.tasks.md`
- `ai/logs/005-dashboard-contribution-horizontal-density-improvement.log.md`
- `ai/reviews/005-dashboard-contribution-horizontal-density-improvement.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css`

Potential backend files only if needed:

- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/dashboard_integration_test.go`

## Risks And Edge Cases

- Smaller cells may become too hard to read if spacing, contrast, or legend support are not adjusted carefully.
- Showing three months in one visible area may behave differently across desktop and smaller mobile widths, so responsive handling needs explicit attention.
- Horizontal scrolling can hide content discoverability if the UI does not signal that more months are available to the right.
- A denser graph may introduce layout clipping or overflow issues inside dashboard cards if container widths are too rigid.
- The detail page may need slightly different width behavior from dashboard cards even if both reuse the same component.
- Real month lengths and partial range edges still need to remain correct after the layout refactor.

## Dependency Proposal

No new dependency is required by default.

Prefer the existing stack and current repo patterns:

- React Router v7
- Tailwind CSS
- Shadcn UI
- existing component and route patterns under `frontend/app/`

If a future implementation step reveals a real limitation, propose it before adding anything new.

## Testing Plan

Frontend:

- verify the graph shows smaller contribution cells without losing state clarity
- verify about three months are visible in one card area on the intended main layout
- verify remaining months can be reached by horizontal scrolling
- verify month labels and day density still make sense
- verify the graph remains usable in both dashboard cards and contribution detail pages
- verify overflow behavior does not break the layout on smaller screens
- run frontend type checks or tests when available

Backend:

- no backend verification is required unless implementation introduces backend changes

Manual verification:

- compare dashboard cards before and after the layout change to ensure vertical scrolling is reduced
- open at least one contribution detail page and confirm the same horizontal graph behavior applies there
- confirm that active and inactive cells remain distinguishable at the smaller size

## Assumptions

- This is a follow-up major enhancement to feature `004`, not a new dashboard concept.
- The current contribution data shape is already sufficient for the requested layout change.
- The shared `ContributionGraph` component remains the correct foundation for this enhancement.
- The request to show three months in one card is an approximation target for the visible area, not a rigid pixel-perfect rule across every screen width.
