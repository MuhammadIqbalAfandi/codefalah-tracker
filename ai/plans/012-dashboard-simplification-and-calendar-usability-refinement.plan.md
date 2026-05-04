# Plan: Dashboard Simplification and Calendar Usability Refinement

## Summary

Refine the post-`011` dashboard and tracker-input experience so it feels lighter, more focused, and more intentional in day-to-day use.

This enhancement builds directly on feature `011-dashboard-local-date-input-and-documentation-polish`. It does not replace the current dashboard direction. Instead, it narrows the experience further by improving calendar usability, removing dashboard distraction, tightening mobile behavior, and making contribution detail faster to land in the most relevant time context.

## Scope

Included in this enhancement:

- review the current shared date-field interaction introduced in feature `011`
- refine date selection across in-scope tracker modules toward the intended Shadcn-aligned calendar experience
- simplify the dashboard year-filter presentation and improve mobile responsiveness
- remove or reduce dashboard surfaces that now create distraction, especially `Quick Summary`
- trim text-heavy dashboard presentation where it weakens scanability
- preserve help access while removing any remaining documentation-card weight from the default layout
- improve contribution-detail opening behavior so the current month is easier to reach immediately
- keep changes incremental and scoped to usability refinement of the existing implementation

Not included in this enhancement:

- a new dashboard redesign direction
- unrelated CRUD or layout refactors outside the affected flows
- new tracker modules
- new dependencies unless a real limitation appears and is proposed first
- broad backend changes beyond narrow support for contribution-detail behavior if absolutely needed

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- evaluate whether the existing shared date field from feature `011` already supports the intended calendar behavior or needs refinement
- update dashboard layout composition to reduce distraction without losing access to important guidance
- simplify the contribution year filter presentation and verify mobile behavior
- update contribution-detail behavior so the user lands near the current month with minimal manual scrolling
- preserve current local-date helper behavior while avoiding regressions from feature `011`

Backend responsibilities:

- stay unchanged by default
- only support the enhancement if contribution-detail month targeting or related dashboard behavior reveals a narrow backend need

## Data Flow

Expected date-input flow:

1. User opens a tracker form that includes a date field.
2. The date field presents a clear calendar-oriented interaction aligned with the current UI system.
3. The chosen date still maps to the same stable date-only format already standardized in feature `011`.

Expected dashboard-help flow:

1. User opens the dashboard and sees a lighter primary layout by default.
2. User can still access help from a clear trigger near the top-level dashboard context.
3. The help surface opens in a mobile-friendly dialog or equivalent lightweight surface.
4. Closing help returns the user to the same dashboard context without extra clutter.

Expected contribution-detail flow:

1. User opens contribution detail from the dashboard.
2. The detail surface loads with the current month already in or near view.
3. User does not need to scroll manually from a distant default position just to reach the current period.

## Implementation Steps

1. Review feature `011` outputs and identify which parts of the current date-field interaction still fall short of the requested calendar behavior.
2. Review the current dashboard composition and identify which text-heavy or secondary surfaces most directly hurt clarity.
3. Confirm whether removing `Quick Summary` is the best narrow change for dashboard focus within this enhancement.
4. Refine the dashboard year-filter presentation for simpler year emphasis and better mobile layout.
5. Update the help entry point and help-surface placement so documentation stays available without occupying dashboard space by default.
6. Implement the narrowest safe improvement for contribution-detail month targeting.
7. Verify that the updated date-input behavior still preserves the stable local-date path from feature `011`.
8. Run focused checks and update workflow notes with decisions, risks, and follow-up items.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/012-dashboard-simplification-and-calendar-usability-refinement.issue.md`
- `ai/prompts/012-dashboard-simplification-and-calendar-usability-refinement.prompt.md`
- `ai/plans/012-dashboard-simplification-and-calendar-usability-refinement.plan.md`
- `ai/tasks/012-dashboard-simplification-and-calendar-usability-refinement.tasks.md`
- `ai/logs/012-dashboard-simplification-and-calendar-usability-refinement.log.md`
- `ai/reviews/012-dashboard-simplification-and-calendar-usability-refinement.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/components/ui/date-field.tsx`
- `frontend/app/components/ui/select-field.tsx`
- `frontend/app/components/ui/dialog.tsx`
- tracker-module route files that consume the shared date field
- `frontend/app/lib/form-defaults.ts` only if the interaction refinement needs date-helper support changes

Potential backend files only if a narrow support change becomes necessary:

- `backend/internal/handlers/dashboard.go`
- focused tests around dashboard or contribution detail behavior

## Risks And Edge Cases

- A more explicit calendar interaction can improve clarity but may also add interaction complexity if the date field becomes heavier than the current flow.
- Removing `Quick Summary` may improve focus, but it should not leave an important gap in the dashboard hierarchy.
- Mobile improvements to the year filter and help surface must avoid creating cramped controls or hidden actions.
- Auto-targeting the current month in contribution detail may need careful handling around different screen sizes or scroll timing.
- Text reduction can help clarity, but over-trimming may hide context users still need.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If the desired calendar behavior can be achieved by refining existing shared UI components, prefer that path over adding a new dependency.

## Testing Plan

Frontend:

- verify the in-scope date fields feel clearer and still behave correctly on desktop and mobile
- verify the simplified year filter remains usable on small screens
- verify the help trigger is discoverable and the help surface is responsive
- verify the dashboard still feels coherent after removing or reducing secondary surfaces
- verify contribution detail lands near the current month without disorienting jumps
- run frontend type checks or tests when available

Backend:

- only run backend checks if implementation requires a backend support change
- add or update focused tests if backend behavior changes

Manual verification:

- compare the post-change dashboard density against the current layout to confirm the main hierarchy became clearer
- test contribution detail from current-month usage flows
- confirm date selection still stores and displays the same expected local date values established in feature `011`

## Assumptions

- This enhancement is a direct continuation of feature `011`, not a replacement for it.
- The repo should continue using `frontend/app/` as the real frontend structure even though the generic tech-stack document shows `frontend/src/`.
- The user wants a focused follow-up that reduces friction and clutter, not a broad redesign pass.
- The existing local-date correctness work from feature `011` should be treated as a protected baseline while refining interaction details.
