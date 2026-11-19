---
name: migrations
description: EF Core migration rules for this codebase. Apply whenever adding, removing, squashing or reviewing a migration under Site/Gmf.Marush.Care.Infrastructure/Migrations/.
---

# EF Core migrations

## Squash at 7 migrations
When adding a migration would make it the 7th in `Migrations/`, merge the existing ones into one first.

1. **Stop and ask the user** to confirm that every environment (local, test, production) has applied the latest migration. Never squash without that answer: a database that is behind silently skips everything folded into the merged migration.
2. Delete all migration files and `MarushCareContextModelSnapshot.cs`, then build so the old migrations leave the assembly.
3. `dotnet ef migrations add InitialCreate --project Site/Gmf.Marush.Care.Infrastructure --startup-project Gmf.Marush.Care.Host`
4. Rename the two generated files and the `[Migration("...")]` attribute to the oldest ID, `20241105222844_InitialCreate`. Existing databases already have it in `__EFMigrationsHistory`, so the deploy bundle finds nothing pending.
5. Verify the new snapshot equals the old one and `dotnet ef migrations has-pending-model-changes` reports none.

Data-only SQL in the old migrations is dropped; it has already run everywhere.
