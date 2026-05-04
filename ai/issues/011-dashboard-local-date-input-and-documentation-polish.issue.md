# Issue: Dashboard Local Date, Input Consistency, and Documentation Polish

## Background

Feature `010-dashboard-contribution-clarity-and-trust-improvements` improved the dashboard's clarity, trust signals, contribution explanations, and year browsing.

That feature made the dashboard easier to understand, but the latest improvement request shows that several important UX and correctness details still need a dedicated follow-up enhancement:

- some dashboard-related inputs still use native browser controls that feel visually inconsistent with the current UI direction
- there is a reported risk that date handling still does not fully follow local Jakarta time, which can make dashboard and activity data look one day behind
- the dashboard explanation content is useful, but its current placement can make the main page feel heavier than necessary
- time-period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini` still need more intentional typography and hierarchy tuning

This enhancement should not restart the dashboard redesign. It should refine the current dashboard direction by improving polish, consistency, and trust in date correctness.

## Goal

Improve the dashboard experience so it feels more polished, more consistent with the current UI system, and more trustworthy in how it reads local dates.

The enhancement should help users:

- interact with date and select inputs that match the existing UI system more closely
- trust that dashboard and contribution dates follow local `Asia/Jakarta` time correctly
- access dashboard explanation content when needed without making the main layout feel crowded
- read time-period labels with clearer and more intentional visual hierarchy

## Scope

This issue includes the following enhancement goals:

- review dashboard-related date and select inputs that still rely on native browser controls
- replace native input patterns with repo-aligned UI components where appropriate
- verify whether local date handling across dashboard-related flows is fully aligned with `Asia/Jakarta`
- treat any UTC-driven date shift or parsing mismatch as a real bug if it affects dashboard, contribution, or detail activity behavior
- move dashboard explanation or documentation content into a lighter interaction pattern such as dialog, popup, or similar surface if that is the best fit
- provide a clear and natural entry point for opening dashboard help without disrupting the main hierarchy
- refine the typography and emphasis of period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini`
- preserve the clarity and trust improvements already introduced in feature `010`

## Out Of Scope

The following items are not part of this issue:

- replacing the dashboard direction established in features `008` and `010`
- broad redesign of unrelated tracker pages or CRUD flows
- introducing new tracker modules
- adding reminders, notifications, exports, backups, or integrations
- large backend architecture changes unrelated to date correctness or dashboard support
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can interact with date and selection controls that feel consistent with the rest of the product UI.

As a user in Jakarta time, I can trust that today's dashboard and contribution data reflect the correct local date.

As a user, if I open the app after local midnight, the dashboard no longer feels stuck on the previous day because of UTC handling.

As a user, I can open dashboard explanation content from a clear helper entry point when I need it, without that content taking over the main layout by default.

As a user, period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini` feel easier to scan and more visually intentional.

As a user, the dashboard feels like a more polished continuation of the trust and clarity work from feature `010`.

## Notes

- Use the feature ID `011` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `dashboard-local-date-input-and-documentation-polish`.
- This enhancement directly extends feature `010-dashboard-contribution-clarity-and-trust-improvements` and continues the dashboard refinement direction introduced by feature `008-dashboard-redesign-and-actionable-insight-experience`.
- Prioritize date correctness if the investigation confirms a real timezone bug.
- This issue should stay at the request and behavior level only.
