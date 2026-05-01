# Issue: Personal Modular Tracker App

## Background

The raw idea describes a personal tracker application for recording daily, weekly, monthly, and yearly activities in one place.

The application should help the user build consistency, track important personal activities, evaluate progress, and write daily reflections. The core concept is a modular tracker: each tracker is separated into its own menu or module so it can grow independently without mixing unrelated activity types.

The full product vision includes many modules, such as sholat, fasting, finance, sport, meal, drink, daily schedule, monthly schedule, journal, habit, sleep, study, additional worship, and life goals. To avoid making the first version too large, the raw idea recommends starting with an MVP focused on the most important modules.

## Goal

Create a personal modular tracker app that lets the user record important activities, view progress, and evaluate consistency through dashboards, module pages, history, statistics, and simple contribution graphs.

The first version should prioritize a clean foundation for tracker modules instead of trying to build every possible feature at once.

## Scope

The initial scope should focus on the MVP modules and shared tracker foundation:

- Main dashboard
- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian
- Simple contribution graph support

The app should support the core tracker pattern described in the raw idea:

- A main page for each module
- Simple input or checklist flow
- Activity history
- Daily, weekly, monthly, or yearly summaries where relevant
- Progress visualization through cards, statistics, charts, or contribution graphs

The dashboard should summarize activity from the available modules, including today's progress, unfinished activities, quick actions, and monthly progress where relevant.

The MVP should preserve the modular structure so additional modules can be added later without redesigning the whole app.

## Out of Scope

The following items are not part of the initial issue scope:

- Building every module from the raw idea in the first version
- Advanced reminder or notification systems
- Public social networking features for the journal
- Likes, comments, follows, or public feeds
- Advanced analytics beyond simple summaries, charts, streaks, and contribution graphs
- Complex automation or integrations with external services
- Mobile app packaging
- Multi-user collaboration or shared tracking

The additional modules can be considered future enhancements after the MVP foundation is stable:

- Makan Tracker
- Minum Tracker
- Jadwal Harian
- Jadwal Bulanan
- Habit Tracker
- Tidur Tracker
- Belajar Tracker
- Ibadah Tambahan Tracker
- Target Hidup Tracker

## Expected Behavior

As a user, I can open the app and see a dashboard that summarizes my personal activity progress.

As a user, I can open each MVP module from the main menu and record activity using a simple form, checklist, or journal-style input.

As a user, I can view previous records for each module so I can review what I have done over time.

As a user, I can see progress summaries and simple visual indicators, such as statistics, streaks, charts, or contribution graphs, so I can evaluate consistency.

As a user, I can use the app privately as a personal evaluation tool, especially for worship, finance, health, and daily reflection.

The main expected module behaviors are:

- Sholat Tracker: record daily prayer completion and view consistency.
- Puasa Tracker: record fasting type, status, and progress.
- Keuangan Tracker: record income, expenses, budget plans, and remaining budget.
- Olahraga Tracker: record exercise schedule, completion status, duration, and progress.
- Jurnal Harian: write daily stories with title, content, mood, tags, and optional media support in a later phase.
- Contribution Graph: show consistency for selected activities in a simple visual format.

## Notes

- Use the feature ID `001` for this feature and keep it consistent across related workflow files.
- Use the feature name `personal-modular-tracker-app`.
- Keep modules separated by responsibility so one tracker does not mix with another tracker.
- Make data input quick and lightweight, such as checklist actions for sholat and simple entry forms for finance, sport, and journal records.
- Focus on progress and self-evaluation, not just data entry.
- The suggested module naming from the raw idea includes:
  - `sholat-tracker`
  - `puasa-tracker`
  - `finance-tracker`
  - `sport-tracker`
  - `meal-tracker`
  - `drink-tracker`
  - `daily-schedule`
  - `monthly-schedule`
  - `journal-tracker`
  - `habit-tracker`
  - `sleep-tracker`
  - `study-tracker`
  - `worship-tracker`
  - `goal-tracker`
- This issue intentionally stays at the feature-request level. Implementation planning should happen in the plan stage.
