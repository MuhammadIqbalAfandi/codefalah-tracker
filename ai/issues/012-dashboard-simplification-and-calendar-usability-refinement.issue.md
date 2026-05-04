# Issue: Dashboard Simplification and Calendar Usability Refinement

## Background

Feature `011-dashboard-local-date-input-and-documentation-polish` improved dashboard trust, local date handling, shared input consistency, and documentation placement.

That feature moved the product in the right direction, but the latest enhancement request shows there are still several UX gaps that deserve a separate follow-up instead of being mixed into the previous scope:

- date inputs across the tracker modules still do not yet feel like the intended calendar-driven interaction
- the dashboard year filter still needs a cleaner and more responsive presentation on mobile
- `Quick Summary` is now considered unnecessary noise and makes the dashboard feel heavier than needed
- the contribution detail experience still requires manual scrolling to reach the current month
- the dashboard still feels too text-dense, even after the documentation surface became lighter
- the documentation card should no longer occupy dashboard space and should stay behind a lighter help entry point with mobile-friendly behavior

This enhancement should not replace the dashboard direction from features `008`, `010`, and `011`. It should refine that direction by reducing distraction, clarifying the primary dashboard focus, and making date interaction feel more intentional.

## Goal

Improve the dashboard and tracker form experience so it feels lighter, more focused, and more practical to use every day.

The enhancement should help users:

- use date inputs through a clearer calendar-based interaction across the tracker modules
- browse dashboard contribution years in a cleaner and more mobile-friendly way
- focus on the dashboard's most important information without `Quick Summary` competing for attention
- open contribution detail and land closer to the current month without extra manual scrolling
- access documentation only when needed through a lighter and more responsive help entry point

## Scope

This issue includes the following enhancement goals:

- review the current shared date-input approach introduced in feature `011`
- refine tracker-module date input behavior so it better matches the intended Shadcn-aligned calendar interaction
- simplify the dashboard year filter presentation so it focuses on the year value and behaves better on mobile
- remove the `Quick Summary` card from the dashboard if that is the cleanest way to reduce distraction
- reduce dashboard text density where it currently weakens the page hierarchy
- move any remaining documentation-card presence out of the main dashboard layout
- preserve a clear help trigger near the top of the dashboard
- ensure the help dialog or equivalent surface remains responsive on mobile
- improve the contribution detail opening experience so the current month is easier to reach immediately
- preserve the local-date correctness and documentation improvements already completed in feature `011`

This issue is especially relevant to:

- dashboard summary and dashboard help presentation
- contribution year selection and contribution detail browsing
- tracker-module create and edit flows that use date input fields

## Out Of Scope

The following items are not part of this issue:

- replacing the dashboard product direction established in features `008`, `010`, and `011`
- broad redesign of unrelated tracker pages
- introducing new tracker modules
- changing reminders, notifications, exports, backups, or integrations
- large backend architecture changes unless a narrow support change is required for the contribution-detail month targeting
- broad form-system refactors outside the in-scope date interactions
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can open date inputs in tracker modules through a clearer calendar-driven interaction that feels aligned with the rest of the UI.

As a user, I can use the dashboard year filter on mobile without awkward layout or unnecessary extra labeling.

As a user, I no longer see `Quick Summary` competing with the dashboard's main information.

As a user, the dashboard feels lighter and easier to scan because unnecessary text and non-essential surfaces have been reduced.

As a user, I can still open dashboard help when I need it, but it does not take space in the default main layout.

As a user, when I open contribution detail, the interface brings me closer to the current month instead of forcing manual scrolling from a distant position.

As a user, the final result feels like a focused continuation of feature `011`, not a disconnected redesign.

## Notes

- Use the feature ID `012` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `dashboard-simplification-and-calendar-usability-refinement`.
- This enhancement directly extends feature `011-dashboard-local-date-input-and-documentation-polish`.
- This enhancement also preserves the broader dashboard direction introduced by features `008-dashboard-redesign-and-actionable-insight-experience` and `010-dashboard-contribution-clarity-and-trust-improvements`.
- Keep this issue at the request and behavior level only.
