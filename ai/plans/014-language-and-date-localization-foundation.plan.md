# Plan: Language and Date Localization Foundation

## Summary

Establish a maintainable localization foundation so the application can support `Bahasa Indonesia` and `English`, while making date display follow the active language context.

This enhancement builds directly on feature `013-date-field-width-and-picker-sizing-polish`. It does not replace the current date-only behavior or shared field foundation. Instead, it extends the presentation layer so language and locale can be managed consistently across the app.

## Scope

Included in this enhancement:

- review current user-facing text and date display usage across the frontend
- introduce a manageable language system for at least `Bahasa Indonesia` and `English`
- add a user-facing language-selection control or setting
- localize date presentation so displayed dates follow the active language
- apply the initial localization pass to the highest-visibility routes and shared helpers
- keep the implementation incremental and maintainable

Not included in this enhancement:

- support for many languages beyond the initial two-language scope
- backend-driven translation management unless a clear need appears
- unrelated dashboard or form redesign
- replacing working date-only correctness logic
- broad copywriting overhaul beyond what is needed for localization structure

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- identify how dates and user-facing text are currently formatted and rendered
- introduce or integrate a maintainable localization mechanism
- centralize locale-aware date formatting instead of formatting dates ad hoc per route
- add a language-selection control in an appropriate application-level UI location
- apply the initial two-language support to high-visibility screens and shared helpers

Backend responsibilities:

- remain unchanged by default
- only participate if a future persistence requirement for language preference clearly needs backend support

## Data Flow

Expected language-selection flow:

1. User opens the application.
2. The app resolves the current language from the active UI setting or stored preference.
3. User-facing text and date formatting use that language context.
4. If the user changes the language, the UI updates consistently without requiring per-page manual handling.

Expected date-localization flow:

1. A route or component requests a formatted display date from a shared helper or localization layer.
2. The helper receives the current language or locale context.
3. The displayed date is formatted naturally for the active language while preserving the underlying date-only data value.

## Implementation Steps

1. Review feature `013` outputs and confirm which date-field and date-only behaviors must be preserved.
2. Audit the current app for high-visibility text and date formatting paths that should participate in the first localization pass.
3. Choose the narrowest maintainable localization approach, including whether an i18n library is justified.
4. Introduce the core language state or locale mechanism for `Bahasa Indonesia` and `English`.
5. Centralize locale-aware date formatting through shared helpers or localization utilities.
6. Add a language-selection control in an application-level location that is discoverable but not disruptive.
7. Apply the first localization pass to key routes and date-heavy surfaces.
8. Run focused checks and update workflow notes with findings, risks, and follow-up items.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/014-language-and-date-localization-foundation.issue.md`
- `ai/prompts/014-language-and-date-localization-foundation.prompt.md`
- `ai/plans/014-language-and-date-localization-foundation.plan.md`
- `ai/tasks/014-language-and-date-localization-foundation.tasks.md`
- `ai/logs/014-language-and-date-localization-foundation.log.md`
- `ai/reviews/014-language-and-date-localization-foundation.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/lib/form-defaults.ts`
- one or more new localization or settings helpers under `frontend/app/lib/` or `frontend/app/components/`
- `frontend/app/routes/dashboard.tsx`
- tracker-module routes that display formatted dates
- layout-related files that can host a language selector

Potential backend files only if preference persistence later needs support:

- none expected in the first pass

## Risks And Edge Cases

- Localization can spread quickly if text handling is not centralized early.
- Introducing an i18n library can help consistency, but it can also be too heavy if the initial scope stays very small.
- Date localization must affect display format only and should not accidentally alter stored date-only values.
- A language selector that is easy to find must still fit the current layout without creating new clutter.
- Partial localization can feel inconsistent if the first-pass scope is too narrow, so the initial target surfaces should be chosen carefully.

## Dependency Proposal

No new dependency is required by default, but an i18n library may be proposed if it materially improves maintainability and consistency for the two-language foundation.

Prefer the existing stack and repo patterns first:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a library is proposed, document why it is better than a lightweight in-repo approach for the current scope.

## Testing Plan

Frontend:

- verify language switching updates text and date presentation consistently
- verify Indonesian and English date formats render naturally in the in-scope screens
- verify the language selector remains practical on desktop and mobile
- run frontend type checks or tests when available

Backend:

- no backend checks are expected unless implementation unexpectedly touches backend files

Manual verification:

- compare dashboard and tracker date displays in both supported languages
- verify the selected language affects the expected text and date surfaces
- confirm underlying date-only behavior remains unchanged after localization work

## Assumptions

- This enhancement is a direct continuation of feature `013`, but it expands scope from visual date-field polish into application-level language and locale behavior.
- The repo should continue using `frontend/app/` as the real frontend structure even though the generic tech-stack document shows `frontend/src/`.
- The user wants a maintainable first-pass localization foundation, not a temporary one-off translation patch.
- Existing date-only correctness from features `011`, `012`, and `013` should be treated as a protected baseline.
