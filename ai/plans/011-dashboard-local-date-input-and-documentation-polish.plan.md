# Plan: Dashboard Local Date, Input Consistency, and Documentation Polish

## Summary

Refine the dashboard and adjacent contribution experience so it feels more polished, more visually consistent, and more trustworthy in local date handling.

This enhancement builds directly on feature `010-dashboard-contribution-clarity-and-trust-improvements`. It does not replace the dashboard direction from features `008` and `010`. Instead, it focuses on follow-up polish and correctness gaps that became clearer after the dashboard gained stronger guidance and contribution semantics.

## Scope

Included in this enhancement:

- auditing dashboard-related date and select inputs that still use native browser controls
- aligning those controls with the existing Shadcn UI direction where appropriate
- tracing the local-date flow across frontend defaults, dashboard summary, contribution data, and contribution detail behavior
- fixing any real `Asia/Jakarta` date mismatch caused by UTC assumptions or parsing inconsistencies
- moving dashboard documentation into a lighter interaction surface if that improves layout clarity
- preserving a clear helper entry point for opening documentation
- refining the visual treatment of time-period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini`
- keeping all work incremental and scoped to dashboard polish, consistency, and correctness

Not included in this enhancement:

- a fresh dashboard redesign
- unrelated form-system refactors outside the affected dashboard and contribution flows
- new tracker modules
- auth, reminders, notifications, exports, backups, or integrations
- new dependencies unless a real limitation appears and is proposed first

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- identify where dashboard-related inputs still use native browser controls
- replace those with repo-aligned UI components only where the interaction becomes more consistent and still remains practical on desktop and mobile
- review how the dashboard explanation surface is currently rendered and move it to a lighter interaction model if appropriate
- refine typography and hierarchy for time-period labels without disturbing the broader dashboard structure
- verify local-date utilities and route-level data handling for Jakarta-time correctness

Backend responsibilities:

- review whether current dashboard handlers or related date parsing logic contribute to any reported local-date mismatch
- adjust backend date handling only if the real bug cannot be resolved safely from the frontend layer alone
- keep backend changes narrowly targeted to correctness and existing dashboard support

## Data Flow

Expected local-date validation flow:

1. User opens the dashboard or a dashboard-related detail flow in local Jakarta time.
2. Frontend derives default dates and requests dashboard or contribution data.
3. Backend reads or aggregates data for the intended local date range.
4. Frontend renders summary, contribution, and detail views that all point to the same user-expected day.
5. If any step shifts the day because of UTC conversion or ambiguous parsing, that mismatch is identified and fixed.

Expected documentation flow:

1. User sees the dashboard without a heavy always-open documentation block.
2. User can open help or explanation content from a clear entry point near the relevant dashboard area.
3. The explanation appears in a lighter surface such as a dialog, popup, or similar component.
4. User can close the explanation and continue using the dashboard without losing context.

Expected input consistency flow:

1. User interacts with date or select controls in dashboard-related flows.
2. The controls feel visually aligned with the rest of the UI system.
3. The updated controls remain usable on both desktop and mobile.

## Implementation Steps

1. Review the current feature `010` implementation and identify which dashboard-related inputs still rely on native browser controls.
2. Trace date handling across frontend helpers, route loaders, dashboard views, and relevant backend handlers to locate any UTC or parsing mismatch.
3. Confirm whether the reported date issue is a real correctness bug and identify the narrowest safe fix location.
4. Replace in-scope native date and select controls with repo-aligned UI components where that improves consistency without harming usability.
5. Refactor the dashboard explanation surface into a lighter interaction pattern with a clear, non-disruptive entry point.
6. Refine period-label typography and emphasis so labels remain clear but not overly dominant.
7. Verify that dashboard summary, contribution, and detail flows all reflect the correct local Jakarta date.
8. Run focused checks and update workflow notes with findings, risks, and any follow-up items.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/011-dashboard-local-date-input-and-documentation-polish.issue.md`
- `ai/prompts/011-dashboard-local-date-input-and-documentation-polish.prompt.md`
- `ai/plans/011-dashboard-local-date-input-and-documentation-polish.plan.md`
- `ai/tasks/011-dashboard-local-date-input-and-documentation-polish.tasks.md`
- `ai/logs/011-dashboard-local-date-input-and-documentation-polish.log.md`
- `ai/reviews/011-dashboard-local-date-input-and-documentation-polish.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/routes/dashboard-contribution-detail.tsx`
- `frontend/app/lib/form-defaults.ts`
- one or more shared form or UI components under `frontend/app/components/`
- other dashboard-related helpers only if currently involved in date derivation or documentation rendering

Potential backend files if date correctness requires backend changes:

- `backend/internal/handlers/dashboard.go`
- other dashboard-related handler or date-support files directly involved in local-date aggregation
- focused dashboard or handler tests if backend behavior changes

## Risks And Edge Cases

- Replacing native date controls may improve consistency but can also introduce extra interaction complexity if the replacement is not chosen carefully.
- A timezone bug may come from a combination of frontend formatting and backend parsing rather than a single obvious line of code.
- Some date issues may appear only around local midnight or month boundaries, so narrow daytime spot checks may miss the real bug.
- Moving documentation into a dialog can reduce layout weight, but the entry point must stay discoverable or users may lose access to helpful guidance.
- Typography improvements can overshoot if period labels become too decorative or too visually dominant relative to the main metrics.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a current Shadcn-aligned component already exists in the repo, prefer reusing it before creating a new variant.

## Testing Plan

Backend:

- verify any dashboard-related date changes still align with current request and response expectations
- add or update focused tests if backend date parsing or aggregation behavior changes

Frontend:

- verify updated date and select controls remain usable on desktop and mobile
- verify the documentation trigger is easy to find and the lighter surface closes cleanly
- verify period labels feel cleaner without breaking hierarchy
- run frontend type checks or tests when available

Manual verification:

- verify behavior around local Jakarta date boundaries, especially after midnight
- compare known activity records against dashboard summary, contribution graph, and detail activity dates
- confirm the documentation surface is accessible but no longer crowds the main page
- confirm the updated controls feel consistent with the current UI system

## Assumptions

- This enhancement extends the current dashboard implementation from feature `010`, not an earlier pre-clarity version.
- The repo should continue using `frontend/app/` as the real frontend structure.
- The reported date mismatch is important enough to treat as a correctness investigation first, even if the final fix turns out to be small.
- The user wants a focused dashboard refinement, not a broad UI-system overhaul across the whole app.
