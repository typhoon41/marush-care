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
- `Directory.Packages.props`: Central NuGet version pinning — all versions live here; individual `.csproj` files must not specify versions.

---

## Universal Conventions

These apply to every file in every stack. Skills carry the full detail; this is the cross-cutting reminder.

- **No abbreviations** — write every identifier in full. Accepted acronyms: `Id`, `Url`, `Http`, `Api`, `Dto` (as Infrastructure persistence-record suffix only).
- **One file per type** — each class, record, interface, or enum in its own file, named after the type.
- **Braces required** — every control-flow body has explicit `{ }` in 1tbs style, both C# and TypeScript.
- **~120 lines is a split trigger** — a file approaching 120 lines is holding more than one responsibility. Split it into the abstractions it hides.
- **No grab-bag files** — every file holds one named abstraction. A file accumulating unrelated exports must be split by responsibility; prefer a class over a pile of loose `export const` / `export function`.
- **Thin controllers** — controllers bind, delegate to a service, and return a status code. Mapping, orchestration and notification decisions live in `Services/`.
- **No "utils" naming** — files or modules named `*-utils`, `*Utils`, `helpers`, or any other catch-all label are banned. Every abstraction must be named for what it does, not that it is a collection (e.g., `CalendarSlotCalculator`, not `calendar-utils`).

---

## Frontend Conventions (Angular / SCSS)

- **No viewport units** — never use `vh`/`vw`/`vmin`/`vmax`; they are buggy on iOS Safari (the dynamic toolbar resizes the viewport). Use `%` instead. For modal `<dialog>`/overlays, `%` resolves against the viewport, so `max-width: 50%` / `max-height: 80%` behave like `vw`/`vh` without the bug.
- **No conditional expressions in templates** — no ternaries, comparisons or non-null assertions inside a binding or interpolation. Move them into a `computed()` or onto the model. `@if` / `@for` on a boolean signal or collection is control flow and stays.
- **Never style a library-generated class** — `.row`, `.column-N`, `.ellipsis` and friends are applied in HTML, never used as selectors in app SCSS. Add a semantic class and style that.
- **No extra template wrappers** — don't add wrapper `<div>`s for layout. Put the responsibility on the component's `:host` (`host: { class: ... }` + `:host` styles) or an existing element. Custom elements default to `display: inline`, so set `display: block` for `overflow` to take effect.

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
