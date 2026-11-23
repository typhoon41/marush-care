---
name: angular
description: Marush-specific Angular facts on top of conventions:angular and conventions:typescript - marush-* shared components, form fields, routing, path aliases, i18n locale files, admin exemptions, pinned dependencies. Apply whenever reading, writing, or reviewing any .ts or .html file under Site/Gmf.Marush.Care.App/.
---

# Marush Angular

The rules come from `conventions:code-design`, `conventions:typescript` and `conventions:angular`. This skill adds only what is specific to this application.

## Components

- The selector prefix is `marush-`.
- `BasePage` injects its own dependencies (`Stapler`), so pages extending it don't inject them again.
- Dialog actions share loading, error and dismissal handling through `DialogOperation`. Reuse it rather than writing another.

## Shared components first

When a `marush-*` component exists for a UI pattern, use it instead of the native element. They live in `src/app/shared/components/`.

| Need | Use |
|------|-----|
| Text / number / textarea input | `marush-input` |
| Date picker | `marush-date-picker` |
| Combobox / autocomplete | `marush-combobox` |
| Checkbox | `marush-checkbox` |
| Dynamic repeating form field | `marush-field-group` |
| Modal dialog | `marush-dialog` |
| Collapsible section | `marush-expansion-panel` |

## Forms

Form field components live in `src/app/shared/components/forms/` and extend `Field`. Its `get` accessors and those of its subclasses (`Field.required`, `Input.maxLength`, `ComboBox.invalid`, `Autocomplete.maxLength`) read reactive-forms state, which isn't signal-based. The TODO in `field.ts` keeps them for now. Don't copy the pattern, and ask before converting them.

## Routing

- Routes are declared in `src/app/shared/routes/` through `lazyRoute()`. Programmatic navigation goes through `RoutingDefinition`.
- A route whose path starts with `admin` gets `isProtected: true` and the `isUserAuthenticated` guard automatically. Add admin pages to `AdminRoutes` with the `admin/` prefix.

```ts
lazyRoute('gallery', $localize`:@@routes.gallery:galerija`,
  () => import('@features/gallery/gallery-page').then(module => module.GalleryPage))
```

## Path aliases

| Alias | Resolves to |
|-------|-------------|
| `@shared/…` | `src/app/shared/…` |
| `@features/…` | `src/app/features/…` |
| `@env/…` | `src/environments/…` |

## i18n

- Default strings are Serbian. After adding keys, run `npm run translate`, then translate in `src/locale/messages.en.json` and `src/locale/messages.ru.json`. A removed key leaves both files in the same change.
- `src/app/features/admin/` is exempt: no `$localize`, no `i18n-*` attributes, no `@@` keys. Use plain Serbian literals and skip `npm run translate` for admin-only changes.

## Dependencies

`air-datepicker` is pinned to **3.5.3**. Don't upgrade to 3.6.0: it breaks the English locale display.
