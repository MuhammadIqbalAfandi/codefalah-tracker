# Plan: Interactive Record Management and Theme Support

## Summary

Enhance the existing Personal Modular Tracker App MVP so users can manage saved records more completely and use the app comfortably with a dark theme.

This work extends feature `001-personal-modular-tracker-app` by replacing placeholder history views with real backend-backed data, adding detail/edit/delete flows for the existing MVP modules, and adding persistent theme selection in the frontend.

## Scope

Included in this enhancement:

- Real backend-backed history views for Sholat, Puasa, Keuangan, Olahraga, and Jurnal
- Dedicated detail routes or detail page flows for saved records
- Edit support for the existing MVP record types
- Delete support with confirmation for the existing MVP record types
- UI refresh behavior after create, update, and delete actions
- Application-wide light and dark theme support
- Theme preference persistence for repeat visits
- Focused verification for record lifecycle and theme behavior

Not included in this enhancement:

- New tracker modules
- Authentication or multi-user support
- Export, backup, or synchronization features
- Trash bin or undo-delete functionality
- Major dashboard redesign unrelated to this workflow
- New backend architecture beyond the approved stack

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Backend responsibilities:

- Reuse the existing chi router and handler structure
- Reuse sqlc-backed `database/sql` queries for list, get, update, and delete operations
- Add any missing detail/update/delete handler behavior for MVP modules
- Keep input validation in the handler layer through validator
- Return clear JSON responses for read, edit, and delete flows

Frontend responsibilities:

- Reuse the existing React Router application structure under `frontend/`
- Prefer React Router loaders for history/detail reads and actions or structured API client calls for mutations
- Keep module route logic inside route files and shared UI logic in reusable frontend helpers/components
- Use the existing Tailwind CSS and Shadcn UI setup for theme-aware styling
- Keep dark theme state global only to the extent necessary for app-wide theme persistence

## Data Flow

Typical history and detail flow:

1. User opens a module page.
2. Frontend loads the module history from the backend list endpoint.
3. User selects one history item.
4. Frontend navigates to a dedicated detail route or detail view.
5. Frontend loads the full record details from the backend by id.
6. Frontend renders the stored record fields and available actions.

Typical edit flow:

1. User opens a record detail or edit page.
2. Frontend populates the form with stored record data.
3. User updates allowed fields and submits.
4. Frontend sends the update request to the backend.
5. Backend validates and stores the changes.
6. Frontend refreshes the affected detail, history, and relevant summary state.

Typical delete flow:

1. User chooses delete from a detail or history context.
2. Frontend shows a confirmation step before continuing.
3. Frontend sends the delete request to the backend after confirmation.
4. Backend removes the record and returns success.
5. Frontend removes the record from visible history and refreshes related summaries where needed.

Typical theme flow:

1. User toggles between light and dark theme.
2. Frontend applies the theme at the application shell level.
3. Frontend saves the chosen preference in local persistent storage.
4. The next app load restores the saved theme preference before or during initial render.

## Implementation Steps

1. Review the current MVP routes, handlers, and review findings from feature `001`.
2. Identify which module pages still use placeholder history data and which backend capabilities already exist.
3. Add any missing backend handlers or query support needed for record detail, update, and delete flows.
4. Add shared frontend helpers for loading record history and handling mutation feedback where reuse is worthwhile.
5. Replace placeholder history data in Sholat and Puasa with real backend-backed views.
6. Replace placeholder history data in Keuangan, Olahraga, and Jurnal with real backend-backed views.
7. Add dedicated detail routes or detail views for each supported MVP module.
8. Add edit forms or edit flows for each supported MVP module.
9. Add delete actions with confirmation for each supported MVP module.
10. Update dashboard or module summary refresh behavior only where record changes affect visible totals or recent activity.
11. Add app-wide theme toggle behavior and persistent theme preference.
12. Verify record lifecycle flows, theme behavior, and regression-sensitive areas noted in the prior review.
13. Update workflow logs after each completed task and keep review notes current.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/prompts/002-interactive-record-management-and-theme-support.prompt.md`
- `ai/plans/002-interactive-record-management-and-theme-support.plan.md`
- `ai/tasks/002-interactive-record-management-and-theme-support.tasks.md`
- `ai/logs/002-interactive-record-management-and-theme-support.log.md`
- `ai/reviews/002-interactive-record-management-and-theme-support.review.md`

Backend files:

- `backend/internal/handlers/router.go`
- `backend/internal/handlers/`
- `backend/internal/db/`
- `backend/sql/`

Frontend files:

- `frontend/app/routes/`
- `frontend/app/components/`
- `frontend/app/features/`
- `frontend/app/lib/`
- `frontend/app/services/`
- `frontend/app/root.tsx`
- `frontend/app/app.css`

## Risks And Edge Cases

- The existing frontend scaffold uses `frontend/app/` rather than the `frontend/src/` example structure from the tech stack document, so implementation should follow the current project scaffold without forcing a restructure.
- Some backend CRUD capabilities may already exist, so the enhancement should avoid duplicating endpoints unnecessarily.
- Record updates may affect dashboard summaries, recent activity lists, and contribution graph output in ways that need explicit refresh behavior.
- Delete flows can create confusing UX if confirmation, redirect, or empty-state handling is inconsistent across modules.
- Theme persistence can cause flicker or mismatch on first render if the theme is applied too late in the app lifecycle.
- Date-sensitive modules such as Sholat and Puasa need local-date-safe defaults and refresh behavior.
- Repeated form submission logic across five modules may create drift unless shared behavior is factored carefully.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the libraries and tools already in use:

- Go standard library, chi, validator, slog, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Shadcn UI, Tailwind CSS

Only propose a new package later if implementation reveals a concrete need that cannot be handled cleanly with the current stack.

## Testing Plan

Backend:

- Verify list, get-by-id, update, and delete behavior for each supported MVP module
- Verify validation and not-found responses for detail/edit/delete flows
- Verify dashboard and related summaries remain accurate after record changes
- Verify contribution graph behavior is not regressed by record updates or deletes
- Run Go tests where coverage exists and add focused tests where needed

Frontend:

- Verify each module loads real history from backend data
- Verify detail views show the correct selected record
- Verify edit flows update visible history/detail content
- Verify delete confirmation prevents accidental removal and removes records after confirmation
- Verify empty states render correctly after deletion or when no data exists
- Verify theme toggle changes the visual shell across routes
- Verify saved theme preference is restored on reload
- Run frontend type checks or tests when available

Manual verification:

- Create a sample record in each supported module and confirm it appears in history
- Open detail pages for each supported module and confirm fields are correct
- Edit a sample record and confirm history/detail/summary updates
- Delete a sample record and confirm it no longer appears in history
- Toggle theme, reload the app, and confirm the preference persists

## Assumptions

- Feature `001` remains the baseline implementation that this enhancement builds on.
- Existing module list endpoints and route structure can be reused rather than replaced wholesale.
- The enhancement remains single-user and local/private in practice unless a later feature introduces authentication.
- Theme preference can be stored client-side without needing backend persistence.
