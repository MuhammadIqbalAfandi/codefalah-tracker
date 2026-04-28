# Tasks: Personal Modular Tracker App

## Rules

- Work on one task at a time.
- Start from the next unchecked task unless the user specifies a task.
- Do not implement future tasks early.
- Do not change unrelated files.
- After each completed task, update this file and the log file.

## Preparation

- [x] Inspect the current repository structure and identify existing backend/frontend conventions.
- [x] Confirm the implementation entry points and package setup for backend and frontend.

## Backend Foundation

- [x] Create or align the backend folder structure with the tech stack.
- [x] Add backend application entry point.
- [x] Add chi router setup.
- [x] Add slog logger setup.
- [x] Add configuration loading.
- [x] Add PostgreSQL database connection setup.
- [x] Add a health endpoint.
- [x] Add shared request validation and error response patterns.

## Database Foundation

- [x] Add initial migration setup.
- [x] Create migration for Sholat Tracker records.
- [x] Create migration for Puasa Tracker records.
- [x] Create migration for Keuangan Tracker records.
- [x] Create migration for Olahraga Tracker records.
- [x] Create migration for Jurnal Harian records.
- [x] Add sqlc configuration if missing.
- [x] Add sqlc queries for Sholat Tracker.
- [x] Add sqlc queries for Puasa Tracker.
- [x] Add sqlc queries for Keuangan Tracker.
- [x] Add sqlc queries for Olahraga Tracker.
- [x] Add sqlc queries for Jurnal Harian.
- [x] Add sqlc queries for dashboard summary and contribution graph data.
- [x] Run migration and sqlc generation checks.

## Backend MVP Modules

- [x] Implement Sholat Tracker service and handlers.
- [x] Implement Puasa Tracker service and handlers.
- [x] Implement Keuangan Tracker service and handlers.
- [x] Implement Olahraga Tracker service and handlers.
- [x] Implement Jurnal Harian service and handlers.
- [x] Implement dashboard summary service and handler.
- [x] Implement contribution graph service and handler.
- [ ] Register all MVP API routes.

## Frontend Foundation

- [ ] Create or align the frontend folder structure with the tech stack.
- [ ] Add main layout with modular navigation.
- [ ] Add dashboard route.
- [ ] Add API client service layer.
- [ ] Add shared loading, empty, and error state UI patterns.
- [ ] Add reusable summary card component.
- [ ] Add reusable contribution graph component.

## Frontend MVP Modules

- [ ] Implement Sholat Tracker route and checklist UI.
- [ ] Implement Sholat Tracker history view.
- [ ] Implement Puasa Tracker route and form UI.
- [ ] Implement Puasa Tracker history view.
- [ ] Implement Keuangan Tracker route and transaction form UI.
- [ ] Implement Keuangan Tracker summary and history view.
- [ ] Implement Olahraga Tracker route and form UI.
- [ ] Implement Olahraga Tracker schedule or history view.
- [ ] Implement Jurnal Harian route and journal form UI.
- [ ] Implement Jurnal Harian private timeline view.
- [ ] Connect dashboard summary cards to backend data.
- [ ] Connect contribution graph UI to backend data.

## Validation and UX

- [ ] Add backend validation for all MVP tracker create and update inputs.
- [ ] Add frontend validation where forms need structured validation.
- [ ] Add user-facing error messages.
- [ ] Add empty states for all MVP modules.
- [ ] Add basic success feedback after create, update, and delete actions.
- [ ] Check responsive behavior for dashboard and module pages.

## Verification

- [ ] Run backend formatting and available checks.
- [ ] Run frontend formatting and available checks.
- [ ] Verify migrations apply successfully.
- [ ] Verify dashboard works with empty data.
- [ ] Verify all MVP tracker create flows.
- [ ] Verify all MVP tracker update flows.
- [ ] Verify all MVP tracker delete flows where supported.
- [ ] Verify dashboard summary updates after tracker changes.
- [ ] Verify contribution graph empty and populated states.

## Workflow Completion

- [ ] Update the log with final implementation summary.
- [ ] Update the review file with bugs, risks, improvements, and follow-up ideas.
