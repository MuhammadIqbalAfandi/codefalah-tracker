# Log: Dashboard Simplification and Calendar Usability Refinement

## Status

Implementation completed for the current feature scope.

## Entries

### 2026-05-04

- Created the feature workflow for enhancement `012-dashboard-simplification-and-calendar-usability-refinement`.
- Confirmed this enhancement is a direct follow-up to feature `011-dashboard-local-date-input-and-documentation-polish`.
- Captured the planned focus areas:
  - calendar-oriented refinement of tracker-module date input
  - dashboard simplification and reduced text density
  - cleaner and more responsive dashboard year filter
  - preserved but lighter dashboard help access
  - contribution-detail opening behavior that lands nearer the current month
- Confirmed the enhancement should preserve the dashboard direction from features `008`, `010`, and `011`.
- No application code was modified in this workflow-creation step.

### 2026-05-04

- Completed the implementation pass for feature `012-dashboard-simplification-and-calendar-usability-refinement`.
- Discovery result:
  - confirmed feature `011` date correctness and dialog-based help should remain the baseline
  - confirmed the existing `DateField` still depended on a hidden native date input, so it did not yet deliver the intended calendar-first interaction
  - confirmed the dashboard still felt too dense because `Quick Summary` and the documentation support section duplicated the top-level reading flow
  - confirmed contribution detail month targeting could be handled in the frontend graph layer without a backend change
- Calendar input refinement:
  - replaced the `DateField` hidden-native pattern with an in-component calendar surface that supports month navigation, direct date picking, and a quick `Hari ini` action
  - preserved the same date-only value flow and `Asia/Jakarta` helper messaging from feature `011`
- Dashboard simplification:
  - removed the `Quick Summary` card from the main dashboard layout
  - reduced heavy explanatory copy in the top summary and contribution sections so the page scans faster
  - simplified the contribution year filter into a compact select presentation that focuses on the year value and behaves better on mobile
- Help and contribution-detail changes:
  - kept dashboard help behind the top-level `Show help` trigger instead of leaving extra documentation surfaces in the default layout
  - preserved the responsive dialog pattern from feature `011`
  - added month-targeted auto-scroll support in the contribution graph and used it in contribution detail so the current month is opened in view when available
- Changed files:
  - [frontend/app/components/ui/date-field.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/components/ui/date-field.tsx)
  - [frontend/app/components/ui/select-field.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/components/ui/select-field.tsx)
  - [frontend/app/components/contribution-graph.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/components/contribution-graph.tsx)
  - [frontend/app/routes/dashboard.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/routes/dashboard.tsx)
  - [frontend/app/routes/dashboard-contribution-detail.tsx](/home/iqbal/Documents/Development/experiments/codefalah-tracker/frontend/app/routes/dashboard-contribution-detail.tsx)
- Verification:
  - passed `cd frontend && npm run typecheck`
  - passed `cd backend && go test ./internal/handlers/...`
  - passed `cd backend && go test ./...`

## Notes

- Keep the implementation tightly scoped to dashboard refinement and in-scope date interaction improvements.
- Preserve the local-date correctness baseline established in feature `011`.
- Browser-based visual QA was not run in this pass, so desktop/mobile feel is validated from implementation structure and automated checks, not a recorded interaction session.
