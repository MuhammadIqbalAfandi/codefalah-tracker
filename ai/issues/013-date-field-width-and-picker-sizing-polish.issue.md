# Issue: Date Field Width and Picker Sizing Polish

## Background

Feature `012-dashboard-simplification-and-calendar-usability-refinement` introduced a stronger calendar-based date input experience and simplified the broader dashboard flow.

That enhancement improved the interaction model, but the latest follow-up request shows there are still visual consistency gaps that now stand out more clearly after the shared date field became more prominent:

- date fields and standard text/number inputs still do not always feel visually aligned in the same form
- the shared date field can appear different in height or proportion compared with neighboring inputs
- the date picker surface can open at a size that feels too large or too dominant in some module layouts
- one clearly reported example is the `Sholat` module, but the concern should be checked across all relevant tracker forms

This enhancement should not revisit the calendar interaction direction from feature `012`. It should polish that direction so the field sizing and opened picker dimensions feel more consistent, more proportional, and more comfortable to use.

## Goal

Improve the visual consistency of the shared date field so it feels aligned with other form inputs and so the opened date picker feels appropriately sized within module layouts.

The enhancement should help users:

- see date fields that match the surrounding form rhythm more closely
- use a date picker that feels balanced within the form instead of oversized
- move between modules without feeling that the date field has a different visual language from other inputs

## Scope

This issue includes the following enhancement goals:

- review the current shared `DateField` presentation introduced in feature `012`
- compare the shared date field against standard form inputs used in the tracker modules
- align the date field's height, padding, and overall proportion more closely with neighboring inputs where needed
- review the opened date picker dimensions across in-scope modules
- reduce date picker width or visual dominance where it currently feels too large
- verify that the refined date picker still remains readable and usable on desktop and mobile
- preserve the calendar interaction and local-date behavior already introduced by features `011` and `012`

This issue is especially relevant to:

- the shared date field component under the frontend UI layer
- tracker-module create and edit forms that use the shared date input
- module layouts where the opened date picker currently feels oversized, including the reported `Sholat` example

## Out Of Scope

The following items are not part of this issue:

- changing the local-date correctness logic from feature `011`
- replacing the calendar-based interaction introduced in feature `012`
- redesigning unrelated dashboard sections or other module layouts
- introducing new tracker modules
- broad form-system refactors outside the shared date field and its direct usage context
- backend architecture changes
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can open tracker forms and see that the date field feels visually aligned with the other fields around it.

As a user, the date field no longer looks noticeably taller, wider, or heavier than standard inputs unless there is a deliberate reason.

As a user, when I open the date picker, it feels proportionate to the form and does not dominate the surrounding layout.

As a user, the date picker still remains easy to read and use even after its size is refined.

As a user, the final result feels like a polish pass on feature `012`, not a new input system or a different date workflow.

## Notes

- Use the feature ID `013` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `date-field-width-and-picker-sizing-polish`.
- This enhancement directly extends feature `012-dashboard-simplification-and-calendar-usability-refinement`.
- This enhancement also preserves the local-date and calendar interaction baseline introduced by features `011-dashboard-local-date-input-and-documentation-polish` and `012-dashboard-simplification-and-calendar-usability-refinement`.
- Keep this issue at the request and behavior level only.
