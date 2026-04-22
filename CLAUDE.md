# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Marush: Space of Care** — a beauty salon management web app at [marushcare.com](https://marushcare.com). Full-stack: ASP.NET Core 10 API backend + Angular 20 frontend, orchestrated locally with .NET Aspire.

## Commands

### Frontend (`Site/Gmf.Marush.Care.App/`)

```bash
npm start            # Dev server (Aspire-integrated)
npm run start-en     # Dev server, English locale
npm run start-ru     # Dev server, Russian locale
npm run build        # Production build
npm run lint         # ESLint + Stylelint (auto-fix)
npm run test         # Jasmine unit tests
npm run translate    # Extract i18n strings
```

### Backend (.NET)

```bash
dotnet build         # Compile solution
dotnet test          # Run all tests
```

### Database Migrations

```bash
dotnet ef migrations add <Name> \
  --project Site/Gmf.Marush.Care.Infrastructure \
  --startup-project Gmf.Marush.Care.Host

dotnet ef database update \
  --project Site/Gmf.Marush.Care.Infrastructure \
  --startup-project Gmf.Marush.Care.Host
```

## Architecture

### Solution Layout

```
Gmf.Marush.Care.Host/           # .NET Aspire host — wires SQL Server, API, and Angular app
Site/
  Gmf.Marush.Care.Api/          # ASP.NET Core REST API
  Gmf.Marush.Care.App/          # Angular 20 frontend (src/app/)
  Gmf.Marush.Care.Domain/       # Domain entities (DDD)
  Gmf.Marush.Care.Infrastructure/  # EF Core DbContext + repository implementations
  Gmf.Marush.Care.Services/     # Application-level business logic
Packages/
  Gmf.DDD.Common/               # Shared DDD base types
  Gmf.Mail.Common/              # Email (MailKit)
  Gmf.Net.Core.Common/          # Auth, Swagger, core utilities
Deployment/                     # Azure Pipelines CI/CD
```

### Backend Data Flow

Request → `Controllers/` (FluentValidation) → `Gmf.Marush.Care.Services/` → `Gmf.Marush.Care.Domain/` → `Gmf.Marush.Care.Infrastructure/` (EF Core + SQL Server)

Key controllers: `AppointmentController`, `CustomerController`, `UserController`.

DI uses **Autofac**; mapping uses **AutoMapper**; JWT auth + Swagger configured in `Site/Gmf.Marush.Care.Api/Program.cs`.

### Frontend Structure

Angular 20 with standalone components. Features live under `src/app/features/`; shared utilities under `src/app/shared/`. Supports three locales: Serbian (default), English (`-en`), Russian (`-ru`).

### Global Build Settings

- `Directory.Build.props`: `Nullable=enable`, `TreatWarningsAsErrors=true`, targets .NET 10.0
- `Directory.Packages.props`: Central NuGet version pinning (Aspire 13.1, .NET 10.0.1)

## Local Development Setup

1. .NET 10.0 SDK
2. Node.js 22.20.0
3. Docker Desktop (SQL Server container via Aspire)
4. `dotnet tool install --global dotnet-ef`
5. Configure user secrets on `Gmf.Marush.Care.Api` (JWT key, SMTP credentials, DB connection string)

Run the Aspire host (`Gmf.Marush.Care.Host`) to start all services together.

## CI/CD

Azure Pipelines (`Deployment/azure-pipelines.yml`): build → test environment deploy → **manual approval gate** → production deploy.
