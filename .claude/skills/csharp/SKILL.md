---
name: csharp
description: Conventions for all C# work in this codebase — naming, structure, DI, repositories, email, and validation. Apply whenever reading, writing, or reviewing any .cs file.
---

# C# conventions

You are working on an ASP.NET Core 10 / DDD codebase. Every rule below is non-negotiable unless explicitly overridden by the user.

## Naming

### No `Async` suffix
Methods returning `Task` or `Task<T>` must not have an `Async` suffix — the return type already communicates asynchrony.

Keep the suffix only when the framework forces it:
- `BackgroundService.ExecuteAsync` / `StopAsync`
- EF Core `SaveChangesAsync` (and any override of it)
- ASP.NET Core filter `OnActionExecutionAsync`
- ASP.NET Core middleware `InvokeAsync`

### No abbreviations
Write every identifier in full — class, interface, method, parameter, variable, property, field. No short forms (`repo`, `svc`, `msg`, `err`, `val`, `req`, `res`, `ctx`, `cfg`, `mgr`).

Accepted acronyms only: `Id`, `Url`, `Http`, `Api`, `Dto` (as a suffix on Infrastructure persistence records only).

### camelCase for local identifiers
All local variables and parameters use camelCase. Never `SCREAMING_SNAKE_CASE` for constants — write `const int slotHeight = 36;` not `const int SLOT_HEIGHT = 36;`.

## Structure

### One file per type
Each class, record, interface, or enum lives in its own `.cs` file named after the type. Never group multiple types in one file, even tiny helpers.

### Braces required (1tbs)
Every `if`, `for`, `foreach`, `while`, and `switch` body must have explicit `{ }` braces. Opening `{` on the same line as the keyword.

```csharp
// Wrong
if (x is null)
    return;

// Right
if (x is null) {
    return;
}
```

## Architecture

### Repository split pattern
Every aggregate has exactly two repository interfaces in `Domain/Contracts/Repositories/`:
- `I{Aggregate}RetrievalRepository` — read-only queries
- `I{Aggregate}ModificationRepository` — write operations

Never mix reads and writes in a single interface.

### Repositories must not call `SaveChangesAsync`
`TransactionFilter` calls `SaveChangesAsync` automatically after every successful controller action. Repository methods only add/modify entities on the `DbContext` — they never call `SaveChangesAsync` themselves.

### DI registration
- New repository → `DefaultInterfaceRegistration<TRepo>()` in `RepositoryModule`
- New service → `DefaultInterfaceRegistration<TService>()` in `ServiceModule`
- New config section → `SingleSelfRegistration<TSettings>()` in `ConfigurationModule`

All modules live in `Site/Gmf.Marush.Care.Infrastructure/Injection/Modules/`.

### Persistence DTO layer
EF record types in `Infrastructure/Data/Entities/` own all mapping:
- `static MapFrom(…)` — domain model → persistence record
- `MapTo…()` — persistence record → domain model

No mapping frameworks. All conversions are explicit methods on the record.

### Domain events
Add events to `EntityDto.DomainEvents` inside repository methods. `BaseDbContext.SaveChangesAsync` dispatches them automatically. Never dispatch events from a controller or service.

## Email and culture

### Always resolve culture before sending a customer email
When building an email for a customer, call `cultureResolver.SetCulture(language)` first — where `language` comes from `AppointmentDto.Language`. This ensures both date formatting and `Labels.*` resource strings render in the customer's language.

Never hard-code a date or time format string. Use `CultureInfo.CurrentCulture` after setting the culture:

```csharp
cultureResolver.SetCulture(language);
var culture = CultureInfo.CurrentCulture;
var formatted = $"{date.ToString("d", culture)} {start.ToString("t", culture)}–{end.ToString("t", culture)}";
```

## Validation

### Admin validators use hard-coded Serbian messages
Any `AbstractValidator<T>` for an admin-only model must use plain Serbian string literals — never `Labels.*`, `$localize`, or English. The admin is operated exclusively by Serbian-speaking staff.

```csharp
// Wrong
RuleFor(x => x.Name).NotEmpty().WithMessage(Labels.ValidationRequired);

// Right
RuleFor(x => x.Name).NotEmpty().WithMessage("Ime je obavezno");
```

## Final checklist before every C# edit

- [ ] No `Async` suffix on any new or renamed method (except framework overrides)
- [ ] No abbreviations in any identifier
- [ ] Each new type in its own file
- [ ] All control-flow bodies have braces
- [ ] No `SaveChangesAsync` call in any repository method
- [ ] New DI registrations added to the correct Autofac module
- [ ] Customer emails set culture before formatting dates or accessing `Labels`
- [ ] Admin validator messages are hard-coded Serbian strings
