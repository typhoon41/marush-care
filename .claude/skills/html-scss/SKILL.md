---
name: html-scss
description: Marush-specific SCSS facts on top of conventions:html-scss and conventions:scss-solutions - the app's SCSS modules, global button defaults, shared dialog styles, where routed-page host classes are styled. Apply whenever reading, writing, or reviewing any .html or .scss file under Site/Gmf.Marush.Care.App/.
---

# Marush HTML / SCSS

The rules come from `conventions:html-scss`, `conventions:scss-solutions` and `conventions:angular`. This skill adds only what is specific to this application.

## SCSS modules

| Module | Namespace | Common use |
|--------|-----------|------------|
| `variables` | `variables.$name` | Colours, spacing (`$expansion-panel-gap`, `$side-gaps`, ...) |
| `breakpoints` | `@include breakpoints.apply-from-tablet()` / `apply-from-desktop()` | Responsive rules |
| `headers` | `@include headers.marush-caption()`, ... | Typography mixins |
| `elements` | `@extend %element` / `@include elements.marush-control-frame()` | Form control frames |
| `scss-solutions/src/modules/position/absolute` | `@include absolute.unset-position()` / `zero-position()` | Absolute positioning |

Feature-local variable modules take a full-word alias, the same everywhere: `@use './calendar-grid-variables' as grid`, `@use '../calendar-variables' as calendar`.

## Global styles already set

- The global `button` element sets `font-size: 14px`, `letter-spacing: 1px`, `cursor: pointer` and `font-family: 'Overpass'`. Don't repeat them on button classes.
- `dialog-actions` and `line-button` (with `.primary` / `.danger`) are defined once in `src/styles/partials/core/components/dialogs/_general.scss`. Never redeclare them in a component stylesheet.
- Routed page components have no parent template, so their host classes are styled in the global partials under `src/styles/partials/`.
