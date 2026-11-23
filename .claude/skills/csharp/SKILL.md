---
name: csharp
description: Marush-specific C# facts on top of conventions:dotnet and conventions:gmf-ecosystem - where contracts, Autofac modules and persistence records live, customer email culture, admin validator messages. Apply whenever reading, writing, or reviewing any .cs file in this repository.
---

# Marush C#

The rules come from `conventions:code-design`, `conventions:dotnet` and `conventions:gmf-ecosystem`. This skill adds only what is specific to this repository.

## Where things live

| What | Where |
|------|-------|
| Service contracts (`I{Aggregate}Service`) | `Domain/Contracts/Services/` |
| Repository contracts (retrieval / modification pair) | `Domain/Contracts/Repositories/` |
| Enumerations (`AppointmentStatus`, `CalendarNoteType`) | `Domain/Enumerations/` |
| Persistence records (`MapFrom` / `MapTo…`) | `Infrastructure/Data/Entities/` |
| Autofac modules | `Site/Gmf.Marush.Care.Infrastructure/Injection/Modules/` |

New repositories register in `RepositoryModule`, new services in `ServiceModule` and new settings sections in `ConfigurationModule`.

## Customer email culture

Before building a customer email, call `cultureResolver.SetCulture(language)` with `AppointmentDto.Language`. Date formatting and the `Labels.*` resource strings then render in the customer's language.

```csharp
cultureResolver.SetCulture(language);
var culture = CultureInfo.CurrentCulture;
var formatted = $"{date.ToString("d", culture)} {start.ToString("t", culture)}–{end.ToString("t", culture)}";
```

## Admin validators speak Serbian

An `AbstractValidator<T>` for an admin-only model uses plain Serbian string literals. Never `Labels.*` and never English: only Serbian-speaking staff operate the admin.

```csharp
RuleFor(x => x.Name).NotEmpty().WithMessage("Ime je obavezno");
```
