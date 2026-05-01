# Issue: Interactive Record Management and Theme Support

## Background

Feature `001-personal-modular-tracker-app` established the MVP foundation for the personal tracker application, including the main dashboard, core module navigation, and basic record creation flows for sholat, puasa, keuangan, olahraga, and jurnal.

That foundation is useful, but the day-to-day experience is still incomplete. Users can save data, yet the module history experience is not fully centered on real stored records, and users do not yet have a complete lifecycle for managing existing entries. In addition, the application does not yet provide a dark theme option for visual comfort.

This issue is a major enhancement to the existing MVP. It does not introduce new tracker modules. Instead, it strengthens how users view, manage, and revisit the data already created in the modules from feature `001`.

## Goal

Improve the Personal Modular Tracker App so users can fully manage existing records and personalize the interface theme.

The enhancement should make the MVP feel more complete by allowing users to:

- See module history from real backend data
- Open a dedicated detail view for an individual record
- Edit previously created records
- Delete records safely
- Switch the app between light and dark visual themes

## Scope

This enhancement includes the following work for the existing MVP modules:

- Use real backend data as the source of truth for module history views
- Ensure history views reflect newly created, updated, and deleted records
- Add a dedicated detail page or detail view flow for selected records
- Add edit capability for records in:
  - Sholat Tracker
  - Puasa Tracker
  - Keuangan Tracker
  - Olahraga Tracker
  - Jurnal Harian
- Add delete capability for records in:
  - Sholat Tracker
  - Puasa Tracker
  - Keuangan Tracker
  - Olahraga Tracker
  - Jurnal Harian
- Add a clear delete confirmation step before destructive actions
- Refresh related history or summary views after record changes where relevant
- Add a frontend dark theme option that applies across the application
- Preserve the selected theme preference for future visits or reloads

## Out of Scope

The following items are not part of this issue:

- Adding new tracker modules beyond the MVP modules from feature `001`
- Authentication or multi-user support
- Trash bin, undo delete, or record recovery flows
- Export, backup, or cloud synchronization features
- Large dashboard redesign outside the needs of this enhancement
- Replacing the approved stack or introducing new major tools outside project rules

## Expected Behavior

As a user, I can open any supported MVP module and see a history list built from records that were actually saved in the application.

As a user, I can select one record from the history and open a dedicated detail view that shows the full information for that entry.

As a user, I can edit an existing record and see the updated information reflected back in the module view.

As a user, I can delete an existing record only after confirming the action, and the related history or summary no longer shows the deleted entry afterward.

As a user, I can switch between light and dark theme modes, and the app remembers my preference the next time I open it.

The expected module-level behaviors are:

- Sholat Tracker: history shows saved prayer records, detail shows the saved daily prayer status and notes, and edit/delete work for the selected record.
- Puasa Tracker: history shows saved fasting records, detail shows the record fields, and edit/delete work for the selected record.
- Keuangan Tracker: history shows saved transactions, detail shows transaction information, and edit/delete update the visible finance data accordingly.
- Olahraga Tracker: history shows saved sport records, detail shows the selected entry information, and edit/delete work for the selected record.
- Jurnal Harian: history shows saved journal entries, detail shows the full journal content and related metadata, and edit/delete work for the selected entry.

## Notes

- Use the feature ID `002` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `interactive-record-management-and-theme-support`.
- This issue is a direct enhancement of `001-personal-modular-tracker-app` and should reuse the existing module boundaries rather than redefine the product scope.
- Keep the enhancement focused on record lifecycle completeness and theme support, not on expanding the product into new domains.
- The issue should remain at the feature-request level only. Planning, task breakdown, and implementation decisions should be handled in later workflow stages.
