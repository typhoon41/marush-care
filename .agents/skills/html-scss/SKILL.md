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

## Final checklist before every HTML/SCSS edit

- [ ] No `style="..."` inline attributes
- [ ] No `[style.property]` or `[style.--custom-property]` bindings — use `[class]` with SCSS-generated classes
- [ ] Dynamic layout positions (grid-column, grid-row) use `@for`-generated utility classes, not style bindings
- [ ] No "wrapper" suffix — use "container" (dynamic height) or "placeholder" (predetermined height)
- [ ] No unnecessary div wrappers — consider using the host element or merging into an existing parent
- [ ] Host element class declared in decorator, styled in global partials (not in `:host`)
- [ ] State-driven style changes (pointer-events, visibility, colour) use `[class.state-name]` + SCSS
