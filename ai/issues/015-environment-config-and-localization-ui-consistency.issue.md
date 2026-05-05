# Issue: Environment Config And Localization UI Consistency

## Background

Feature `014-language-and-date-localization-foundation` introduced the first maintainable language and date-localization baseline for the application, including active-language switching and locale-aware date presentation.

That foundation improved the product significantly, but the follow-up improvement request highlights two cleanup areas that now matter more clearly:

- application configuration is still not fully standardized around environment-based setup across backend and frontend
- the first localization release still leaves a few visible UI consistency gaps, especially in shared header controls and navigation text

This enhancement should be treated as a follow-up hardening pass after `014`, not as an unrelated new direction. It continues the same product maturity effort by improving maintainability for configuration and finishing a small but important layer of localization polish.

## Goal

Standardize environment-based configuration handling across the separated Go backend and React Router frontend, while also polishing the remaining in-scope localization UI inconsistencies left after feature `014`.

The enhancement should help the project:

- manage important backend and frontend settings more consistently through `.env`-based patterns
- reduce configuration scattering so future maintenance is clearer and safer
- preserve the existing localization foundation from `014` while fixing remaining high-visibility language and layout inconsistencies

## Scope

This issue includes the following enhancement goals:

- review how backend configuration is currently defined and identify which important settings should move behind a maintainable `.env`-based pattern
- review how frontend configuration is currently defined and identify which important settings should move behind a maintainable `.env`-based pattern
- keep the backend approach aligned with the current Go stack and avoid overcomplicating configuration loading
- document or introduce a simple convention for required environment values across both apps
- polish the visual consistency of the language-switch and theme-switch controls if they currently feel mismatched
- localize remaining high-visibility navigation or action text that still ignores the active language, including back-navigation labels noted in the improvement request
- align back-button placement patterns where the current localization follow-up reveals inconsistent layout rhythm across related pages
- preserve the localization baseline and active-language behavior already established by feature `014`

This issue is especially relevant to:

- backend startup or config-loading paths
- frontend environment access points
- shared layout or header controls
- localized navigation and action labels on detail or module pages

## Out Of Scope

The following items are not part of this issue:

- redesigning unrelated dashboard sections, trackers, or page structure
- introducing account-level preference sync or backend persistence for language settings
- expanding localization to many more routes than needed for the scoped follow-up polish
- changing working date-only correctness logic unless a display-layer issue is directly tied to the scoped localization cleanup
- introducing heavy configuration infrastructure unless the plan shows a clear need
- broad copywriting rewrites unrelated to configuration clarity or localization consistency
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a maintainer, I can manage important backend settings through a clear environment-based configuration pattern instead of scattered hardcoded values.

As a maintainer, I can manage important frontend settings through a clear environment-based configuration pattern that matches the separated app structure.

As a user, the language switch and theme switch look visually balanced in the shared control area.

As a user, important navigation or action labels follow the active language consistently instead of mixing Indonesian and English.

As a user, back-navigation placement feels more consistent with related buttons such as `Back to dashboard` and `Open module`.

As a follow-up to feature `014`, the application keeps the existing localization foundation working while feeling more polished and easier to maintain.

## Notes

- Use the feature ID `015` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `environment-config-and-localization-ui-consistency`.
- This enhancement directly extends feature `014-language-and-date-localization-foundation`.
- The implementation should follow the separated `backend/` and `frontend/` structure and the stack rules from `/ai/context/tech-stack.md`.
- If the backend does not already have a native `.env` loading approach that fits cleanly, evaluate the narrowest maintainable solution in the plan before introducing any helper library.
- Keep this issue at the request and behavior level only.
