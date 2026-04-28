# Migrations

This directory stores PostgreSQL schema migrations for `golang-migrate`.

Use paired files for each migration:

- `NNN_name.up.sql`
- `NNN_name.down.sql`

Examples:

- `001_create_sholat_records.up.sql`
- `001_create_sholat_records.down.sql`

Keep each migration focused on one schema change so later rollbacks stay predictable.
