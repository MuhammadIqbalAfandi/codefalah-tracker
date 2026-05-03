# Issue: Contribution Scroll Discoverability and Snap Improvement

## Background

Feature `004-dashboard-revamp-and-module-contribution-views` established module contribution views and contribution detail pages as a central part of the dashboard experience.

Later enhancements improved density and responsive containment, but one UX problem still remains in the horizontally scrollable contribution presentation. The current design allows horizontal browsing, yet the scroll behavior is not obvious enough. Users may fail to notice that more months exist to the right, or they may assume that only the first visible months are available.

The enhancement request is to make horizontal exploration much clearer through stronger visual guidance and a more polished scrolling behavior. This should help users understand that additional months exist and make the interaction feel more intentional and premium.

This issue extends the contribution-view experience introduced by feature `004`. It should preserve the same contribution meaning, routing flow, and module coverage while improving the clarity and feel of horizontal browsing.

## Goal

Improve the contribution scrolling UX so users can clearly understand that more months are available and experience a cleaner month-by-month browsing interaction.

## Scope

This issue includes:

- improving visual discoverability for horizontally scrollable contribution views
- adding a stronger hint that more months exist to the right
- considering multiple visual signals such as a right-side fade, a small arrow cue, and stronger guidance text
- adding snap behavior so scrolling feels aligned per month card or per contribution section
- applying the improvement consistently wherever the shared contribution graph is used, especially dashboard cards and contribution detail pages
- preserving the current contribution data meaning and graph structure while refining the interaction design

## Out of Scope

This issue does not include:

- changing contribution scoring rules
- redesigning the dashboard information hierarchy beyond the scroll UX refinement
- redesigning the contribution detail page purpose or activity-list behavior
- adding new modules, filters, zoom controls, or date-range selection
- changing backend contribution endpoints unless a real frontend blocker unexpectedly depends on API shape
- introducing new frontend libraries unless first proposed in the plan

## Expected Behavior

As a user, I can immediately notice that the contribution view can be scrolled horizontally.

As a user, I can see a stronger visual cue that more months are available beyond the initial visible area.

As a user, I can scroll horizontally and feel the movement settle neatly per month card or per section instead of stopping awkwardly.

As a user, the contribution view feels clearer, more polished, and less ambiguous without changing the underlying contribution data meaning.

## Notes

- Use the new feature ID `007` because this is a major enhancement that extends feature `004`.
- Use the feature name `contribution-scroll-discoverability-and-snap-improvement`.
- This issue should stay focused on scroll discoverability and snap interaction for contribution views.
- Keep this issue at the request and behavior level only; implementation detail belongs in the plan and tasks.
