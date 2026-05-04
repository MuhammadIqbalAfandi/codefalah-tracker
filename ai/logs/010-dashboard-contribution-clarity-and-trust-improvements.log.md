# Log: Dashboard Contribution Clarity and Trust Improvements

## Status

Implementation completed for the current feature scope.

## Entries

### 2026-05-04

- Completed discovery and confirmed the main clarity problems after feature `008` came from three sources:
  - the year selector was still static and frontend-limited
  - several dashboard concepts were not explained clearly enough
  - contribution intensity presentation had a real mismatch for `Sholat`
- Updated [frontend/app/routes/dashboard.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/routes/dashboard.tsx) to:
  - replace the static year buttons with a dropdown-based year selector
  - add a `Cara membaca dashboard` explanation surface
  - clarify progress, reference date, streak, and time-scope meaning across the dashboard
  - improve summary badges and labels so they no longer show vague internal wording
  - add clearer module-specific contribution explanations and trust-oriented helper copy
- Added [frontend/app/lib/dashboard-contribution.ts](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/lib/dashboard-contribution.ts) to centralize module-specific contribution rules and intensity semantics.
- Updated [frontend/app/components/contribution-graph.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/components/contribution-graph.tsx) to:
  - support module-aware contribution legends
  - use module-specific score interpretation in titles and accessibility labels
  - remove the misleading generic assumption that all modules share the same intensity scale
- Updated [frontend/app/routes/dashboard-contribution-detail.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/routes/dashboard-contribution-detail.tsx) so detail graphs also inherit the corrected module-aware contribution meaning.
- Updated backend dashboard support in:
  - [backend/internal/db/dashboard_manual.go](/home/iqbal/Documents/Development/experiments/codefalah-tracker/backend/internal/db/dashboard_manual.go)
  - [backend/internal/handlers/dashboard.go](/home/iqbal/Documents/Development/experiments/codefalah-tracker/backend/internal/handlers/dashboard.go)
  - [backend/internal/handlers/dashboard_integration_test.go](/home/iqbal/Documents/Development/experiments/codefalah-tracker/backend/internal/handlers/dashboard_integration_test.go)
- Backend decision and result:
  - Added dynamic `available_years` metadata to dashboard module-contribution responses.
  - This removes the fixed frontend-only year assumption and makes the year selector better aligned with real stored history.
- Real correctness issue fixed:
  - `Sholat` previously could never reach the highest displayed contribution intensity because the generic threshold expected scores above the module's actual maximum.
  - The contribution guide is now module-aware, so `5/5` for Sholat can correctly map to the highest level.
- Verification:
  - Ran `cd frontend && npm run typecheck`
  - Ran `cd backend && go test ./internal/handlers/...`
  - Ran `cd backend && go test ./...`
- Notes:
  - The enhancement preserves the redesigned dashboard direction from feature `008`.
  - The implementation focuses on clarity and trust without introducing a new dashboard model.
