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