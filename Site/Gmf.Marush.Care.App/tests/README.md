# Frontend characterization tests

These tests pin what the Angular app does today, so a framework upgrade can prove it changed nothing. They assert current
behaviour, including odd behaviour: a value that looks wrong stays pinned until someone decides to change it, and then the
test changes in the same commit.

## Unit specs (`src/**/*.spec.ts`)

Run by the Angular unit-test builder (`@angular/build:unit-test`, runner `vitest`, jsdom environment), configured as the
`test` target in `angular.json`.

```bash
npm run test -- --watch=false                      # one headless run
npm run test -- --watch=false --reporters=junit    # JUnit XML on stdout
npm run test -- --include=src/app/shared/pipes/money.spec.ts
```

- `tests/unit/test-providers.ts` gives every TestBed the app's zoneless change detection and the `sr` locale.
- `tests/unit/localize-setup.ts` loads `$localize`; the builder compiles without localization, so messages resolve to
  their Serbian source text.
- `pretest`/`posttest` delete `dist/test-out`, the builder's bundle folder, so `npm run lint:ci` does not lint it.

To add a case: put the spec next to the unit it covers, name the business rule it pins (`RULE-NNN`, from
`analysis/marush/BUSINESS_RULES.md`) at the start of the `it` title, and use literal inputs and outputs. Specs share the
app's ESLint rules; the only suppression a spec takes is the one-line header for `no-magic-numbers` and
`max-lines-per-function`.

## SSR smoke recorder (`tests/ssr/`)

Independent of the Angular version: it starts the BUILT server (`dist/server/server.mjs`) on a free port and requests
every route of every locale under four Host headers (`localhost`, `marushcare.com`, `test.marushcare.com`,
`evil.example`). For each answer it records the status, redirect location, `<html lang>`, `<title>`, meta description,
canonical link, first `<h1>`, the `ng-server-context` value and whether the page was server-rendered.

```bash
npm run build -- --configuration=production   # the recorder never builds
npm run test:ssr:record                       # writes tests/ssr/baseline.json; only from the reference build
npm run test:ssr                              # node --test: compares a fresh capture with the baseline
```

The route list is derived, not hand-written: locales come from `angular.json`, paths from the `lazyRoute(...)`
declarations in `src/app/shared/routes/*.ts` and their `@@routes.*` messages in `src/locale/messages*.json`, error pages
from the `routes.error.*` messages. Adding a route therefore shows up as a `+` line in the verify diff. A missing build or
baseline fails the run; it never passes by skipping. The server process is stopped in a `finally`, and on process exit.

When a difference is intended (an accepted upgrade change), re-record the baseline in the same commit and say why in
the commit message.
