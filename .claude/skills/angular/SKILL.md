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
Write every identifier in full. No short forms (`btn`, `img`, `el`, `elem`, `evt`, `cfg`, `ctx`, `idx`, `cnt`, `ref`, `val`, `fn`, `cb`, `cdr`).

Accepted acronyms only: `Id`, `Url`, `Http`, `Api`.

This covers injected dependencies and constructor parameters as much as locals: `changeDetector`, never `cdr`; `elementReference`, never `elRef`. An abbreviation already sitting in a file you are editing is not grandfathered - rename it in the same change.

### One file per type
Each class, interface, type alias, or enum lives in its own `.ts` file (or `.ts` + `.html` + `.scss` trio for components). Never group multiple types in one file.

### No grab-bag modules
A `.ts` file holds **one named abstraction**. A file that accumulates unrelated exports — a form builder next to a date formatter next to a request mapper — is a bag, not a module, and must be split by responsibility. The file name has to describe the abstraction, never that it is a collection.

Prefer a class over a pile of `export const` / `export function`. When several functions share a subject, that subject is the abstraction:

```ts
// Wrong - calendar-week-navigator.ts
export const mondayOf = (date: Date) => ...;
export const addDays = (isoDate: string, days: number) => ...;
export const toSerbianDate = (isoDate: string) => ...;
export const fromSerbianDate = (serbian: string) => ...;

// Right - calendar-date.ts
export class CalendarDate {
    static readonly mondayOf = (date: Date): CalendarDate => ...;
    static readonly fromSerbian = (serbian: string): CalendarDate => ...;
    readonly serbian: Signal<string> = computed(() => ...);
    readonly addDays = (days: number): CalendarDate => ...;
}
```

### Rich models, not anemic ones
A model owns the values derived from its own data. Do not ship a bare data class plus a folder of functions that operate on it, and do not compute those values in the template.

```ts
// Wrong - the template decides
{{ day.isPast ? 'Zarada' : 'Očekivana zarada' }}

// Right - the model answers, as a signal
readonly earningsLabel: Signal<string> = computed(() => this.isPast ? pastEarningsLabel : expectedEarningsLabel);
```

### Signals, never getters
Derived state on any class - component, model or immutable value object - is a `computed()` signal. Never write a `get` accessor.

```ts
// Wrong
get label(): string {
    return `${this.start.format(shortDateFormat)} – ${this.lastDay.format(shortDateFormat)}`;
}

// Right
readonly label: Signal<string> = computed(() =>
    `${this.start.format(shortDateFormat)} – ${this.lastDay().format(shortDateFormat)}`);
```

- Source values stay plain `readonly` fields or `signal()`s; everything derived from them is `computed()`.
- A private mutable flag exposed through a getter is a `signal()` exposed with `.asReadonly()`.
- Call sites invoke the signal: `week.label()`. A bare `week.label` is an always-truthy object and silently breaks boolean checks.
- The `get` accessors in `shared/components/forms/field.ts` and its subclasses read reactive-forms state, which is not signal-based; they are parked by the TODO there. Do not copy that pattern and do not add to it.

### Functions are arrow-function properties
Every function on a class is a property holding an arrow function. Never a method declaration, and never a mix of the two in one class.

```ts
// Wrong - two styles in one class
static mondayOf = (date: Date): CalendarDate => ...;
addDays(days: number): CalendarDate { ... }

// Right
static readonly mondayOf = (date: Date): CalendarDate => ...;
readonly addDays = (days: number): CalendarDate => ...;
private readonly shiftedBy = (days: number): WorkingWeek => ...;
```

- Instance functions are `readonly name = (...) => ...`; static ones are `static readonly name = (...) => ...`. `readonly` is always present.
- The only method-syntax members are the `constructor` and Angular lifecycle hooks (`ngOnInit`, `ngOnDestroy`), which the framework reads from the prototype.
- A helper that serves one class is a `private static readonly` member of that class, not a module-level `const` beside it. Never alias a module function into a class (`static toTime = toTime`).
- Order members the same way in every class: statics, then state and signals, then the constructor, then functions.

### Search before you add
Before writing a constant, a formatting expression or a rule, search the feature for one that already exists. The second copy is the defect.

- A magic value needed in two files lives once, on the model that owns the concept (`CalendarTimeSlots.unset`, not `const unsetSlot = -1` in each file).
- An object built the same way in several places gets a factory on its class (`TimeInterval.of(entry)`, not `new TimeInterval(entry.startTime ?? '', entry.endTime ?? '')` six times).
- A business rule checked by both a validator and an error signal is written once and called from both (`EntryFormValue.lacksClient`).
- Two components that derive the same string from the same data take it from the model (`interval.range()`).

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

Style the host class in the stylesheet of the **component whose template renders the element** — the host carries that parent's encapsulation attribute, so the parent's styles match it and stay in its lazy bundle. Only routed page components, which have no parent template, are styled in the global partials under `src/styles/partials/`. Never in the component's own stylesheet.

### Braces required (1tbs)
Every `if`, `for`, `while`, `switch` body must have explicit `{ }` braces. Opening `{` on the same line as the keyword; the body and closing `}` each on their own line. Never write the body on the same line as the braces.

```ts
// Wrong
if (!entry) { return; }

// Right
if (!entry) {
    return;
}
```

### No conditional expressions in templates
A template renders; it does not decide. No ternaries, no `&&` / `||`, no comparisons, no non-null assertions inside a binding or interpolation. Move the expression into a `computed()` or onto the model and bind the result.

```html
<!-- Wrong -->
<marush-dialog [title]="editingEntry() ? 'Termin' : 'Novi termin'">
@if (weeklyTotal() > 0) { ... }
<p>{{ weeklyNote()!.content }}</p>

<!-- Right -->
<marush-dialog [title]="title()">
@if (hasWeeklyTotal()) { ... }
<p>{{ weeklyNoteContent() }}</p>
```

`@if` / `@for` on a boolean signal or a collection is control flow, and stays.

### No `ChangeDetectorRef`
The application is zoneless and every component is OnPush, so the view updates only when a signal it reads changes. Never inject `ChangeDetectorRef`, and never call `detectChanges()` or `markForCheck()`: needing either means some state the template reads is not a signal. Make it one.

When code has to touch the DOM after a state change has been rendered - moving focus into a list that has just been expanded - schedule it with `afterNextRender`, passing the injector when called outside an injection context:

```ts
// Wrong
this.isExpanded = true;
this.cdr.detectChanges();
this.focusSelected();

// Right
this.isExpanded.set(true);
afterNextRender(() => this.focusSelected(), { injector: this.injector });
```

### Extract duplicated dialog actions
When `onSave` and `onDelete` (or any pair of dialog actions) share their loading, error and dismissal handling, that shared body goes into a private function property. If it carries state — a loading flag, a failure flag — give it its own abstraction (`DialogOperation`, which also dismisses the dialog on success) rather than repeating the `try`/`catch`/`finally` in each.

Every awaited call in a dialog action needs a `catch`. A `try`/`finally` with no `catch` leaves an unhandled rejection, an open dialog and no feedback to the user.

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
- [ ] No `:host` in stylesheets — host class declared in decorator, styled by the stylesheet of the template that renders it (global partials only for routed pages)
- [ ] State uses signals (`signal`, `computed`, `linkedSignal`, `effect`) — no NgRx
- [ ] Data reads use `httpResource()`, mutations use `lastValueFrom()`
- [ ] Programmatic navigation goes through `RoutingDefinition`
- [ ] Imports use `@shared/` or `@features/` aliases, not deep relative paths
- [ ] New admin component uses plain string literals, not `$localize`
- [ ] New i18n key added to both locale files; removed key deleted from both
- [ ] No conditional expressions in templates — ternaries and comparisons moved to `computed()` or the model
- [ ] Each `.ts` file holds one named abstraction; no grab-bag of unrelated exports
- [ ] Derived values live on the model, not in the template or a companion function
- [ ] No `get` accessors - derived state is `computed()`, and every call site invokes it with `()`
- [ ] Every class function is a `readonly` arrow-function property (`static readonly` for statics); no method declarations beside the constructor and lifecycle hooks; no module-level helper beside a class
- [ ] No `ChangeDetectorRef`, `detectChanges()` or `markForCheck()` - template state is a signal, post-render DOM work uses `afterNextRender`
- [ ] Searched the feature for an existing constant, factory or rule before adding one; nothing is declared twice
- [ ] Dialog actions share their loading/error handling via a private function property or a dedicated abstraction, and every one has a `catch`
- [ ] No abbreviations in any identifier, including injected dependencies and names already in the file; no `SCREAMING_SNAKE_CASE`
- [ ] All control-flow bodies have braces
- [ ] Native `<input>` / `<select>` / `<textarea>` / `<dialog>` not used where a `marush-*` component exists
