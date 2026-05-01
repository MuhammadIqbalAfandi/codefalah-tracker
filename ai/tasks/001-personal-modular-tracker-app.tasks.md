# Tasks: Personal Modular Tracker App

## Foundation

- [x] Create separated `backend/` and `frontend/` directories.
- [x] Initialize the Go backend module inside `backend/`.
- [x] Add backend dependencies for chi and validator.
- [x] Create backend folder structure for `cmd`, `internal`, `pkg`, `migrations`, and `sql`.
- [x] Create the backend app entry point.
- [x] Create basic config loading for the backend.
- [x] Create structured logger setup with slog.
- [x] Create the chi router with a health endpoint.
- [x] Initialize the React Router v7 frontend app inside `frontend/`.
- [x] Create frontend folder structure for routes, components, features, hooks, lib, services, and styles.
- [x] Add Tailwind CSS and Shadcn UI setup according to the frontend scaffold.

## Database

- [x] Create initial database migration for MVP tracker tables.
- [x] Create table for sholat records.
- [x] Create table for puasa records.
- [x] Create table for finance transactions.
- [x] Create table for sport records.
- [x] Create table for journal entries.
- [x] Create sqlc configuration.
- [x] Create sqlc queries for sholat records.
- [x] Create sqlc queries for puasa records.
- [x] Create sqlc queries for finance transactions.
- [x] Create sqlc queries for sport records.
- [x] Create sqlc queries for journal entries.
- [x] Generate sqlc code.

## Backend API

- [x] Create shared JSON response and error helpers.
- [x] Create database connection setup.
- [x] Create validation helper for request payloads.
- [x] Create Sholat Tracker API endpoints.
- [x] Create Puasa Tracker API endpoints.
- [x] Create Keuangan Tracker API endpoints.
- [x] Create Olahraga Tracker API endpoints.
- [x] Create Jurnal Harian API endpoints.
- [x] Create dashboard summary API endpoint.
- [x] Create contribution graph API endpoint.
- [x] Add route registration for all MVP API endpoints.

## Frontend Shell

- [x] Create shared frontend API client.
- [x] Create module navigation config.
- [x] Create main app layout.
- [x] Create dashboard route.
- [x] Create reusable empty state component.
- [x] Create reusable summary card component.
- [x] Create reusable contribution graph component.

## Frontend Modules

- [x] Create Sholat Tracker route and page.
- [x] Add Sholat Tracker checklist input.
- [x] Add Sholat Tracker history view.
- [x] Create Puasa Tracker route and page.
- [x] Add Puasa Tracker input form.
- [x] Add Puasa Tracker history view.
- [x] Create Keuangan Tracker route and page.
- [x] Add Keuangan Tracker transaction form.
- [x] Add Keuangan Tracker history view.
- [x] Create Olahraga Tracker route and page.
- [x] Add Olahraga Tracker input form.
- [x] Add Olahraga Tracker history view.
- [x] Create Jurnal Harian route and page.
- [x] Add Jurnal Harian entry form.
- [x] Add Jurnal Harian timeline/history view.

## Dashboard And Summaries

- [x] Connect dashboard route to dashboard summary API.
- [x] Show today's MVP module progress on the dashboard.
- [x] Show monthly finance summary on the dashboard.
- [x] Show recent journal status on the dashboard.
- [x] Connect contribution graph UI to backend contribution graph API.
- [x] Add simple module-level summary sections where useful.

## Verification And Workflow Updates

- [x] Verify backend health endpoint.
- [x] Verify MVP tracker API endpoints manually or with tests.
- [x] Verify dashboard summary updates from stored records.
- [x] Verify frontend navigation across dashboard and MVP modules.
- [x] Verify frontend create/list flows for each MVP module.
- [x] Verify empty states and invalid input behavior.
- [x] Update the implementation log after each completed task.
- [x] Update the review file with bugs, risks, validation notes, and follow-up improvements.
