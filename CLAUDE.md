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
npm run translate    # Extract i18n strings, then sort locale files
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

```

The local database is migrated by the API on startup. A manual `dotnet ef database update` needs `--connection` (see `Site/Gmf.Marush.Care.Infrastructure/MigrationCommands.md`).

## Architecture

### Solution Layout

```
Gmf.Marush.Care.Host/           # .NET Aspire host — wires SQL Server, API, and Angular app
Site/
  Gmf.Marush.Care.Api/          # ASP.NET Core REST API (controllers, validators, models, email templates)
  Gmf.Marush.Care.App/          # Angular 20 frontend (src/app/)
  Gmf.Marush.Care.Domain/       # Entities, value objects, enumerations, repository/service contracts
  Gmf.Marush.Care.Infrastructure/  # EF Core DbContext, repository implementations, Autofac modules
  Gmf.Marush.Care.Services/     # Business logic (UserService, AppointmentService, NotificationService)
Packages/
  Gmf.DDD.Common/               # Entity<T>, ValueObject, Enumeration<T>, EntityDto, Period
  Gmf.Mail.Common/              # MailKit email abstraction — EmailClient, EmailClientStub, EmailModule
  Gmf.Net.Core.Common/          # BaseDbContext, ApiRunner, transaction filters, Autofac helpers, Swagger
Deployment/                     # Azure Pipelines CI/CD
```

### Backend Data Flow

HTTP request → `TransactionFilter` wraps call → `Controller` (FluentValidation on model) → `Services/` → `Domain/` → `Infrastructure/` (EF Core) → `TransactionFilter` calls `SaveChangesAsync()` on 200–299.

Key controllers: `AppointmentController`, `CustomerController`, `UserController`.

DI uses **Autofac**; JWT auth + Swagger configured in `Site/Gmf.Marush.Care.Api/Program.cs`.

### Global Build Settings

- `Directory.Build.props`: `Nullable=enable`, `TreatWarningsAsErrors=true`, targets .NET 10.0
- `Directory.Packages.props`: Central NuGet version pinning — all versions live here; individual `.csproj` files must not specify versions.

---

## Conventions

Coding conventions come from the `conventions` plugin ([typhoon41/toolkit](https://github.com/typhoon41/toolkit)). The project skills in `.claude/skills/` (`csharp`, `angular`, `html-scss`) add only Marush-specific facts on top of it.

---

## Local Development Setup

1. .NET 10.0 SDK
2. Node.js 22.20.0, then `npm ci` in `Site/Gmf.Marush.Care.App`
3. Docker Desktop, running
4. `dotnet tool install --global dotnet-ef` (only to author migrations)

Run the Aspire host (`Gmf.Marush.Care.Host`) to start everything: a persistent SQL Server container (`127.0.0.1,14330`, data volume), the API and the Angular app (http://localhost:4200). No user secrets are needed. Aspire generates the sa password and JWT key into the host's user secrets, and the other dev settings live in the API's `appsettings.Development.json` (emails go to `.eml` files in `C:/Temp/Marush/Emails`).

In Development the API migrates on startup (`DevelopmentDatabaseMigrator`), and EF Core seeding (`Infrastructure/Data/Seeding/`) fills an empty database. Log in with `admin@marushcare.local` / `Marush!2026`. See `README.md` for the seeded data and how to reset it.

## CI/CD

Azure Pipelines (`Deployment/azure-pipelines.yml`): build → test environment deploy → **manual approval gate** → production deploy.
