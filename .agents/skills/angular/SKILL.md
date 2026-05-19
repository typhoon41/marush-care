---
name: angular
description: Conventions for all Angular and TypeScript work in this codebase — components, state, HTTP, forms, routing, styling, and i18n. Apply whenever reading, writing, or reviewing any .ts, .html, or .scss file under Site/Gmf.Marush.Care.App/.
---

# Angular / TypeScript conventions

You are working on an Angular 20 single-page application. Every rule below is non-negotiable unless explicitly overridden by the user.

## Naming

### camelCase everywhere
All TypeScript identifiers — variables, constants, functions, class members, module-level constants — use camelCase. Never `SCREAMING_SNAKE_CASE`.

```ts
// Wrong
const SLOT_HEIGHT = 36;

// Right
const slotHeight = 36;
```

### No abbreviations
Write every identifier in full. No short forms (`btn`, `img`, `el`, `evt`, `cfg`, `ctx`, `idx`, `cnt`).

Accepted acronyms only: `Id`, `Url`, `Http`, `Api`.

### One file per type
Each class, interface, type alias, or enum lives in its own `.ts` file (or `.ts` + `.html` + `.scss` trio for components). Never group multiple types in one file.

### No "utils" files
Files named `*-utils.ts`, `*Utils.ts`, `helpers.ts`, or any other catch-all label are banned. Group functions into a named abstraction that describes their domain purpose — e.g., `CalendarSlotCalculator`, not `calendar-utils`.

## Components

### Always standalone with OnPush
```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,          // implied in Angular 20, still explicit
  selector: 'marush-...',
  imports: [...],
  templateUrl: './foo.html',
  styleUrl: './foo.scss'
})
```

### Signal inputs — never `@Input()`
```ts
// Wrong
@Input() url: string = '';

// Right
readonly url = input.required<string>();
readonly description = input<string>('');
```

Use `model<T>()` only when the parent needs two-way binding.

### Control flow — never `*ngIf` / `*ngFor`
```html
<!-- Wrong -->
<div *ngIf="condition">...</div>
<li *ngFor="let item of items">...</li>

<!-- Right -->
@if (condition) { <div>...</div> }
@for (item of items; track item.id) { <li>...</li> }
```

### No `:host` — declare the host class in the decorator
```ts
// Wrong — do not write :host { ... } in the stylesheet

// Right
@Component({
  host: { class: 'my-component' }
})
```

Style the host class in the **global partials tree** under `src/styles/partials/`, not in the component's own stylesheet.

### Braces required (1tbs)
Every `if`, `for`, `while`, `switch` body must have explicit `{ }` braces. Opening `{` on the same line as the keyword.

## State management — no NgRx

Use Angular 20 signals only:

| Need | Use |
|------|-----|
| Mutable state | `signal<T>(initialValue)` |
| Derived, read-only | `computed(() => ...)` |
| Derived with mutation | `linkedSignal({ source, computation })` |
| Side effects | `effect(() => ...)` |

```ts
// Derived state that resets when source changes
protected readonly isLoading = linkedSignal({
  source: this.url,
  computation: (newValue, previous) => previous?.value !== newValue
});

// Effect that self-destructs after first run
const reference = effect(() => {
  if (this.items().length) {
    this.initialize();
    reference.destroy();
  }
}, { manualCleanup: true });
```

## HTTP

### Reactive reads — `httpResource()`
Use when data should re-fetch automatically when signal inputs change (paginated lists, detail views):

```ts
private readonly imagesRequest = httpResource<{ images: ImageDefinition[] }>(() => ({
  url: Image.filePath,
  method: 'GET'
}));
```

### Imperative mutations — `lastValueFrom()`
Use for POST/PUT/DELETE that must wait for a captcha token or be triggered by user action:

```ts
readonly createEntry = (request: EntryRequest) =>
  lastValueFrom(this.http.post<void>(`${endpoint}/entry`, request, { headers: this.headers() }));
```

Never use `subscribe()` for mutations — always `lastValueFrom()`.

## Forms

- Use `NonNullableFormBuilder` with `updateOn: 'blur'`
- Form field components live in `src/app/shared/components/forms/` and extend the `Field` base class
- The parent `FormGroup` is received via `input()`, never injected or constructed locally

```ts
export class MyInput extends Field {
  readonly form = input.required<FormGroup>();
  readonly control = input<FormControl | undefined>(undefined);
  readonly name = input<string | number>('');
  readonly validation = input<string[]>([]);
}
```

## Always use marush-* shared components

When a `marush-*` component exists for a UI pattern, use it. Never fall back to the raw HTML element.

| Need | Use |
|------|-----|
| Text / number / textarea input | `marush-input` |
| Date picker | `marush-date-picker` |
| Combobox / autocomplete | `marush-combobox` |
| Checkbox | `marush-checkbox` |
| Dynamic repeating form field | `marush-field-group` |
| Modal dialog | `marush-dialog` |
| Collapsible section | `marush-expansion-panel` |

Shared components live in `src/app/shared/components/`. Check there before reaching for a native `<input>`, `<select>`, `<textarea>`, or `<dialog>`.

## Routing

All routes are declared in `src/app/shared/routes/` via the `lazyRoute()` helper. Use `RoutingDefinition` for all programmatic navigation — never build route strings by hand.

```ts
lazyRoute('gallery', $localize`:@@routes.gallery:galerija`,
  () => import('@features/gallery/gallery-page').then(mod => mod.GalleryPage))
```

**Admin routes are auto-protected.** Any route whose path starts with `'admin'` gets `isProtected: true` and the `isUserAuthenticated` guard applied automatically. Add new admin pages to `AdminRoutes` with an `admin/` prefix.

## Path aliases

Always use path aliases — never relative `../../` imports that cross feature boundaries.

| Alias | Resolves to |
|-------|-------------|
| `@shared/…` | `src/app/shared/…` |
| `@features/…` | `src/app/features/…` |
| `@env/…` | `src/environments/…` |

## i18n

Use `` $localize`:@@key.name:default string` `` for all user-facing strings. Default strings are Serbian. After adding new keys run `npm run translate`, then add translations to `src/locale/messages.en.json` and `src/locale/messages.ru.json`.

**Admin modules (`src/app/features/admin/`) are fully exempt.** No `$localize`, no `i18n-*` attributes, no `@@` keys — use plain string literals everywhere.

**No orphaned keys.** When removing a string, delete its entry from both locale files at the same time.

## Dependencies

`air-datepicker` is pinned to **3.5.3** — do not upgrade to 3.6.0, it breaks the English locale display.

## Final checklist before every Angular/TypeScript edit

- [ ] Component is standalone with `ChangeDetectionStrategy.OnPush`
- [ ] Inputs use `input()` / `input.required()` — no `@Input()` decorators
- [ ] Templates use `@if` / `@for` — no `*ngIf` / `*ngFor`
- [ ] No `:host` in stylesheets — host class declared in decorator, styled in global partials
- [ ] State uses signals (`signal`, `computed`, `linkedSignal`, `effect`) — no NgRx
- [ ] Data reads use `httpResource()`, mutations use `lastValueFrom()`
- [ ] Programmatic navigation goes through `RoutingDefinition`
- [ ] Imports use `@shared/` or `@features/` aliases, not deep relative paths
- [ ] New admin component uses plain string literals, not `$localize`
- [ ] New i18n key added to both locale files; removed key deleted from both
- [ ] No abbreviations in any identifier; no `SCREAMING_SNAKE_CASE`
- [ ] All control-flow bodies have braces
- [ ] No `*-utils.ts` files — functions grouped into a named abstraction
- [ ] Native `<input>` / `<select>` / `<textarea>` / `<dialog>` not used where a `marush-*` component exists
