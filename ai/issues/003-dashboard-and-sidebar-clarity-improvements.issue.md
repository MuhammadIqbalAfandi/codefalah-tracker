# Issue: Dashboard and Sidebar Clarity Improvements

## Background

Feature `001-personal-modular-tracker-app` introduced the modular tracker foundation, and feature `002-interactive-record-management-and-theme-support` improved record lifecycle flows and theme support for the MVP modules.

The next improvement area is the clarity of the main dashboard and the usability of the shared sidebar. The raw idea highlights that several dashboard sections currently feel difficult to understand, especially when reading summary cards, progress values, contribution views, and module-level statistics. Some data already exists in the application, but the dashboard does not yet present it in a way that feels clear, meaningful, or easy to evaluate.

The sidebar also needs a more explicit open and close interaction so navigation across modules feels more comfortable on different screen sizes.

This issue is a product clarity and usability enhancement. It should improve how information is presented to the user, especially for activity summaries, period-based statistics, and shared navigation behavior.

## Goal

Improve the Personal Tracker App so the sidebar is easier to use and the dashboard becomes a clearer, more informative overview of the user's activity data.

The enhancement should help users quickly understand:

- what has been completed
- what is still incomplete
- what the displayed numbers mean
- how activity changes across meaningful time ranges

## Scope

This issue includes the following enhancement goals:

- Improve the shared sidebar behavior so it has a clear open and close interaction
- Make sidebar usage feel more understandable across small and large screens
- Redesign or refine the main dashboard so its summaries are easier to interpret
- Improve the meaning and readability of summary cards shown on the dashboard
- Clarify progress indicators so percentages or status values clearly explain what they represent
- Improve contribution visualization so activity patterns across time are easier to read
- Strengthen period-based dashboard summaries for supported tracker modules
- Make the dashboard better reflect real stored records rather than feeling generic

The dashboard enhancement should support clearer summary behavior for the existing MVP modules where relevant, especially:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

The dashboard should better support time-based summaries such as:

- hari ini
- minggu ini
- bulan ini
- tahun ini

Where appropriate, the dashboard may show statistics, list previews, progress explanations, or visual summaries that help users understand their data more quickly.

## Out of Scope

The following items are not part of this issue:

- Adding brand-new tracker modules outside the current MVP module set
- Rebuilding unrelated record creation, edit, detail, or delete flows that are already covered by feature `002`
- Introducing authentication, multi-user behavior, or collaboration features
- Expanding the scope into reminders, notifications, or external integrations
- Full product redefinition outside dashboard clarity and sidebar usability
- Major stack changes or new dependencies that are not already justified by the project workflow

## Expected Behavior

As a user, I can open and close the sidebar clearly, so navigation between modules feels straightforward and not confusing.

As a user, I can use the sidebar comfortably on both smaller and larger screens.

As a user, I can open the dashboard and immediately understand what the main cards and summaries are trying to tell me.

As a user, I can see module-related dashboard information grouped into meaningful time ranges such as today, this week, this month, or this year.

As a user, I can understand what a progress value means because the dashboard explains the context of the percentage, total, or target being shown.

As a user, I can use contribution-style views or similar activity visuals to quickly understand when I was active and when I was inactive.

As a user, I can see dashboard information that reflects the records I have already entered, especially for the main MVP modules.

The expected module-level dashboard behaviors include:

- Sholat Tracker: dashboard summaries make prayer completion easier to read across selected time periods
- Puasa Tracker: dashboard summaries make fasting records and totals easier to understand across selected time periods
- Keuangan Tracker: dashboard summaries make income, expenses, or period-based financial overviews easier to interpret
- Olahraga Tracker: dashboard summaries include clearer intensity, consistency, or time-based visual feedback
- Jurnal Harian: dashboard summaries reflect saved journal activity instead of feeling empty or unclear when records already exist

## Notes

- Use the feature ID `003` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `dashboard-and-sidebar-clarity-improvements`.
- This issue is an enhancement of the existing Personal Tracker App experience, not a new product direction.
- Keep this issue at the request and behavior level only.
- Detailed design choices, implementation strategy, and task breakdown should be handled in later workflow stages.
- If some dashboard sections are currently ambiguous, this issue allows them to be renamed, restructured, or reframed so their meaning is clearer to the user.
