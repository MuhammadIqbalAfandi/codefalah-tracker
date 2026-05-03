# Plan: Contribution Detail Responsive Layout Fix

## Summary

Fix the contribution detail page so it behaves properly on responsive widths and no longer causes the full content area to extend to the right. This enhancement builds on feature `004` by preserving the same route purpose and module-specific detail flow while refining the page layout for smaller screens.

The work should stay focused on layout containment, responsive sizing, and overflow control. The goal is not to redesign the contribution experience, but to make the existing contribution detail page feel stable and usable across screen sizes.

## Scope

Included in this enhancement:

- reviewing the responsive layout of the contribution detail route from feature `004`
- identifying which container or graph region causes horizontal overflow
- adjusting the page so the main content area stays within smaller viewport widths
- ensuring the contribution graph remains visible and usable at the top
- ensuring the activity list remains readable below the graph
- limiting horizontal overflow to the graph region only if such overflow is still needed
- verifying the detail page stays compatible with the existing app shell

Not included in this enhancement:

- contribution scoring or activity-list logic changes
- backend API redesign
- new modules, filters, or graph interactions
- dashboard redesign outside any minimal supporting adjustment required for consistency
- unrelated sidebar, theme, or CRUD flow work

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service if any backend support is required
- `frontend/` for the React Router application

Expected implementation center:

- `frontend/app/routes/dashboard-contribution-detail.tsx`

Likely supporting frontend areas:

- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/app.css`

Backend expectation:

- no backend change by default
- only adjust backend if a real blocker appears, which is unlikely for this responsive bug

## Data Flow

The data flow should remain unchanged from feature `004`:

1. User opens a module contribution detail route.
2. The loader fetches the selected module graph and related records.
3. The page renders the graph at the top and the activity list below it.
4. The responsive fix ensures these sections stay contained within smaller widths.

## Implementation Steps

1. Review the current contribution detail route structure and shared layout to identify which element is forcing page-level horizontal overflow.
2. Confirm whether the graph container, surrounding card, page wrapper, or child content is the main responsive problem.
3. Adjust the detail-page layout so the main content width remains contained on smaller screens.
4. Adjust the graph container or shared graph component only where needed to prevent full-page overflow.
5. Verify that any remaining horizontal scrolling is limited to the intended graph region rather than the page body.
6. Verify the activity list below the graph remains readable and aligned after the responsive fix.
7. Verify compatibility with the existing `MainLayout`, sidebar, and theme behavior.
8. Update workflow logs and review notes with findings, risks, and validation results.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/006-contribution-detail-responsive-layout-fix.issue.md`
- `ai/prompts/006-contribution-detail-responsive-layout-fix.prompt.md`
- `ai/plans/006-contribution-detail-responsive-layout-fix.plan.md`
- `ai/tasks/006-contribution-detail-responsive-layout-fix.tasks.md`
- `ai/logs/006-contribution-detail-responsive-layout-fix.log.md`
- `ai/reviews/006-contribution-detail-responsive-layout-fix.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- `frontend/app/app.css`

Potential backend files only if unexpectedly needed:

- none by default

## Risks And Edge Cases

- The graph may still need some horizontal scrolling on smaller screens, but it should not make the full page overflow.
- A fix that clamps width too aggressively may make month labels, graph cells, or activity cards feel cramped.
- The shared graph component may behave differently inside dashboard cards versus the detail page, so the responsive fix should avoid breaking dashboard usage.
- Overflow issues can come from nested wrappers, min-width settings, or action/header layout rather than the graph alone.
- The activity list may look correct on desktop but still wrap awkwardly on mobile if spacing or flex rules are not reviewed carefully.

## Dependency Proposal

No new dependency is required by default.

Prefer the existing stack and current repo patterns:

- React Router v7
- Tailwind CSS
- Shadcn UI
- existing route and component patterns under `frontend/app/`

If a later implementation step reveals a real limitation, propose it before adding anything new.

## Testing Plan

Frontend:

- verify the contribution detail page no longer makes the full content area overflow to the right
- verify the graph remains visible and usable at the top of the page
- verify the activity list remains readable below the graph
- verify any horizontal scrolling is limited to the intended area only
- verify the page remains compatible with existing sidebar and theme behavior
- run frontend type checks or tests when available

Backend:

- no backend verification is required unless implementation unexpectedly touches backend code

Manual verification:

- open multiple contribution detail pages on narrower widths and confirm the page container stays within the viewport
- confirm that the graph region behaves intentionally if horizontal scrolling is still needed
- confirm that the record list cards do not force the page wider than the viewport

## Assumptions

- This is a follow-up major enhancement to feature `004`, not a new contribution-detail concept.
- The current backend data shape is already sufficient for this responsive fix.
- The main problem is layout containment rather than data loading or routing behavior.
- The contribution detail page should keep the same graph-first and activity-list-below structure after the responsive fix.
