# Issue: Dashboard Contribution Horizontal Density Improvement

## Background

Feature `004-dashboard-revamp-and-module-contribution-views` already made contribution views the primary dashboard experience and added module contribution detail pages.

That feature improved information structure, but the current contribution graph presentation is still too tall and too wide per month block. As a result, users need to scroll downward through many month sections inside a single contribution card, which makes the graph feel heavier than necessary and reduces quick comparison across modules.

The new enhancement request is to make the contribution boxes smaller and reshape the contribution card so one card can show around three months at once in a horizontal strip, while the remaining months can be explored by scrolling to the right instead of stacking everything downward.

This issue is a major enhancement to feature `004`, not a replacement for its core behavior. The goal is to keep the same contribution meaning and navigation flow, while improving density, scanability, and horizontal browsing.

## Goal

Improve the contribution graph presentation so module contribution cards become more compact, easier to scan, and more efficient to browse within the existing dashboard and contribution detail experience.

## Scope

This issue includes:

- refining the contribution graph layout from feature `004`
- making contribution cells smaller so more days can fit comfortably in one visible area
- adjusting each contribution card so it can display roughly three months in one visible horizontal window
- enabling horizontal scrolling for the remaining months instead of forcing a long vertical stack
- keeping the graph readable while preserving one day per cell and real calendar month lengths
- applying the improvement consistently to dashboard contribution cards and module contribution detail pages if both reuse the same graph component
- reviewing supporting labels, spacing, and overflow behavior so the new denser layout still feels understandable

## Out of Scope

This issue does not include:

- changing contribution scoring rules introduced or used by feature `004`
- redesigning module detail pages beyond the graph layout adjustment that supports this enhancement
- changing backend contribution endpoints unless a small API adjustment is proven necessary
- adding filters, zoom controls, drag-to-pan behavior, or custom date range selection
- redesigning unrelated dashboard cards, module CRUD pages, sidebar behavior, or theme behavior
- introducing new frontend libraries for scrolling or charting unless first proposed in the plan

## Expected Behavior

As a user, I can see a denser contribution graph without overly large boxes.

As a user, I can view about three months of contribution data inside one card before needing to scroll.

As a user, I can move horizontally to inspect the remaining months instead of scrolling far downward through many stacked month blocks.

As a user, I still understand month boundaries, day density, and active versus inactive contribution cells clearly.

As a user, the same contribution graph behavior feels consistent between the dashboard and the module contribution detail page.

## Notes

- Use the new feature ID `005` because this is a major enhancement that extends feature `004`.
- Use the feature name `dashboard-contribution-horizontal-density-improvement`.
- This issue should stay focused on the contribution graph layout and browsing behavior only.
- Keep this issue at the request and behavior level; implementation detail belongs in the plan and tasks.
