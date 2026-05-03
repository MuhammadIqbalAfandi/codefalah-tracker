# Issue: Contribution Detail Responsive Layout Fix

## Background

Feature `004-dashboard-revamp-and-module-contribution-views` introduced module contribution detail pages so users can open a focused contribution view for each module and keep the graph visible above the related activity list.

That feature established the structure and data flow successfully, but the contribution detail page still has a usability problem on smaller viewports. The current layout can extend too far to the right, which causes the page content to overflow horizontally and makes the detail experience feel broken on responsive screens.

This enhancement is intended to refine the contribution detail experience that came from feature `004`. It should preserve the same contribution meaning, module routing, and detail-page purpose while fixing the layout so the page stays usable within narrower widths.

## Goal

Improve the contribution detail page so it remains responsive and readable without unwanted horizontal overflow.

## Scope

This issue includes:

- reviewing the current contribution detail page layout introduced by feature `004`
- identifying which part of the detail page causes the content to extend to the right
- refining the contribution detail layout so the page fits within responsive widths
- ensuring the top contribution graph and lower activity list remain usable on smaller screens
- adjusting overflow behavior only as needed so horizontal scrolling does not break the whole page layout
- keeping the page consistent with the existing dashboard and contribution-detail structure

## Out of Scope

This issue does not include:

- redefining contribution scoring or graph meaning
- redesigning the dashboard overview page beyond any minimal supporting adjustment required by the detail page
- changing backend contribution endpoints unless a real responsive blocker unexpectedly depends on API shape
- adding new modules, filters, or date-range controls
- redesigning unrelated CRUD pages, sidebar behavior, or theme behavior
- introducing new frontend libraries unless first proposed in the plan

## Expected Behavior

As a user, I can open a contribution detail page on smaller screens without the whole page content stretching to the right.

As a user, I can still see the contribution graph at the top and the related activity list below it in a layout that feels contained and readable.

As a user, any horizontal overflow that remains is limited to the part of the UI that truly needs it, rather than making the full page feel broken.

As a user, the contribution detail page remains consistent with the feature `004` experience while becoming more usable on responsive layouts.

## Notes

- Use the new feature ID `006` because this is a major enhancement that extends feature `004`.
- Use the feature name `contribution-detail-responsive-layout-fix`.
- This issue should stay focused on responsive layout behavior in the contribution detail page.
- Keep this issue at the request and behavior level only; implementation detail belongs in the plan and tasks.
