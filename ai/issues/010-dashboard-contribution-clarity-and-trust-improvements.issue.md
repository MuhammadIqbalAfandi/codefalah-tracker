# Issue: Dashboard Contribution Clarity and Trust Improvements

## Background

Feature `008-dashboard-redesign-and-actionable-insight-experience` successfully redesigned the dashboard into a more actionable and insight-driven surface.

That enhancement improved the dashboard hierarchy, added year-based browsing, and introduced richer progress and insight areas. However, after the redesign, there are still important clarity gaps from the user perspective.

The current dashboard now contains more guidance and more signals, but several parts still feel difficult to interpret with confidence:

- the year selector works, but its current form may not scale cleanly as contribution history grows
- some dashboard concepts such as progress, reference date, and streak are still not explained clearly enough
- contribution intensity labels like `kosong`, `ringan`, `sedang`, and `tinggi` can still feel ambiguous
- in modules such as Sholat, users may expect a more obvious relationship between completed activity and contribution intensity
- if a displayed value feels wrong, the dashboard does not yet always make it clear whether the issue is explanation, scoring logic, or a real data mismatch

This enhancement should not replace the dashboard direction introduced in feature `008`. Instead, it should strengthen that redesign by making the dashboard more understandable, more trustworthy, and easier to interpret correctly.

## Goal

Improve the redesigned dashboard so users can understand its values, contribution meaning, and guidance signals more clearly.

The enhancement should help users:

- understand what the dashboard is measuring
- understand how contribution intensity is interpreted
- understand why a value or status appears
- browse contribution history with a control that remains practical over time
- trust that the dashboard reflects backend data correctly or reveals where a real bug exists

## Scope

This issue includes the following enhancement goals:

- improve the contribution year selector so it scales better for long-term usage
- replace the current year selection interaction with a more flexible control such as a dropdown if appropriate
- add a dashboard explanation surface such as help content, guidance, or lightweight documentation
- clarify dashboard concepts such as progress, reference date, streak, and contribution intensity
- review whether contribution intensity labels are understandable across the supported modules
- specifically review Sholat contribution interpretation and whether the displayed intensity matches user expectation clearly enough
- identify whether any suspicious dashboard values are caused by unclear explanation, unclear scoring rules, or real backend/data-mapping bugs
- improve the dashboard so its richer information surface from feature `008` feels clearer instead of more confusing

This issue is especially relevant to the existing MVP tracker modules where dashboard contribution meaning matters, such as:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

## Out of Scope

The following items are not part of this issue:

- abandoning the redesign direction established in feature `008`
- replacing the contribution-centered dashboard model with a different product direction
- broad redesign of unrelated module CRUD flows
- introducing new tracker modules
- changing authentication, reminders, notifications, exports, backups, or integrations
- large backend architecture changes unrelated to dashboard clarity or correctness
- defining implementation-level code structure inside the issue file

## Expected Behavior

As a user, I can open the dashboard and understand what its main numbers and labels mean without guessing.

As a user, I can understand what `progress`, `reference date`, and `streak` are based on.

As a user, I can browse contribution history by year using an interaction that remains practical as more years become available.

As a user, I can better understand why a contribution level is shown as low, medium, or high.

As a user, if I feel a dashboard value does not match my stored activity, the product either explains the rule clearly or reveals a real bug that can be fixed.

As a user, the redesigned dashboard feels more trustworthy and less confusing than before.

## Notes

- Use the feature ID `010` for this enhancement and keep it consistent across all related workflow files.
- Use the feature name `dashboard-contribution-clarity-and-trust-improvements`.
- This enhancement directly extends feature `008-dashboard-redesign-and-actionable-insight-experience`.
- This issue should stay at the request and behavior level only.
- Detailed interaction decisions, scoring validation, and implementation tradeoffs should be handled in later workflow stages.
