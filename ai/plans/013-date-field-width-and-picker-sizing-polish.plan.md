# Plan: Date Field Width and Picker Sizing Polish

## Summary

Refine the post-`012` shared date field so it feels better balanced inside tracker forms and so its opened picker surface no longer feels oversized.

This enhancement builds directly on feature `012-dashboard-simplification-and-calendar-usability-refinement`. It does not replace the current shared date-input approach. Instead, it narrows the work to sizing, proportion, and layout polish around the shared date field and its opened calendar surface.

## Scope

Included in this enhancement:

- review the current shared `DateField` implementation from feature `012`
- compare the shared date field against neighboring standard form inputs in the tracker modules
- adjust field sizing, padding, or surrounding layout treatment where the date field currently feels inconsistent
- reduce excessive picker width or visual dominance where the opened calendar surface feels too large
- verify the refined picker remains clear, readable, and usable on desktop and mobile
- keep the refinement incremental and scoped to date-field visual polish

Not included in this enhancement:

- new local-date logic
- a replacement for the calendar interaction introduced in feature `012`
- unrelated dashboard simplification work
- broad form-system redesign beyond the shared date field and its direct usage context
- backend changes unless an unexpected layout dependency appears, which is unlikely

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- inspect the shared `DateField` sizing and its opened picker layout
- compare it against existing text, number, and select inputs already used in the tracker forms
- refine the date field and, if needed, its usage context so it better matches surrounding field rhythm
- preserve the existing date-only value contract and helper behavior from features `011` and `012`

Backend responsibilities:

- none by default for this enhancement

## Data Flow

Expected field-sizing flow:

1. User opens a tracker form with a shared date field and standard inputs.
2. The date field visually aligns with the surrounding fields in height and proportion.
3. The underlying form value behavior remains unchanged from the existing date-only flow.

Expected picker-sizing flow:

1. User opens the date picker from a shared date field.
2. The calendar surface appears at a size that feels proportional to the form container.
3. User can still read and select dates comfortably without the picker feeling cramped or oversized.

## Implementation Steps

1. Review feature `012` outputs and confirm which date-field behavior must be preserved.
2. Inspect the shared `DateField` sizing and compare it against neighboring standard fields in the in-scope modules.
3. Identify where the picker surface currently feels visually oversized, including the reported `Sholat` case.
4. Refine the shared date field sizing so it aligns more closely with surrounding inputs.
5. Refine the opened picker dimensions and layout so it feels more proportional inside the form.
6. Verify the refined result across the in-scope modules on both desktop and mobile layouts.
7. Run focused checks and update workflow notes with findings, risks, and follow-up items.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/013-date-field-width-and-picker-sizing-polish.issue.md`
- `ai/prompts/013-date-field-width-and-picker-sizing-polish.prompt.md`
- `ai/plans/013-date-field-width-and-picker-sizing-polish.plan.md`
- `ai/tasks/013-date-field-width-and-picker-sizing-polish.tasks.md`
- `ai/logs/013-date-field-width-and-picker-sizing-polish.log.md`
- `ai/reviews/013-date-field-width-and-picker-sizing-polish.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/components/ui/date-field.tsx`
- tracker-module routes under `frontend/app/routes/` that use the shared date field
- `frontend/app/components/ui/select-field.tsx` only if side-by-side field alignment needs a shared adjustment pattern

Potential backend files:

- none expected

## Risks And Edge Cases

- Reducing picker size too aggressively could hurt readability or make touch interaction less comfortable on mobile.
- Aligning the date field too closely with standard inputs could hide useful date-specific affordances if the layout becomes too plain.
- Some module forms may have slightly different grid widths, so a sizing fix that looks good in one module could still need adjustment in another.
- Visual consistency work can drift into broader form redesign unless the scope stays tightly anchored to the shared date field.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

## Testing Plan

Frontend:

- verify the shared date field feels aligned with neighboring inputs across the in-scope modules
- verify the opened picker surface no longer feels oversized
- verify the refined field and picker still feel practical on mobile
- run frontend type checks or tests when available

Backend:

- no backend checks are expected unless implementation unexpectedly touches backend files

Manual verification:

- compare the shared date field against surrounding inputs in the tracker forms
- verify the reported `Sholat` case after the sizing adjustment
- confirm the picker remains easy to read and use after width or padding changes

## Assumptions

- This enhancement is a direct continuation of feature `012`, not a new date-input redesign.
- The repo should continue using `frontend/app/` as the real frontend structure even though the generic tech-stack document shows `frontend/src/`.
- The user wants a focused visual polish pass centered on size consistency and picker proportions.
- The local-date behavior delivered in features `011` and `012` should be treated as a protected baseline.
