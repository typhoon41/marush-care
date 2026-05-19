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

dotnet ef database update \
  --project Site/Gmf.Marush.Care.Infrastructure \
  --startup-project Gmf.Marush.Care.Host
```

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
- `Directory.Packages.props`: Central NuGet version pinning — all versions live here; individual `.csproj` files must not specify versions. The bottom section contains transitive pins kept only to suppress security advisories; try removing them on next package upgrade.

---

## Universal Conventions

### No Abbreviations

Never use abbreviations anywhere — HTML, SCSS/CSS, TypeScript, C#, file names, CSS classes, variables, properties, method names, parameters. Write the full word every time.

Examples of what not to do: `btn`, `img`, `col`, `dir`, `repo`, `svc`, `msg`, `err`, `val`, `req`, `res`, `cnt`, `idx`, `el`, `evt`, `cfg`, `ctx`, `mgr`, `dto` (write `DataTransferObject` or a domain-specific name instead). If a name needs an abbreviation to be readable, the name is wrong — rename the concept.

The only accepted abbreviations are industry-standard acronyms that are universally understood as-is: `Id`, `Url`, `Http`, `Api`, `Dto` (as a suffix on infrastructure persistence records only — see Persistence DTO Layer).

### One File per Type

Each type (class, record, interface, enum) lives in its own file. File name must match the type name exactly.

This applies across all layers and both stacks: C# (`.cs`), TypeScript (`.ts`), and Angular components (`.ts` + `.html` + `.scss` trio). Do not group multiple types into one file even if they are small or closely related.

### Braces Required

Every `if`, `for`, `while`, `switch`, and other control-flow body must have explicit `{ }` braces in all stacks (C# and TypeScript). Single-line bodies still require braces. Use 1tbs style: opening `{` on the same line as the control keyword, body indented on its own line, closing `}` on its own line.

---

## Backend Conventions

### DI: Autofac Modules

All Autofac modules are in `Site/Gmf.Marush.Care.Infrastructure/Injection/Modules/` and registered via `InjectionExtensions.RegisterModules()` (called from `Program.cs`).

- **New repository**: add `DefaultInterfaceRegistration<TRepo>()` in `RepositoryModule`
- **New service**: add `DefaultInterfaceRegistration<TService>()` in `ServiceModule`
- **New config section**: add `SingleSelfRegistration<TSettings>()` in `ConfigurationModule`

Helper methods (`Packages/Gmf.Net.Core.Common/Initialization/Injection/AutofacBuilderExtensions.cs`):
- `DefaultInterfaceRegistration<T>()` — registers as its implemented interface, `InstancePerLifetimeScope`
- `SingleSelfRegistration<T>()` / `SingleInterfaceRegistration<T>()` — singleton

### Transactions

`TransactionFilter` (from `Gmf.Net.Core.Common`) automatically calls `SaveChangesAsync()` after every controller action that returns 200–299 with a valid model state. **Repositories must not call `SaveChangesAsync()` themselves** — they only add/modify entities on the `DbContext`.

`RollbackTransactionFilter` clears the change tracker on exception.

### Domain Events

Add events to `EntityDto.DomainEvents` inside repository methods. `BaseDbContext.SaveChangesAsync()` automatically gathers them, persists changes, then dispatches/publishes them via `IDispatchEvents`/`IStoreEvents`.

### FluentValidation

Validators are auto-scanned from the Api assembly — just create a class inheriting `AbstractValidator<T>`. Shared rules live in `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs`. Validation error responses use camelCase property names.

Validators for admin-only models always use **hard-coded Serbian messages** — no English, no `$localize`, no resource keys. The admin is operated exclusively by Serbian-speaking staff.

### Persistence DTO Layer

The Infrastructure project maintains a parallel set of EF record types (`CustomerDto`, `AppointmentDto`, etc.) in `Data/Entities/`. These records own the static `MapFrom(…)` and instance `MapTo…()` methods that convert between the persistence model and domain model. There is no mapping framework — all conversions are explicit methods on these records.

### Repository Split Pattern

Each aggregate has two repository interfaces: `ICustomerRetrievalRepository` (read-only queries) and `ICustomerModificationRepository` (write operations). This is intentional — keep it.

### Email

Use the `ISendEmailTemplate` / `ISendEmail` abstractions from `Gmf.Mail.Common`. In development with `SmtpSettings.UsePickupDirectory = true`, emails are written to disk instead of sent. Templates are Razor `.html` files under `Site/Gmf.Marush.Care.Api/Resources/Email Templates/`.

---

## Frontend Conventions

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@shared/…` → `src/app/shared/…`
- `@features/…` → `src/app/features/…`
- `@env/…` → `src/environments/…`

### Routing

All routes are defined in `src/app/shared/routes/routes.ts` via the `lazyRoute()` helper. Routes use `$localize` so paths are translated per locale. The `RoutingDefinition` class provides typed helpers for programmatic navigation.

**Admin routes**: any route whose path starts with `'admin'` automatically gets `isProtected: true` — the `isUserAuthenticated` guard is applied. To add a new admin page, add it to `AdminRoutes` and prefix the path with `admin/`.

### State Management

No NgRx. State is managed via Angular 20 signals:
- `signal()` for mutable state
- `computed()` for derived values
- `linkedSignal()` for signals derived from other signals with mutation
- `effect()` for side effects

### HTTP

- `httpResource()` — for reactive data that re-fetches when signal inputs change (e.g., paginated lists)
- `lastValueFrom(http.post/put/delete(…))` — for imperative mutations that require captcha tokens first

Two interceptors in `src/app/shared/interceptors/`:
- `language` — adds `Accept-Language` header
- `error` — wraps calls in the global loader, handles 401 (logout + redirect) and unexpected errors (navigate to error page)

### Components

All components are **standalone** with `ChangeDetectionStrategy.OnPush`. Use `input()` signal inputs (not `@Input()` decorators). Use `@if` / `@for` control flow syntax (not `*ngIf` / `*ngFor`).

Never use `:host` — it is deprecated. Instead, declare the host class in the component decorator (`host: { class: 'my-component' }`) and style it in the global partials tree under `src/styles/partials/`.

### Forms

Use `NonNullableFormBuilder` with `updateOn: 'blur'`. Form components in `src/app/shared/components/forms/` all inherit from a `Field` base class and receive the parent `FormGroup` via `input()`.

### camelCase Everywhere

All TypeScript identifiers — variables, constants, functions, and class members — use camelCase, including module-level constants. Never use `SCREAMING_SNAKE_CASE`. Write `const slotHeight = 36;` not `const SLOT_HEIGHT = 36;`.

### i18n

Use `` $localize`:@@key.name:default string` `` throughout the codebase. After adding new keys, run `npm run translate` (extracts keys and sorts locale files), then add translations to `src/locale/messages.en.json` and `src/locale/messages.ru.json`.

**Admin modules are exempt from i18n.** Any component under `src/app/features/admin/` must not use `$localize`, `i18n-*` attributes, or `@@` translation keys. Use plain string literals directly in templates and code.

### Dependencies

`air-datepicker` is pinned to **3.5.3** — do not upgrade to 3.6.0, it breaks the English locale display.

---

## Local Development Setup

1. .NET 10.0 SDK
2. Node.js 22.20.0
3. Docker Desktop (SQL Server container via Aspire)
4. `dotnet tool install --global dotnet-ef`
5. Configure user secrets on `Gmf.Marush.Care.Api` (JWT key, SMTP credentials, DB connection string)

Run the Aspire host (`Gmf.Marush.Care.Host`) to start all services together. The Angular frontend has `WithExplicitStart()` — trigger it manually from the Aspire dashboard.

## CI/CD

Azure Pipelines (`Deployment/azure-pipelines.yml`): build → test environment deploy → **manual approval gate** → production deploy.
