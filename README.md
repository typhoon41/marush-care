# Welcome to "Marush: Space of Care" project!

Purpose of this project is to hold source code for Marush: Space of Care beauty salon (https://marushcare.com).

# Running Marush locally

Everything runs from the .NET Aspire host (`Gmf.Marush.Care.Host`): a SQL Server container, the API and the Angular app. No local SQL Server and no user secrets are needed.

## Prerequisites

* .NET 10 SDK, with Visual Studio or VS Code
* Node.js 22.20.0 (with npm)
* Docker Desktop, running before you start the host
* `dotnet tool install --global dotnet-ef`, only if you author migrations

## First run

1. Install the frontend packages once: `npm ci` in `Site/Gmf.Marush.Care.App`.
2. Start the host: set `Gmf.Marush.Care.Host` as the startup project and press F5, or run `dotnet run --project Gmf.Marush.Care.Host`. The first run downloads the Aspire bundle and the SQL Server image, which takes a few minutes.
3. The Aspire dashboard opens at https://localhost:17001. It starts these resources:
   * `sql`: SQL Server container with the `MarushCare` database
   * `marush-care-api`: the API at https://localhost:7251 (Swagger at `/swagger`)
   * `marush-care-app`: the Angular dev server at http://localhost:4200
4. On startup in Development, the API applies all pending migrations, then seeds the database if it has no users yet.

## Seeded data

| What | Details |
|---|---|
| Admin login | `admin@marushcare.local` / `Marush!2026` |
| Clients | 8 clients with phones, emails, diagnoses, allergies and notes |
| Calendar | Visits performed in the last three weeks, approved entries this week and next week |
| Online requests | Pending and rejected bookings, shown in the calendar as public appointments |
| Notes | A weekly note, a daily note and a non-working day |

Visits are placed relative to the week you first seed in. To reseed with current dates, reset the database (see below).

## Development configuration

* **Database**: the `sql` container is persistent and keeps its data in a Docker volume, so it survives host restarts. The sa password is generated on the first run and stored in the host's user secrets as `Parameters:sql-password`.
* **SSMS / Azure Data Studio**: connect to `127.0.0.1,14330` as `sa` with that password, or copy the connection string from the `sql` resource in the dashboard.
* **JWT key**: generated on the first run and stored in the host's user secrets as `Parameters:jwt-key`. Issuer, audience and token lifetime come from `Site/Gmf.Marush.Care.Api/appsettings.Development.json`.
* **Emails**: no mail is sent. Every email is written as an `.eml` file to `C:/Temp/Marush/Emails`.
* **API logs**: `C:/Temp/Marush/Api/`, and in the dashboard.
* **Captcha**: skipped outside Production.

Need a real mailbox or other settings? API user secrets still override `appsettings.Development.json` (e.g. `Smtp:UsePickupDirectory=false` plus `Smtp:Server`, `Smtp:Port`, `Smtp:Username`, `Smtp:Password`).

## Reset the database

Stop the host, delete the `sql` container and its volume from Docker Desktop (the container's name starts with `sql-`, the volume's name ends with `-sql-data`), then start the host again. It recreates the database, migrates it and seeds it.

## Migrations

See [MigrationCommands](Site/Gmf.Marush.Care.Infrastructure/MigrationCommands.md).
