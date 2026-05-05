# Log: Environment Config And Localization UI Consistency

## Status

Implemented and verified for the scoped config and localization follow-up.

## Entries

### 2026-05-05

- Created the feature workflow for enhancement `015-environment-config-and-localization-ui-consistency`.
- Confirmed this enhancement is a direct follow-up to feature `014-language-and-date-localization-foundation`.
- Captured the planned focus areas:
  - backend environment-configuration standardization
  - frontend environment-configuration standardization
  - localization UI consistency follow-up for high-visibility controls and labels
  - targeted back-navigation layout alignment
- Confirmed the enhancement should preserve the localization baseline already introduced by feature `014`.
- Kept the workflow aligned with the separated `backend/` and `frontend/` structure from `/ai/context/tech-stack.md`.
- No application code was modified in this workflow-creation step.

### 2026-05-05 Implementation Run

- Added a lightweight backend `.env` loader in `backend/pkg/config/dotenv.go` so local configuration can be read without introducing a new Go dependency.
- Centralized backend runtime configuration in `backend/pkg/config/config.go`, including `CORS_ALLOWED_ORIGINS`, and passed normalized origins into the router from `backend/cmd/app/main.go`.
- Simplified CORS setup in `backend/internal/handlers/router.go` so allowed origins come from the loaded config instead of ad hoc environment reads inside the handler layer.
- Added `backend/.env.example` for local backend setup guidance.
- Added `frontend/app/lib/env.ts` to centralize frontend environment reads and moved `VITE_API_BASE_URL` and `VITE_APP_TIME_ZONE` behind that helper.
- Updated `frontend/app/lib/form-defaults.ts` and `frontend/app/services/api-client.ts` to use the shared frontend env helper.
- Added `frontend/.env.example` and updated `frontend/README.md` so the new frontend and backend env expectations are visible to maintainers.
- Balanced the shared header controls by giving the theme toggle the same width rhythm as the language selector in `frontend/app/components/main-layout.tsx` and `frontend/app/components/theme-toggle.tsx`.
- Extended the localization dictionary with shared back-navigation labels in `frontend/app/lib/localization.tsx`.
- Applied the localization follow-up to the scoped detail and navigation surfaces:
  - `frontend/app/routes/sholat-detail.tsx`
  - `frontend/app/routes/puasa-detail.tsx`
  - `frontend/app/routes/keuangan-detail.tsx`
  - `frontend/app/routes/olahraga-detail.tsx`
  - `frontend/app/routes/jurnal-detail.tsx`
  - `frontend/app/routes/dashboard-contribution-detail.tsx`
- Localized remaining high-visibility back-navigation text, summary labels, status text, and success or error feedback in the scoped detail routes.
- Preserved the existing `014` localization foundation and date-only display behavior while extending more screens to follow the active language.
- Verified the implementation with:
  - `cd backend && go test ./...`
  - `cd frontend && npm run typecheck`

## Notes

- Keep the implementation tightly scoped to environment configuration and localization UI consistency.
- Preserve the active-language behavior and locale-aware display behavior already established by `014`.
- If backend `.env` loading needs an additional helper, justify it in the implementation pass before adoption.
- Browser-based visual QA has not been run yet, so the control sizing and detail-page layout polish should still be checked directly on desktop and mobile.
