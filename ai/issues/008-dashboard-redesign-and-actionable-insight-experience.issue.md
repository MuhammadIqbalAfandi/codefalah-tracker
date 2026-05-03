# Issue: Dashboard Redesign and Actionable Insight Experience

## Background

Feature `004-dashboard-revamp-and-module-contribution-views` successfully established the dashboard as a contribution-centered overview and introduced module contribution detail pages.

That enhancement improved the overall structure, but the dashboard still does not fully feel like a strong decision-making surface for daily use. Some important information is present, yet the page still feels heavier than necessary in certain areas and not actionable enough in others.

The current dashboard still has several product-level UX gaps:

- the left hero card contains too much text and does not strongly guide the user toward the next action
- the contribution section still feels heavier than ideal for quick reading
- there is no year-level control for long-term usage
- insight presentation is still closer to passive data display than practical guidance
- zero or empty states often explain status but do not always help the user know what to do next

This enhancement is intended as a major redesign of the dashboard experience. It extends feature `004`, but it does not replace the contribution-based direction. Instead, it strengthens the dashboard so it becomes faster to understand, more actionable, and more useful for long-term personal habit tracking.

## Goal

Redesign the dashboard so it becomes a clearer and more actionable home screen for the tracker.

The improved dashboard should help users:

- understand what needs attention today
- understand current daily progress quickly
- understand consistency trends over time
- receive lightweight insights that encourage the next action
- keep using the dashboard meaningfully over longer time periods

## Scope

This issue includes the following redesign goals:

- improve the top section so it becomes a stronger daily action surface
- replace or redesign the current left primary card into a clearer `Progress Hari Ini` experience
- refine the right-side summary area into a more useful `Quick Summary`
- keep contribution as an important section, but make it easier to scan and less visually heavy
- support year-based contribution browsing for long-term use
- add more explicit insight layers such as monthly insight, streak, trend, weekly summary, or recommendation guidance where appropriate
- improve empty states so they lead the user toward action instead of only showing zero values
- keep the dashboard focused on habit consistency, progress clarity, and next-step guidance

The redesign is especially relevant to the existing MVP tracker modules where dashboard visibility is meaningful, such as:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

## Out of Scope

The following items are not part of this issue:

- redesigning the backend architecture or database
- changing module CRUD flows that are not directly needed for dashboard redesign
- redesigning unrelated routes outside the dashboard unless a small supporting adjustment is clearly required
- introducing brand-new tracker modules
- changing authentication, reminders, notification systems, exports, backups, or external integrations
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can open the dashboard and understand the most important information in just a few seconds.

As a user, I can clearly see what progress I have made today and what still needs attention.

As a user, I can read contribution and summary information without feeling overwhelmed by heavy or overly detailed presentation.

As a user, I can view longer-term contribution information by year when my history grows.

As a user, I receive lightweight but useful insights, not just passive numbers.

As a user, empty states guide me toward the next meaningful action instead of only showing zero values.

## Notes

- Use the new feature ID `008` because this is a major enhancement that extends feature `004`.
- Use the feature name `dashboard-redesign-and-actionable-insight-experience`.
- This issue should stay at the request and behavior level only.
- Detailed layout decisions, implementation strategy, data rules, and tradeoffs should be handled in later workflow stages.
