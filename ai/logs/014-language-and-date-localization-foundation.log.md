# Log: Language and Date Localization Foundation

## Status

Implemented and verified for the scoped frontend localization foundation.

## Entries

### 2026-05-04

- Created the feature workflow for enhancement `014-language-and-date-localization-foundation`.
- Confirmed this enhancement is a direct follow-up to feature `013-date-field-width-and-picker-sizing-polish`.
- Captured the planned focus areas:
  - two-language support for `Bahasa Indonesia` and `English`
  - locale-aware date formatting
  - a user-facing language-selection control
  - a maintainable localization foundation for future language work
- Confirmed the enhancement should preserve the date-only and shared input behavior from features `011`, `012`, and `013`.
- No application code was modified in this workflow-creation step.

### 2026-05-04 Implementation Run

- Added a lightweight localization foundation in `frontend/app/lib/locale-config.ts` and `frontend/app/lib/localization.tsx`.
- Wrapped the app with `LocalizationProvider` and persisted language choice through `codefalah-language`.
- Added a compact language selector in the shared `MainLayout` header for desktop and mobile access.
- Localized shared UI primitives including navigation labels, theme toggle text, select placeholder fallback, delete confirmation labels, and date-field picker copy.
- Centralized locale-aware display formatting for date-only, month-year, and currency presentation in `frontend/app/lib/form-defaults.ts`.
- Applied the first-pass localization scope to the dashboard, contribution graph, dashboard contribution detail, and high-traffic module routes:
  - dashboard and contribution overview surfaces
  - sholat main route
  - puasa main route
  - keuangan main route
  - olahraga main route
  - jurnal main route
- Preserved existing date-only storage semantics from features `011`, `012`, and `013` while changing display-layer formatting to follow the active language.
- Verified the implemented scope with `cd frontend && npm run typecheck`.
- Backend checks were intentionally skipped because `014` only changed frontend files.

## Notes

- Keep the implementation tightly scoped to language foundation and date localization.
- Preserve existing date-only correctness while changing display-layer formatting behavior.
- Browser-based visual QA has not been run yet, so language-switch polish should still be checked directly in the UI on desktop and mobile.
