# Tasks: Dashboard Contribution Horizontal Density Improvement

## Discovery And Layout Direction

- [x] Review the current contribution graph component and identify what makes the layout vertically heavy.
- [x] Confirm which current graph labels, legends, and spacing should be preserved in the denser version.
- [x] Confirm how the graph is currently used inside the dashboard route and the contribution detail route.
- [x] Confirm the expected meaning of "about three months visible in one card" for implementation planning.

## Shared Graph Density Update

- [x] Reduce contribution cell size to support a denser layout.
- [x] Reduce grid spacing only as much as needed to keep the graph readable.
- [x] Refactor the graph layout so month sections no longer require a long vertical stack.
- [x] Add horizontal scrolling support for the remaining months.
- [x] Verify one visible graph area can show about three months before horizontal scrolling is needed.

## Dashboard And Detail Integration

- [x] Verify the denser graph layout fits inside dashboard contribution cards.
- [x] Adjust dashboard card container behavior only if the new graph layout requires it.
- [x] Verify the same graph behavior works inside the contribution detail page.
- [x] Adjust detail-page graph container behavior only if needed.

## Verification And Workflow Updates

- [x] Verify one day still maps to one cell after the layout update.
- [x] Verify real month lengths still render correctly.
- [x] Verify horizontal overflow remains understandable on desktop and mobile widths.
- [x] Verify the smaller contribution cells remain visually distinguishable.
- [x] Verify frontend checks still pass after implementation.
- [x] Update the implementation log after each completed task.
- [x] Update the review file with bugs, risks, validation notes, and follow-up improvements.
