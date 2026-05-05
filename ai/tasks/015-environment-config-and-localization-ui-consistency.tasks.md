# Tasks: Environment Config And Localization UI Consistency

## Discovery And Scope Lock

- [x] Review feature `014` files and confirm which localization behaviors must be preserved.
- [x] Audit current backend runtime configuration usage and list the important values that should move behind environment-based configuration.
- [x] Audit current frontend runtime configuration usage and list the important values that should move behind environment-based configuration.
- [x] Confirm the narrowest maintainable backend and frontend environment-handling approach for this repo.

## Environment Configuration

- [x] Implement or document the backend environment-configuration pattern for the scoped runtime values.
- [x] Implement or document the frontend environment-configuration pattern for the scoped runtime values.
- [x] Add or update the environment setup notes or example file if the scoped values are not yet clear for maintainers.

## Localization UI Consistency Follow-Up

- [x] Inspect the shared language and theme controls, then align sizing and presentation where needed.
- [x] Localize the remaining high-visibility labels in the scoped routes so they follow the active language.
- [x] Normalize the targeted back-navigation placement patterns so they match related page layouts.

## Verification And Workflow Updates

- [x] Run the relevant frontend checks for the implemented scope.
- [x] Run backend checks if backend code changes are introduced.
- [x] Update the implementation log after each completed task.
- [x] Update the review file with findings, risks, validation notes, and follow-up improvements.
