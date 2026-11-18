## Command line commands

### Install global tool

``` shell
dotnet tool install --global dotnet-ef
```

### Update global tool to latest version

``` shell
dotnet tool update --global dotnet-ef
```

### Add migration

``` shell
dotnet ef migrations add InitialCreate --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj
```

### Update database

``` shell
dotnet ef database update --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj
```

### Squash migrations (at 7 migrations)

Only after confirming every environment (local, test, production) has applied the latest migration:

1. Delete all files in `Migrations/`, including `MarushCareContextModelSnapshot.cs`.
2. Run the "Add migration" command above with the name `InitialCreate`.
3. Rename the generated files and the `[Migration("...")]` attribute in the Designer file to the oldest migration's ID (`20241105222844_InitialCreate`), so existing databases see nothing pending.

### Remove migration

``` shell
dotnet-ef migrations remove --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj
```

### Revert to a specific migration (discard all migrations created after the specified one)

``` shell
dotnet-ef database update --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj THE-LAST-GOOD-MIGRATION-NAME

### Revert all migrations

``` shell
dotnet-ef database update --project Site/Gmf.Marush.Care.Infrastructure/Gmf.Marush.Care.Infrastructure.csproj --startup-project Gmf.Marush.Care.Host/Gmf.Marush.Care.Host.csproj 0
```