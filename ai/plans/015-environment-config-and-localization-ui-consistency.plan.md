# Plan: Environment Config And Localization UI Consistency

## Summary

Extend feature `014-language-and-date-localization-foundation` with a focused maintainability and UI-consistency pass.

This enhancement has two tightly scoped tracks:

- standardize important backend and frontend runtime configuration behind a clearer `.env`-based convention
- polish the remaining high-visibility localization UI inconsistencies that were intentionally left outside the first foundation pass

The goal is not to redesign the app or replace the localization architecture. The goal is to make configuration easier to maintain and to finish the most visible localization polish gaps without broadening the feature unnecessarily.

## Scope

Included in this enhancement:

- audit the current backend runtime settings and identify which values should be sourced from environment variables
- audit the current frontend runtime settings and identify which values should be sourced from environment variables
- choose the narrowest maintainable backend approach for reading `.env`-backed config while staying aligned with the Go stack
- establish a clear convention for environment values used by the separated backend and frontend apps
- preserve the active-language and locale-aware date behavior already introduced by `014`
- align language/theme control sizing if the current header controls feel visually uneven
- localize the remaining high-visibility labels called out in the improvement note
- normalize back-button placement patterns in the scoped routes where the current layout feels inconsistent

Not included in this enhancement:

- broad frontend redesign or navigation overhaul
- a full audit of every route for localization parity
- backend persistence for user language preferences
- unrelated configuration refactors beyond the values that matter for app runtime clarity
- secret-management infrastructure outside the current project scope

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Backend responsibilities:

- identify current runtime config touchpoints
- centralize important configuration reads behind a small config layer or startup convention
- keep the solution simple and readable
- only introduce a helper library if the native approach is clearly awkward for the current scope

Frontend responsibilities:

- identify current environment-dependent values
- align environment access with the framework's expected frontend pattern
- preserve the current localization provider and dictionary structure from `014`
- fix the scoped UI consistency issues in layout and relevant routes

## Data Flow

Expected backend config flow:

1. The backend starts from `backend/`.
2. Runtime configuration is resolved from environment variables through a clear config-loading path.
3. Handlers and services consume normalized config values instead of scattered direct lookups or hardcoded defaults where avoidable.

Expected frontend config flow:

1. The frontend build or runtime reads allowed environment values from the frontend app boundary.
2. Shared frontend helpers or routes consume those values through a clear access pattern.
3. Environment-dependent behavior remains easy to trace and update.

Expected localization polish flow:

1. The app resolves the active language through the existing localization foundation from `014`.
2. Shared controls and scoped routes read localized labels from the same language source.
3. Back-navigation labels and placement remain consistent with the active language and surrounding layout pattern.

## Implementation Steps

1. Review feature `014` outputs and confirm which localization behaviors must remain unchanged.
2. Audit backend configuration usage and list the runtime values that should move behind environment-based configuration.
3. Audit frontend configuration usage and list the runtime values that should move behind environment-based configuration.
4. Decide the narrowest maintainable backend config-loading approach, including whether an additional helper is justified.
5. Introduce or document the backend configuration pattern in a way that stays simple for the current Go architecture.
6. Introduce or document the frontend environment configuration pattern in a way that matches the existing `frontend/app/` structure.
7. Inspect the shared localization and theme control area, then align sizing and interaction presentation where needed.
8. Apply the scoped localization follow-up to remaining high-visibility labels and inconsistent back-navigation placement.
9. Run focused checks and update workflow notes with findings, risks, and follow-up items.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/015-environment-config-and-localization-ui-consistency.issue.md`
- `ai/prompts/015-environment-config-and-localization-ui-consistency.prompt.md`
- `ai/plans/015-environment-config-and-localization-ui-consistency.plan.md`
- `ai/tasks/015-environment-config-and-localization-ui-consistency.tasks.md`
- `ai/logs/015-environment-config-and-localization-ui-consistency.log.md`
- `ai/reviews/015-environment-config-and-localization-ui-consistency.review.md`

Likely implementation files in a future coding phase:

- backend startup and config-related files under `backend/`
- environment example or documentation files if the repo does not already expose the required values clearly
- `frontend/app/lib/localization.tsx`
- `frontend/app/lib/locale-config.ts`
- `frontend/app/lib/form-defaults.ts`
- shared layout files that render language and theme controls
- scoped module or detail routes with remaining mixed-language labels or inconsistent back-button placement

## Risks And Edge Cases

- Backend `.env` support can become heavier than necessary if the config approach is overengineered for a small app.
- Frontend and backend environment handling have different constraints, so the conventions should be similar in intent without forcing identical mechanics.
- Moving config to environment variables can accidentally hide required defaults if documentation is incomplete.
- Localization polish can turn into broad copy cleanup if the route scope is not kept explicit.
- Back-button placement changes may affect mobile rhythm or existing spacing assumptions, so visual verification will matter.

## Dependency Proposal

No new dependency is required by default.

For backend environment loading:

- prefer a small in-repo approach or the simplest existing pattern first
- only introduce a helper such as a config loader library if the audit shows it clearly improves maintainability without adding unnecessary complexity

For frontend configuration:

- prefer the framework-native environment pattern already compatible with the current React Router setup

Any new dependency should be justified in the implementation pass before adoption.

## Testing Plan

Backend:

- verify the backend can resolve required configuration values through the new environment-based pattern
- run backend tests if backend code changes are introduced

Frontend:

- verify the frontend still resolves required runtime configuration correctly
- verify language and theme controls remain practical and visually balanced on desktop and mobile
- verify the scoped labels follow the active language
- verify back-navigation placement is consistent in the selected routes
- run frontend type checks or tests when available

Manual verification:

- compare the header control area before and after the scoped UI polish
- switch between `Bahasa Indonesia` and `English` and confirm the targeted labels update correctly
- inspect any environment-related setup notes to ensure backend and frontend configuration expectations are clear

## Assumptions

- This enhancement is a direct continuation of feature `014`, not a replacement of its localization foundation.
- The next available major feature ID is `015`, and it should be treated as a new enhancement scope rather than folded back into `014`.
- The user wants both config cleanup and localization UI consistency captured in one workflow pack, but the implementation should stay tightly scoped and avoid turning into a broad platform refactor.
- The repo should continue using `frontend/app/` as the real frontend structure even though the generic tech-stack document shows `frontend/src/`.
