# Issue: Dashboard Revamp and Module Contribution Views

## Background

Feature `001-personal-modular-tracker-app` established the initial dashboard and module foundation for the tracker, while later enhancements expanded usability and improved data-facing flows.

The current dashboard still needs a stronger structure so it can function as a meaningful activity overview instead of a generic landing page. The raw idea for this enhancement focuses on reworking the dashboard so contribution-based activity becomes the main visual language for understanding progress.

The current contribution presentation is not yet strong enough to show daily consistency in a way that feels clear, comparable across modules, and easy to explore further. The dashboard should better represent real user activity and make it easier to move from a high-level overview into a more detailed activity view.

This issue is intended as a dashboard experience enhancement. It is not only about visual polish, but about changing how the dashboard communicates progress and how module activity is explored.

## Goal

Improve the dashboard so it becomes a clearer and more useful progress overview centered around module-based contribution views.

The enhancement should help users:

- see contribution activity for each module directly from the dashboard
- understand daily progress patterns more quickly
- move from summary-level visuals into detailed activity views without losing context
- experience a more focused and coherent dashboard structure

## Scope

This issue includes the following enhancement goals:

- Rework the current dashboard structure if needed so it better supports contribution-focused summaries
- Make contribution graph cards a primary dashboard element for supported modules
- Give each relevant module its own contribution graph representation on the dashboard
- Show 12 months of contribution activity within each module contribution card
- Represent each day as a single small box in the contribution graph
- Ensure the number of boxes reflects the real number of days in each month
- Use the contribution graph to indicate whether a given day has progress or no activity
- Allow users to click a module contribution view from the dashboard
- Open a dedicated detail page for the selected module contribution view
- Keep the contribution graph visible at the top of the detail page
- Show a list of related activities or records below the graph on the detail page

This issue is especially relevant to the existing MVP tracker modules where dashboard contribution views are meaningful, such as:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

The contribution visualization does not need to match GitHub exactly, but it should remain compact, consistent, and easy to understand.

## Out of Scope

The following items are not part of this issue:

- Finalizing advanced intensity or scoring rules beyond the basic presence or absence of daily progress
- Building complex filtering systems for category, tag, or custom period selection
- Redesigning unrelated module flows that are not directly tied to dashboard contribution views
- Adding new tracker modules outside the current MVP scope
- Changing the project architecture or introducing new major technology choices outside the existing workflow process
- Expanding this issue into a full product redesign beyond dashboard and contribution-related behavior

## Expected Behavior

As a user, I can open the dashboard and immediately see contribution-based activity summaries for each relevant module.

As a user, I can quickly identify which days have activity and which days do not.

As a user, I can view contribution information in a compact visual form that covers 12 months within a module card.

As a user, I can click a contribution section for a module and open a dedicated detail page for that module.

As a user, I still see the contribution graph at the top of the detail page so I do not lose the visual context from the dashboard.

As a user, I can review a list of activities or records below the graph so I can understand the data behind the visual contribution pattern.

As a user, the dashboard feels more focused, more informative, and more representative of the activity records I have actually entered.

## Notes

- Use the feature ID `004` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `dashboard-revamp-and-module-contribution-views`.
- This issue should stay at the request and behavior level only.
- Detailed data rules, contribution definitions per module, UI layout decisions, and implementation strategy should be handled in later workflow stages.
- If the current dashboard needs to be partially or fully replaced to support this direction, that is acceptable within the scope of this issue.
