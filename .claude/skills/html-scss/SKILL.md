---
name: html-scss
description: Conventions for all HTML template and SCSS work in this codebase — styling, class naming, element structure. Apply whenever reading, writing, or reviewing any .html or .scss file under Site/Gmf.Marush.Care.App/.
---

# HTML / SCSS conventions

You are working on an Angular 20 application. Every rule below is non-negotiable unless explicitly overridden by the user.

## No inline styles

`style="..."` attributes are forbidden everywhere. All styling must live in SCSS files.

```html
<!-- Wrong -->
<div style="margin-top: 16px;">...</div>

<!-- Right -->
<div class="spaced-section">...</div>
```

## No Angular `[style.*]` bindings

Angular `[style.property]` bindings are forbidden — including `[style.--custom-property]`. All styling must live in SCSS. Use classes instead.

```html
<!-- Wrong -->
<div [style.pointer-events]="isDragging() ? 'none' : 'auto'">...</div>
<div [style.--day-column]="getDayColumn(entry.date)">...</div>

<!-- Right -->
<div [class.no-pointer-events]="isDragging()">...</div>
<div [class]="'entry-cell day-column-' + getDayColumn(entry.date)">...</div>
```

### Dynamic layout values — use SCSS `@for` loops

When a layout property (e.g., `grid-column`, `grid-row`) depends on a bounded runtime value, generate utility classes with an SCSS `@for` loop keyed to the same variables that define the grid dimensions. The template binds the correct class by name using `[class]`.

```scss
// SCSS: generate all possible column positions from the existing $days variable
@for $col from 2 through ($days + 1) {
    .day-column-#{$col} { grid-column: $col; }
}

// Generate all possible row positions from the existing $slots variable
@for $row from 2 through ($slots + 2) {
    .grid-row-#{$row}        { grid-row: $row; }
    .entry-row-start-#{$row} { grid-row-start: $row; }
    .entry-row-end-#{$row}   { grid-row-end: $row; }
}
```

```html
<!-- Template: compute and apply the correct class name -->
<div [class]="'entry-cell day-column-' + getDayColumn(entry.date)
              + ' entry-row-start-' + getEntryRowStart(entry.startTime)
              + ' entry-row-end-' + getEntryRowEnd(entry.endTime)">
</div>
```

The `[class]` string binding sets all classes for the element (replacing the dynamic portion on each change). Individual `[class.name]="condition"` bindings can be combined with it to add state-driven classes.

```html
<!-- Combining [class] string with individual [class.X] toggles -->
<div [class]="'slot-cell day-column-' + (di + 2) + ' grid-row-' + (slot.index + 2)"
     [class.drag-selected]="isSlotDragSelected(day.isoDate, slot.index)"
     [class.hour-boundary]="slot.isHour">
</div>
```

## Class naming: no "wrapper" suffix

The suffix "wrapper" is banned. Choose the suffix that describes the element's height behaviour:

| Suffix | When to use |
|--------|-------------|
| `container` | Height adapts to content (standard div behaviour) |
| `placeholder` | Height is fixed or predetermined in CSS |

```html
<!-- Wrong -->
<div class="grid-scroll-wrapper">...</div>

<!-- Right — height adapts to content -->
<div class="grid-scroll-container">...</div>

<!-- Right — height is fixed (e.g., skeleton, image slot) -->
<div class="image-placeholder">...</div>
```

## Remove unnecessary div wrappers

Do not add a div solely to attach one layout class when a better host already exists.

**Prefer the component host element.** If a component needs scroll, display, or layout behaviour, add `host: { class: 'component-name-container' }` to the component decorator and style that class in the global partials tree (`src/styles/partials/`). This eliminates the wrapper in the parent template entirely.

```ts
// Right — host carries the scroll role
@Component({
  host: { class: 'calendar-grid-container' }
})
```

```html
<!-- Wrong — unnecessary wrapper in parent -->
<div class="calendar-grid-container">
    <marush-calendar-grid />
</div>

<!-- Right — wrapper gone; host element is the container -->
<marush-calendar-grid />
```

**Exception:** a wrapper div is acceptable when it must group multiple sibling elements that have no shared semantic parent (e.g., a form section containing a label, input, and error message row).

## Host element styling

The host element must never be styled via `:host` in the component's own stylesheet — that selector is deprecated in this codebase. Instead:

1. Declare the host class in the component decorator: `host: { class: 'my-component' }`
2. Style `.my-component` in the global partials under `src/styles/partials/`

Component-specific internal structure goes in the component's own `.scss` file.

## Never use `display: grid`

CSS Grid (`display: grid`) is banned. Use these alternatives instead:

| Layout need | Use |
|-------------|-----|
| Simple row or column | `display: flex` |
| Multi-column page layout | scss-solutions `.row` + `.column-N` / `.column-tablet-N` / `.column-desktop-N` utility classes |
| 2D layout with precisely placed children | Nested flex containers (`display: flex; flex-direction: column; position: relative`) with `position: absolute` for overlapping/positioned children, combined with `@for`-generated utility classes for the variable dimension (top, height, etc.) |

### Example — 2D calendar grid without `display: grid`

```html
<div class="calendar-body">
    <div class="time-column">
        @for (slot of timeSlots; track slot.index) { <div class="time-label">...</div> }
    </div>
    @for (day of days(); track day.isoDate) {
        <div class="day-column">
            @for (slot of timeSlots; track slot.index) { <div class="slot-cell">...</div> }
            <div [class]="'entry-cell entry-top-' + getTopSlot(e.start) + ' entry-span-' + getSpan(e.start, e.end)">
            </div>
        </div>
    }
</div>
```

```scss
.calendar-body   { display: flex; }
.time-column     { display: flex; flex-direction: column; width: $time-col-width; }
.day-column      { display: flex; flex: 1; flex-direction: column; position: relative; }
.slot-cell       { height: $slot-height; }
.entry-cell      { position: absolute; left: 2px; right: 2px; }

@for $slot from 0 through $slots { .entry-top-#{$slot} { top: $slot * $slot-height; } }
@for $span from 1 through $slots { .entry-span-#{$span} { height: $span * $slot-height; } }
```

## scss-solutions utility classes — always prefer over custom CSS

These global classes are generated by the scss-solutions library and available in every template. Apply them in HTML — never re-implement their properties in SCSS.

### Layout
| Class | CSS produced |
|-------|-------------|
| `.aligned-centrally` | `display: flex; align-items: center` |
| `.center-content` | `.aligned-centrally` + `::before/::after { margin: auto }` |
| `.vertical-stack` | `flex-direction: column` |
| `.stretch-between` | `justify-content: space-between` |
| `.stretch-equally` | `justify-content: space-evenly` |
| `.stretch` | `width: 100%; height: 100%` |
| `.row` | `display: flex; flex-wrap: wrap` (grid row container) |
| `.column-N` | `flex: 0 0 auto; width: N/12 * 100%` |
| `.column-tablet-N` / `.column-desktop-N` | responsive widths |
| `.offset-N` | `margin-left: N/12 * 100%` |
| `.grow-nested-block` | `flex-basis: 0; flex-grow: 1; overflow-wrap: break-word` |

### Typography / state
| Class | CSS produced |
|-------|-------------|
| `.ellipsis` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `.clickable` | `cursor: pointer` |

### Example — combobox uses them all together
```html
<button class="preview aligned-centrally stretch-between column-12">
    <span class="selected-value ellipsis">...</span>
</button>
<ul class="dropdown clickable column-12">...</ul>
```

## Avoid re-implementing what the global `button` element already sets

The global `button` element style provides: `font-size: 14px`, `letter-spacing: 1px`, `cursor: pointer`, `font-family: 'Overpass'`. Do not repeat these on modifier classes or button-specific SCSS rules — only override the properties that actually differ.

## Shared dialog button styles live in the global dialog partial

`dialog-actions` and `line-button` (with `.primary` / `.danger` modifiers) are defined once in `src/styles/partials/core/components/dialogs/_general.scss`. Never re-declare them in component SCSS files.

## Use SCSS features to eliminate duplication

### Local variables for repeated values
```scss
// Instead of repeating the same border value six times:
$grid-border: 1px solid variables.$accent;
$slot-border: 1px solid variables.$primary;
```

### Placeholder selectors for repeated property groups
```scss
// Define once, extend everywhere it applies in the same file
%entry-content {
    line-height: 1.2;
}

.entry-time   { @extend %entry-content; font-size: 10px; }
.entry-client { @extend %entry-content; font-size: 11px; font-weight: 600; }
.entry-money  { @extend %entry-content; font-size: 10px; }
```

## SCSS module conventions

### Module imports — no aliases
Use `@use` with the module's natural name. Never shorten with `as`:

```scss
// Wrong
@use 'variables' as v;  // then: v.$font-color

// Right
@use 'variables';       // then: variables.$font-color
@use 'breakpoints';     // then: @include breakpoints.apply-from-tablet()
```

Available modules and their namespaces:

| Module | Namespace | Common use |
|--------|-----------|------------|
| `variables` | `variables.$varName` | Colors, spacing (`$expansion-panel-gap`, `$side-gaps`, etc.) |
| `breakpoints` | `@include breakpoints.apply-from-tablet()` / `apply-from-desktop()` | Responsive media queries |
| `headers` | `@include headers.marush-caption()` etc. | Typography mixins |
| `elements` | `@extend %element` / `@include elements.marush-control-frame()` | Form control frames |
| `scss-solutions/src/modules/position/absolute` | `@include absolute.unset-position()` / `absolute.zero-position()` | Absolute positioning |

### Never style a library-generated class
Classes produced by scss-solutions — `.row`, `.column-N`, `.offset-N`, `.ellipsis`, `.clickable`, `.aligned-centrally` — are applied in HTML and never used as selectors in app SCSS. Targeting one couples your styles to the library's grid and breaks the moment the markup stops needing that column width.

Add a class that says what the element *is* and style that instead:

```html
<!-- Right — semantic class alongside the layout one -->
<div class="field-container column-12">…</div>
```

```scss
// Wrong
.notes-input .column-12 { flex: 1 1 auto; }

// Right
.notes-input .field-container { flex: 1 1 auto; }
```

### Always use existing variables
Never hardcode a color or spacing value that a variable already covers.

Go further: check every literal against the variables already in scope. If a value is *consequentially correlated* with an existing variable — the same radius as the action buttons, the same gap as the fields, a value derived from one — use the variable so the two move together. If the value is shared between rules but has no variable yet, introduce a named one rather than repeating the literal.

### Responsive styles — always use breakpoint mixins
Never write bare `@media` queries:

```scss
// Wrong
@media (min-width: 930px) { ... }

// Right
@include breakpoints.apply-from-tablet() { ... }
@include breakpoints.apply-from-desktop() { ... }
```

### Absolute positioning — always use the mixin
```scss
// Wrong
position: absolute;
top: 100%;
right: 0;
left: 0;

// Right — args are (top, right, bottom, left); unset is the default
@include absolute.unset-position(100%, 0, unset, 0);
```

## Final checklist before every HTML/SCSS edit

- [ ] No `display: grid` — use flex, scss-solutions `.row`/`.column-N`, or nested flex + absolute
- [ ] scss-solutions utility classes applied in HTML — `.ellipsis`, `.clickable`, `.aligned-centrally`, `.vertical-stack`, `.stretch-between`, `.row`/`.column-N` — not re-implemented in SCSS
- [ ] Global `button` properties not re-declared in modifier classes (`font-size`, `letter-spacing`, `cursor`, `font-family`)
- [ ] Repeated values extracted to local SCSS variables; repeated property groups extracted to `%placeholder` selectors
- [ ] Shared dialog styles (`dialog-actions`, `line-button`) come from global partials, not per-component SCSS
- [ ] No `style="..."` inline attributes
- [ ] No `[style.property]` or `[style.--custom-property]` bindings — use `[class]` with SCSS-generated classes
- [ ] Dynamic layout positions (grid-column, grid-row) use `@for`-generated utility classes, not style bindings
- [ ] No "wrapper" suffix — use "container" (dynamic height) or "placeholder" (predetermined height)
- [ ] No unnecessary div wrappers — consider using the host element or merging into an existing parent
- [ ] Host element class declared in decorator, styled in global partials (not in `:host`)
- [ ] State-driven style changes (pointer-events, visibility, colour) use `[class.state-name]` + SCSS
- [ ] `@use` imports use the module's natural name — no `as v` or other aliases
- [ ] No library-generated class (`.row`, `.column-N`, `.ellipsis`, …) used as a selector in app SCSS
- [ ] Literals checked against the variables in scope; correlated values use the variable, shared values get a named one
- [ ] No hardcoded colors or spacing — use `variables.$xxx`
- [ ] Responsive rules use `@include breakpoints.apply-from-tablet/desktop()` — no bare `@media`
- [ ] `position: absolute` with edge values uses `@include absolute.unset-position()` or `absolute.zero-position()`
