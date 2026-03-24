# @Ouilliam-21/database

Schema and migrations for the Ouilliam app’s PostgreSQL database. This package publishes Drizzle ORM table definitions (and related types) for use by other services.

For an auto-generated ER diagram and field listing, see **[SCHEMA.md](./SCHEMA.md)** (updated on each push on main; do not edit by hand).

## Development

```bash
bun install
bun run build
bun run typecheck
```

Database tooling (local): `bun run db:generate`, `bun run db:migrate`, `bun run db:studio`.

This project uses [Bun](https://bun.com) as the runtime.
