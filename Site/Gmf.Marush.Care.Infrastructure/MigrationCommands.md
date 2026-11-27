## Migrations

In Development, the API applies pending migrations on startup and then seeds an empty database (`Data/Seeding/DevelopmentData.cs`), so you never need to update the local database by hand. Test and Production are migrated by the Azure pipeline (EF bundle, `Deployment/Templates/update-database.yaml`), which never seeds.

Run every command from the repository root.

### Install global tool

``` shell
dotnet tool install --global dotnet-ef
```

### Update global tool to latest version

``` shell
dotnet tool update --global dotnet-ef
```

### Add migration

Needs no running database. After adding one, restart the API (or the Aspire host) to apply it.

``` shell
dotnet ef migrations add <Name> --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj
```

### Remove migration

Removing a migration the local database has already applied needs `--connection` (see below), or reverting it first.

``` shell
dotnet ef migrations remove --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj
```

## Commands that connect to the local database

The design-time connection string (`Gmf.Marush.Care.Host/appsettings.json`, `ConnectionStrings:Database`) points at the Aspire SQL container on `127.0.0.1,14330` but carries no password. Pass the full string with `--connection`. Copy it from the `sql` resource in the Aspire dashboard, or build it with the `Parameters:sql-password` value from the host's user secrets:

``` shell
--connection "Server=127.0.0.1,14330;Database=MarushCare;User ID=sa;Password=<sql-password>;TrustServerCertificate=True;"
```

### Update database

``` shell
dotnet ef database update --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj --connection "<connection string>"
```

### Revert to a specific migration (discard all migrations created after the specified one)

``` shell
dotnet ef database update THE-LAST-GOOD-MIGRATION-NAME --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj --connection "<connection string>"
```

### Revert all migrations

``` shell
dotnet ef database update 0 --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj --connection "<connection string>"
```
