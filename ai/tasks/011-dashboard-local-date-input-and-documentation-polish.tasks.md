# Tasks: Dashboard Local Date, Input Consistency, and Documentation Polish

## Discovery And Date Audit

- [x] Review feature `010` dashboard files and identify in-scope native date and select controls.
- [x] Trace the current date flow across frontend defaults, dashboard summary, contribution, and detail activity behavior.
- [x] Confirm whether the reported Jakarta-time issue is a real correctness bug, and identify whether it comes from frontend formatting, backend parsing, or both.
- [x] Confirm which existing explanation surface from feature `010` should be preserved while changing its interaction pattern.

## Input Consistency Improvement

- [x] Replace in-scope native date inputs with repo-aligned UI components where appropriate.
- [x] Replace in-scope native select inputs with repo-aligned UI components where appropriate.
- [x] Verify the updated controls still feel practical on desktop and mobile.

## Local Date Correctness

- [x] Fix any in-scope `Asia/Jakarta` date mismatch that affects dashboard, contribution, or detail activity behavior.
- [x] Verify the corrected date flow stays consistent across summary, graph, and detail views.
- [x] Add or update focused checks if date-handling logic changes in backend or shared helpers.

## Documentation Interaction Refinement

- [x] Move the dashboard explanation content into a lighter interaction surface such as a dialog or popup if that is the best fit.
- [x] Add or refine a clear helper entry point so the documentation remains easy to open.
- [x] Verify the documentation no longer overloads the main dashboard layout.

## Typography Polish

- [x] Refine the presentation of period labels such as `Hari ini`, `Minggu ini`, and `Bulan ini`.
- [x] Verify the updated label styling improves scanability without becoming too dominant.

## Workflow Updates

- [x] Update the implementation log after each completed task.
- [x] Update the review file with findings, risks, validation notes, and follow-up improvements.
