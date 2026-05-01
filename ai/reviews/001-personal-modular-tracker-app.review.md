# Review: Personal Modular Tracker App

## Status

Review completed on 2026-05-01 for the implemented MVP foundation.

## Review Checklist

- [x] Check for bugs after implementation.
- [x] Check security concerns after implementation.
- [x] Check input validation after implementation.
- [x] Check backend API behavior after implementation.
- [x] Check frontend user flows after implementation.
- [x] Check dashboard summary accuracy after implementation.
- [ ] Check contribution graph accuracy after implementation.
- [x] Check empty states and error states after implementation.
- [x] Check consistency with `/ai/context/tech-stack.md`.
- [x] Check that unrelated files were not changed.

## Critical Issues

### 1. Module history and timeline views are still hardcoded, so saved records do not appear back in the UI

- Related files:
  - `frontend/app/routes/sholat.tsx:20-24`
  - `frontend/app/routes/puasa.tsx:18-22`
  - `frontend/app/routes/keuangan.tsx:18-22`
  - `frontend/app/routes/olahraga.tsx:18-22`
  - `frontend/app/routes/jurnal.tsx:18-31`
- Why this matters:
  - The issue, prompt, and tasks say users should be able to record data and view history.
  - The module pages still render static arrays instead of loading backend records.
  - A successful save shows a confirmation message, but the page does not reflect the saved item, so the create/list flow is incomplete from the user’s perspective.
- Actionable fix:
  - Replace the hardcoded arrays with loader-based or client fetch-based reads from the existing list endpoints.
  - Refresh the list after a successful save so the newly created record is visible immediately.

### 2. Private tracker APIs are exposed cross-origin with no authentication boundary

- Related file:
  - `backend/internal/handlers/router.go:77-89`
- Why this matters:
  - The feature is described as a private personal tracker.
  - The backend currently allows `Access-Control-Allow-Origin: *` for all API routes and there is no authentication or authorization layer.
  - Any site running in the user’s browser can call these endpoints if the backend is reachable, which is a privacy risk for personal worship, finance, health, and journal data.
- Actionable fix:
  - Restrict CORS to known frontend origins.
  - Add an authentication boundary before treating this app as private in anything beyond local development.
  - If auth is intentionally deferred, document the backend as local-only and disable permissive cross-origin access by default.

### 3. Date defaults use UTC day strings, which can save records under the wrong date for local users

- Related files:
  - `frontend/app/lib/form-defaults.ts:1-2`
  - `frontend/app/routes/dashboard.tsx:67-68`
- Why this matters:
  - `new Date().toISOString().slice(0, 10)` produces a UTC date, not the user’s local calendar date.
  - In `Asia/Jakarta`, at `2026-05-02 00:30` local time, this helper still returns `2026-05-01`.
  - That can prefill forms with the previous day and create records under the wrong date, which is especially bad for daily trackers like sholat and puasa.
- Actionable fix:
  - Build date input defaults from local time instead of UTC ISO strings.
  - Use the same local-date helper for dashboard fallbacks so the empty-state date does not drift from the user’s local day.

## Improvements

### 1. Validation failures are too generic for users and make debugging harder

- Related area:
  - `backend/internal/handlers/sholat.go:123-133` via `decodeAndValidate`
  - same helper path is reused by the other tracker handlers
- Current behavior:
  - Most validation failures return only `request validation failed` without field-specific detail.
- Risk:
  - Users do not know which field failed.
  - Frontend save messages cannot guide correction beyond a generic error banner.
- Actionable improvement:
  - Return structured field-level validation errors or at least a clearer single-message reason per failure case.

### 2. The five module routes duplicate the same save-state and submit-flow logic

- Related files:
  - `frontend/app/routes/sholat.tsx`
  - `frontend/app/routes/puasa.tsx`
  - `frontend/app/routes/keuangan.tsx`
  - `frontend/app/routes/olahraga.tsx`
  - `frontend/app/routes/jurnal.tsx`
- Current behavior:
  - Each module repeats `useState` save feedback, `FormData` extraction, API submission, success reset behavior, and error mapping.
- Risk:
  - Small fixes, like the recent duplicate-save and date-default fixes, have to be copied across multiple files.
  - The route files accumulate both form UI and submission logic, which makes later changes slower and easier to drift.
- Actionable improvement:
  - Extract a small shared form-submit helper or route-local hook per pattern.
  - Keep module-specific field mapping separate, but centralize shared reset/error handling.

### 3. Contribution graph behavior still lacks database-backed verification

- Related files:
  - `backend/internal/handlers/dashboard_integration_test.go:23-127`
  - `backend/internal/handlers/router_test.go:75-95`
- Current behavior:
  - Dashboard summary aggregation is covered by an embedded-Postgres integration test.
  - Contribution graph validation only covers bad query params, not the actual aggregated scores and ranges.
- Risk:
  - The graph endpoint can silently drift from expected scoring without a failing test.
- Actionable improvement:
  - Add a database-backed contribution graph integration test that seeds sholat, puasa, sport, and journal records and asserts date ordering plus score totals.

### 4. Backend startup is tightly coupled to an available PostgreSQL instance

- Related file:
  - `backend/pkg/config/config.go:17-24`
- Current behavior:
  - The application expects a working `DATABASE_URL` and the logs note startup fails when PostgreSQL is not reachable.
- Risk:
  - This is fine for a real app runtime, but it increases friction for review, local UI work, and partial frontend testing.
- Actionable improvement:
  - Keep the production behavior, but add clearer local setup docs or a development bootstrap path so frontend work is not blocked by opaque backend startup failures.

## Optional Suggestions

### 1. Unify naming between frontend routes and backend resources

- Related areas:
  - frontend routes use Indonesian module names such as `keuangan`, `olahraga`, and `jurnal`
  - backend resources use English names such as `finance-transactions` and `journal-entries`
- Suggestion:
  - Pick one naming strategy for module/resource labels in docs and implementation notes so future features are easier to scan and reason about.

### 2. Prefer React Router data APIs for module read/write flows as the app grows

- Related area:
  - current module forms submit through local event handlers and direct `fetch`
- Suggestion:
  - For larger future workflows, loaders/actions would better match the chosen frontend stack and make post-save refresh behavior more straightforward.

### 3. Review the default local database credential fallback

- Related file:
  - `backend/pkg/config/config.go:20`
- Suggestion:
  - The default `postgres://admin:secret@localhost:5432/codefalah_tracker?sslmode=disable` is acceptable for local experimentation, but it is worth documenting clearly as development-only so it does not leak into broader environments by habit.

## Missing Tests

- No automated frontend tests cover save flows, error rendering, or history refresh behavior for module pages.
- No backend integration test covers contribution graph aggregation accuracy.
- No live end-to-end verification confirms that module pages render newly created records after saving, because those pages are still backed by static placeholder arrays.

## Maintainability Notes

- The backend handler layer is consistent and readable overall.
- The frontend shell and dashboard composition are reasonably modular.
- The main maintainability pressure point is the repeated per-module submit logic combined with placeholder history rendering.
- The review did not find unrelated code churn outside the feature scope described in the workflow files.

## Summary

The backend foundation and dashboard aggregation are in decent shape for an MVP foundation, and the recent save-error fixes improved the basic UX. The two biggest gaps are still user-facing: module pages do not actually show saved backend records, and the app’s “private” positioning does not match the current open cross-origin API posture. After those are addressed, the next most valuable work is local-date correctness and contribution-graph test coverage.
