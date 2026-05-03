# Plan: Contribution Scroll Discoverability and Snap Improvement

## Summary

Improve the horizontally scrollable contribution view so users immediately understand that more months are available and the scrolling interaction feels polished. This enhancement builds on feature `004` and later contribution-view refinements by keeping the same data structure and module-specific experience while upgrading the scroll affordance and motion feel.

The work should stay focused on frontend interaction design. The goal is not to redesign the contribution experience, but to make horizontal browsing clearer and more premium.

## Scope

Included in this enhancement:

- reviewing the current horizontally scrollable contribution view
- strengthening visual hints that indicate more content exists to the right
- adding or refining guidance text for horizontal browsing
- adding a subtle but clear directional cue such as a fade or arrow
- adding snapping behavior per month card or per contribution section
- ensuring the scroll UX improvement works in both dashboard cards and contribution detail pages
- verifying the improved interaction remains readable and not visually noisy

Not included in this enhancement:

- backend API redesign
- contribution scoring changes
- new filters, date controls, or zoom interactions
- unrelated dashboard or contribution-detail restructuring
- unrelated sidebar, theme, or CRUD flow changes

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service if any backend support is required
- `frontend/` for the React Router application

Expected implementation center:

- `frontend/app/components/contribution-graph.tsx`

Likely supporting frontend areas:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css`

Backend expectation:

- no backend change by default
- only adjust backend if an unexpected blocker appears, which is unlikely for this UX enhancement

## Data Flow

The data flow should remain unchanged from feature `004`:

1. Dashboard and contribution detail routes load contribution data.
2. The shared graph component receives month-grouped calendar-day content.
3. The graph presents the months in a horizontally scrollable region.
4. The UX enhancement adds clearer affordance and snap behavior without changing the underlying data mapping.

## Implementation Steps

1. Review the current horizontal scroll presentation and identify why the existing hint is too weak.
2. Decide which combination of visual affordances will best signal additional months, with at least one required strong hint.
3. Add the chosen visual hint or hints so the rightward continuation is obvious.
4. Add or refine stronger guidance text so the horizontal interaction is explicitly communicated.
5. Add snap behavior so scrolling settles per month card or per contribution section.
6. Verify the improved interaction still works in the dashboard contribution cards.
7. Verify the same interaction also works in the contribution detail page.
8. Review whether the new cues feel helpful without cluttering the layout.
9. Update workflow logs and review notes with findings, risks, and validation results.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/007-contribution-scroll-discoverability-and-snap-improvement.issue.md`
- `ai/prompts/007-contribution-scroll-discoverability-and-snap-improvement.prompt.md`
- `ai/plans/007-contribution-scroll-discoverability-and-snap-improvement.plan.md`
- `ai/tasks/007-contribution-scroll-discoverability-and-snap-improvement.tasks.md`
- `ai/logs/007-contribution-scroll-discoverability-and-snap-improvement.log.md`
- `ai/reviews/007-contribution-scroll-discoverability-and-snap-improvement.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/app.css`

Potential backend files only if unexpectedly needed:

- none by default

## Risks And Edge Cases

- A stronger visual hint can become too noisy if the fade, arrow, and text compete too much with the graph itself.
- Snap behavior can feel polished on one viewport size but awkward on another if the snap target is not aligned with the visible card width.
- Shared graph changes can unintentionally affect both dashboard and detail contexts, so the design needs to work in both.
- A fade or overlay can accidentally cover interactive or informative content if layered poorly.
- Guidance text can become repetitive or visually heavy if it is not placed carefully.

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

- verify users can clearly tell that more months exist beyond the first visible area
- verify the required visual hint is visible and understandable
- verify scrolling snaps in a neat and consistent way
- verify dashboard cards and contribution detail pages both preserve the improved interaction
- verify the graph remains readable and not visually cluttered after the enhancement
- run frontend type checks or tests when available

Backend:

- no backend verification is required unless implementation unexpectedly touches backend code

Manual verification:

- open dashboard contribution cards and confirm the rightward continuation is obvious at a glance
- open at least one contribution detail page and confirm the same interaction guidance appears there
- scroll the graph and confirm it settles neatly per month card or section

## Assumptions

- This is a follow-up major enhancement to feature `004`, not a new contribution-view concept.
- The current backend data shape is already sufficient for this interaction enhancement.
- The existing shared `ContributionGraph` component remains the correct place for most of the work.
- "Snap per bulan / per card" can be implemented as a frontend scroll behavior without changing the underlying data model.
