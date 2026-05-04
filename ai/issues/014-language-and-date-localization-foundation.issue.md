# Issue: Language and Date Localization Foundation

## Background

Feature `013-date-field-width-and-picker-sizing-polish` refined the shared date field so it feels more proportional and visually consistent across tracker forms.

That enhancement improved the presentation of date input, but the latest follow-up request shows a broader language-level gap that is now more noticeable across the application:

- the application still mixes language expectations and date presentation styles
- some date output, especially on the dashboard, still appears in technical or locale-mismatched formats such as `year-month-day`
- the UI does not yet have a clear multi-language foundation
- users cannot currently choose the application language

This enhancement should not be treated as a simple copy edit. It should establish a maintainable foundation for language switching and date localization so that text and date presentation feel natural in the active language.

## Goal

Introduce a maintainable language and date-localization foundation so the application can support `Bahasa Indonesia` and `English`, while ensuring that date formatting follows the active language context.

The enhancement should help users:

- read dates in a format that feels natural for the chosen language
- experience a more consistent language system across the application
- switch between supported languages through a clear application setting

## Scope

This issue includes the following enhancement goals:

- review the current use of user-facing text across the frontend application
- review current date display formatting, especially in high-visibility areas such as the dashboard and tracker history/detail views
- introduce multi-language support for at least `Bahasa Indonesia` and `English`
- ensure displayed dates follow the active language rather than staying locked to a single technical format
- add a user-facing setting or control for choosing the active language
- establish a maintainable approach for text and locale management so future language work does not become scattered
- keep the solution aligned with the existing application structure and avoid unnecessary complexity

This issue is especially relevant to:

- dashboard date presentation
- tracker history and detail views that show formatted dates
- shared formatting helpers under the frontend utility layer
- application-level settings or layout areas where language choice can live

## Out Of Scope

The following items are not part of this issue:

- redesigning unrelated dashboard sections or tracker workflows
- changing backend date correctness logic that already works for local date-only values
- introducing more than the initial two supported languages unless that becomes necessary later
- large backend architecture changes for translation management
- broad copywriting redesign unrelated to language consistency or localization support
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can choose between `Bahasa Indonesia` and `English` from an application setting or language control.

As a user, when the active language is `Bahasa Indonesia`, dates appear in a natural Indonesian format.

As a user, when the active language is `English`, dates appear in a natural English format.

As a user, the dashboard and other high-visibility screens no longer mix one language with a mismatched date format.

As a user, the application feels more ready for multi-language use instead of treating language and date formatting as one-off page fixes.

## Notes

- Use the feature ID `014` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `language-and-date-localization-foundation`.
- This enhancement directly extends feature `013-date-field-width-and-picker-sizing-polish`.
- This enhancement should preserve the date-only behavior and shared date-field improvements introduced by features `011`, `012`, and `013`.
- Keep this issue at the request and behavior level only.
