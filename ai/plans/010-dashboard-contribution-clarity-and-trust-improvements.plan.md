# Plan: Dashboard Contribution Clarity and Trust Improvements

## Summary

Refine the dashboard introduced in feature `008` so its values, contribution meaning, and guidance signals are easier for users to understand and trust.

This enhancement builds directly on feature `008-dashboard-redesign-and-actionable-insight-experience`. It does not aim to redesign the dashboard again from scratch. Instead, it focuses on the clarity gaps that became more visible after the dashboard gained richer insight surfaces and year-based browsing.

## Scope

Included in this enhancement:

- reviewing which parts of the current dashboard still feel confusing or under-explained
- improving the year-browsing control for contribution history so it remains practical as more years become available
- adding a dashboard explanation or help surface for key terms and behaviors
- clarifying the meaning of progress, reference date, streak, and contribution intensity
- reviewing whether Sholat contribution intensity and similar module-level scoring feel understandable to users
- adjusting frontend explanation, interaction, or backend support only where needed to resolve real confusion or correctness issues
- verifying whether suspicious dashboard values are explanation problems, scoring-rule problems, or real data mismatches
- focused validation for clarity, trust, and consistency between stored data and dashboard presentation

Not included in this enhancement:

- replacing the dashboard direction created in feature `008`
- broad redesign of unrelated module flows
- new tracker modules
- authentication, reminders, notifications, exports, backups, or integrations
- major dependency additions outside the approved stack
- a broad analytics expansion beyond the current dashboard role

## Architecture

Use the existing separated application layout:

- `backend/` for the Go API service
- `frontend/` for the React Router application

Follow the repo's real frontend convention:

- route and UI work should align with `frontend/app/`

Frontend responsibilities:

- review the current dashboard route and contribution graph presentation from feature `008`
- improve year-browsing interaction and explanation surfaces around contribution
- clarify labels, descriptions, and guidance for dashboard concepts that remain ambiguous
- keep UI logic close to the route layer and existing components when possible

Backend responsibilities:

- review whether current dashboard summary and module contribution responses already support the needed clarity improvements
- adjust dashboard-related backend support only if the current API shape or scoring data creates a real clarity or correctness blocker
- keep any backend changes narrowly targeted to dashboard meaning or validation needs

## Data Flow

Expected dashboard clarity flow:

1. User opens the dashboard route.
2. Frontend loads dashboard summary and contribution data from the current dashboard endpoints.
3. Frontend presents contribution history, summary values, and explanation surfaces in a way that makes meaning and confidence clearer.
4. If a user questions a dashboard value or contribution level, the interface should help explain the rule or make the data source easier to understand.
5. If a real mismatch exists between stored records and dashboard presentation, the implementation should identify and correct it within scope.

Expected year-browsing flow:

1. User opens the dashboard contribution section.
2. User selects a year through a scalable control such as a dropdown.
3. Frontend updates the displayed contribution range for that year.
4. The contribution section remains easy to scan and understand.

## Implementation Steps

1. Review the current dashboard route, contribution graph component, and dashboard handler data that influence user understanding after feature `008`.
2. Identify which confusing parts are caused by wording, which by interaction design, which by scoring interpretation, and which may indicate real data mismatches.
3. Confirm how the current year selector behaves and determine the most suitable scalable replacement pattern.
4. Refactor the year-selection interaction into a clearer long-term control such as a dropdown if appropriate.
5. Add a dashboard explanation surface that clarifies progress, reference date, streak, and contribution intensity.
6. Review contribution intensity meaning, especially for Sholat, and confirm whether the displayed levels align with the intended product logic.
7. Adjust frontend explanation, contribution labeling, or backend support only where the current implementation blocks clarity or correctness.
8. Verify that the dashboard feels more understandable and trustworthy after the changes.
9. Update workflow logs and review notes with findings, validation results, and follow-up risks.

## Files Likely To Be Created Or Changed

Workflow files:

- `ai/issues/010-dashboard-contribution-clarity-and-trust-improvements.issue.md`
- `ai/prompts/010-dashboard-contribution-clarity-and-trust-improvements.prompt.md`
- `ai/plans/010-dashboard-contribution-clarity-and-trust-improvements.plan.md`
- `ai/tasks/010-dashboard-contribution-clarity-and-trust-improvements.tasks.md`
- `ai/logs/010-dashboard-contribution-clarity-and-trust-improvements.log.md`
- `ai/reviews/010-dashboard-contribution-clarity-and-trust-improvements.review.md`

Likely implementation files in a future coding phase:

- `frontend/app/routes/dashboard.tsx`
- `frontend/app/components/contribution-graph.tsx`
- `frontend/app/components/main-layout.tsx`
- one or more dashboard-focused help or explanation components under `frontend/app/components/`

Potential backend files if data or scoring support must be clarified:

- `backend/internal/handlers/dashboard.go`
- `backend/internal/handlers/dashboard_integration_test.go`
- related dashboard SQL or query files only if current response fields are insufficient

## Risks And Edge Cases

- It may be tempting to solve clarity issues by adding too much explanation UI, which could make the dashboard heavier instead of clearer.
- Some confusion may come from product-scoring expectations rather than actual technical bugs, especially for Sholat contribution intensity.
- A frontend-only explanation fix may be insufficient if the real issue is a backend scoring or aggregation rule.
- A dropdown year selector can improve scalability, but it must still feel simple inside the current contribution section.
- Explanation content that is too generic or too long may still fail to help users in practice.
- Fixing a real dashboard-value mismatch may reveal follow-up assumptions in contribution rules or summary logic across modules.

## Dependency Proposal

No new dependency is required by default for this enhancement.

Prefer the existing stack and repo patterns:

- Go standard library, chi, slog, validator, `database/sql`, sqlc, PostgreSQL, golang-migrate
- React Router v7, Tailwind CSS, Shadcn UI

If a later implementation step reveals a real limitation, propose it before adding anything new.

## Testing Plan

Backend:

- verify any dashboard-related response changes remain aligned with current frontend usage
- verify contribution scoring or aggregation behavior if backend dashboard logic changes
- add or update focused dashboard tests only if backend behavior changes

Frontend:

- verify the explanation surface improves understanding without making the dashboard feel overloaded
- verify the year-browsing control remains usable as the number of available years grows
- verify contribution intensity labels and supporting explanations are easy to interpret
- verify Sholat contribution presentation feels understandable relative to stored records
- run frontend type checks or tests when available

Manual verification:

- compare known records against displayed dashboard contribution and summary values
- confirm the user can understand what progress, streak, and reference date mean within a few seconds
- confirm suspicious-looking values are either clearly explained or identified as actual bugs
- confirm the dashboard still feels like the same product direction established by feature `008`

## Assumptions

- This enhancement extends the redesigned dashboard from feature `008`, not an earlier pre-redesign version of the dashboard.
- The current `frontend/app/` structure should continue to be used.
- Some concerns in the improvement request may turn out to be communication problems, while others may be real scoring or mapping bugs.
- The first implementation pass should prioritize user understanding and trust before adding more dashboard complexity.
