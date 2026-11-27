# Delta catalog: marush (Angular 20.3 → 22.3, TypeScript 5.9 → 6.0, Node 22.20 → 26; .NET stays 10)

- **Date:** 2026-11-27
- **Produced by:** the version-delta-analyst agent.
- **Where it ran:** migrations were applied to a scratch copy only (`$CLAUDE_JOB_DIR/tmp/delta/Gmf.Marush.Care.App`, commits `init`, `v21`, `v22`). Nothing under `legacy/marush` was modified.
- **What ran:** `tsc --noEmit`, eslint and stylelint. No `ng build` and no tests were run (none exist).
- **Sources:**
  - Angular changelog 21.0.0 / 22.0.0 (github.com/angular/angular/blob/main/CHANGELOG.md)
  - Angular CLI changelog (github.com/angular/angular-cli/blob/main/CHANGELOG.md)
  - TypeScript 6.0 release notes (devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
  - Node 26 changelog (github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V26.md)
  - Express History.md
  - npm registry (`npm view`) and the NuGet flat-container API
- **Unverified:** `angular.dev/update-guide` could not be fetched (it is a JS-rendered page), so anything only it would say is unverified.

## Deltas

| ID | Unit | What changes | Evidence here | Auto? | Manual fix | Risk |
|---|---|---|---|---|---|---|
| DELTA-001 | Node/CI/runtime | Angular 22 engines are `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`. CLI 22 hard-fails on 22.20.0 (reproduced: "The Angular CLI requires a minimum Node.js version of v22.22.3…"). Angular 21 still accepts `^22.12.0`. | `Deployment/Templates/build.yaml:19` `NodeVersion: 22.20.0` | No | Pin 26.x before the Angular 22 cut | H |
| DELTA-002 | Node/CI/runtime | Production SSR runs whatever `node` is on the IIS host's PATH. | `Site/Gmf.Marush.Care.Api/Services/NodeJsRunnerService.cs:40-41` | No | Install Node 26 on the test and prod IIS hosts before deploying the v22 bundle | H |
| DELTA-003 | TS config | TS 6 deprecates `baseUrl`, giving error TS5101 (reproduced: `tsconfig.app.json(4,3): error TS5101: Option 'baseUrl' is deprecated…`). No ng-update schematic handles it. | `tsconfig.json` `"baseUrl": "./"` plus `paths` | No (`@andrewbranch/ts5to6` 1.1.1 exists, not run) | Remove `baseUrl` and prefix each `paths` entry with `./`. Verified on scratch: `tsc -p tsconfig.app.json --noEmit` was clean afterwards. Do not use `ignoreDeprecations` (TS 7 removes it). | H (build break) |
| DELTA-004 | TS config + Angular framework | `@angular/build` 21.2.31 peers `typescript >=5.9 <6.0`; 22.3.0 peers `>=6.0 <6.1`. TS 6 cannot land before Angular 22 and must land with it; `ng update` set `~6.0.3`. Other TS 6 defaults (`types:[]`, `noUncheckedSideEffectImports`, `rootDir`) don't hit: `tsconfig.app.json` sets `types:["node"]`, and there are no side-effect imports. | `package.json` `typescript ~5.9.2` | Yes (ng update) | None beyond DELTA-003 | M |
| DELTA-005 | SSR server | v22: a failed host validation returns **400** instead of falling back to client-side rendering (CLI changelog 22.0.0 @angular/ssr). The allowlist comes from `allowedHosts` or `NG_ALLOWED_HOSTS` (`@angular/ssr` 22 `node.mjs:133`). With no list, every public host gets 400. | `src/server.ts:6`; no `security` block in `angular.json`; IIS rewrites to `localhost` (`Site/Gmf.Marush.Care.Api/web.config:57`) | No | Apply the security patch's `security.allowedHosts` first (the v22 schema accepts it); confirm which Host value ARR forwards | **H** |
| DELTA-006 | SSR server | The v22 migration "Add 'trustProxyHeaders'" rewrote `new AngularNodeAppEngine()` to trust `x-forwarded-host` and `x-forwarded-proto` and added a `// TODO:` comment. This is a security decision, and the new lint fails on it (`no-warning-comments`, `comma-dangle`). | `src/server.ts:6` | Yes (adds it) | Human decision: keep the trust only if ARR sets those headers; drop the TODO | M |
| DELTA-007 | Angular framework | **Behavioral-silent.** The v22 "Migrate broken duplicate outputs" step converts `model()` plus an explicit `xChange` output into `input({alias})` + `linkedSignal`. Before: `.set()` plus an explicit `emit` fired the change event **twice**; now it fires once. It also adds `*Input` fields, 2× `no-input-rename` and 4× `object-curly-spacing`. | `src/app/features/services/type-selector/type-selector.ts:18`, `src/app/shared/components/navigation/hamburger/button.ts:13`; consumer `[(selectedService)]` at `src/app/features/services/services-page.html:2` | Yes | Review; tune the result for lint and conventions | M |
| DELTA-008 | Angular framework | **Behavioral-silent.** v22 template `?.` yields `undefined` instead of `null`. The migration wrapped one site in `$safeNavigationMigration(...)` and added `extendedDiagnostics` suppressions (`nullishCoalescingNotNullable`, `optionalChainNotNullable`) to `tsconfig.app.json`. Unwrapped sites (falsy either way): `src/app/shared/components/forms/combobox/combobox.html:3,7,19,23` and `src/app/shared/components/pagination/table/table-pagination.html:24`. | `src/app/features/gallery/gallery-page.html:19` | Yes | Accept the wrapper, or remove it after checking whether the image-loader input treats null and undefined differently | L-M |
| DELTA-009 | Angular framework | v21's control-flow migration removed `CommonModule` from 19 components (none use its pipes or directives) and left an empty first line in each. | e.g. `src/app/application.ts:1`, `src/app/shared/components/navigation/menu/menu.ts:1` | Yes | Delete the blank lines | L |
| DELTA-010 | Angular framework | v22 deprecates `withFetch` (fetch is the default backend) and `withIncrementalHydration` (on by default). No behavior change, but `@typescript-eslint/no-deprecated` errors break `lint:ci`. | `src/app/application-configuration.ts:17,20` | No | Remove both calls | M (CI) |
| DELTA-011 | In-house lint | `@typhoon41/eslint-config-angular` 1.1.1 → 1.2.0 brings ESLint 10.16, angular-eslint 22.8.0 and typescript-eslint 8.74 (TS `<6.1`). angular-eslint needs `@angular-devkit/core >=22 <23`, so this **must follow Angular 22**. The base config `@typhoon41/eslint-config` 1.2.0 drops `eslint-plugin-import`. New rules include `inject-at-top`, `prefer-service-decorator`, `no-global-document`, `reactive-context-must-read-signal`, template `no-non-null-assertion` and `@typescript-eslint/prefer-readonly`. On the v22 scratch copy: **107 errors in 44 files**. | `eslint.config.js:1-2`; e.g. `src/app/features/admin/calendar/calendar-cell-summary.ts:21`, `calendar-page.ts:95` | No | Fix the violations or tune the config (open question) | **H** (CI gate) |
| DELTA-012 | In-house style | `@typhoon41/stylelint-config` 1.1.2 → 1.2.0 brings stylelint 18.1 (Node `^22.22.2 \|\| ^24.15 \|\| >=26`). Stylistic rules move to `@stylistic/scss/*`, so existing disable comments stop working (5× `@stylistic/scss/max-line-length`). The smacss property-order rule is silently **dropped**. | Disable comments at `src/styles/partials/core/elements/_input.scss:1` and `src/styles/partials/core/states/typography/_fonts.scss:1`; errors at `_input.scss:11` and `_fonts.scss:23,31,39,47` | No | Rename the directives to `@stylistic/scss/max-line-length` | M |
| DELTA-013 | In-house style | **Behavioral-silent candidate.** `@typhoon41/scss-solutions` 0.2.1 → 0.2.4 declares engines `node >=24` (npm only warns). `set-up()` now uses `string.quote('#{$breakpoint}')`, and `ScreenSize` reads the `body::before` `content`. Compiling `set-up()` against the app's variables with both versions gives identical `content` values (mobile/tablet/desktop) and media queries; only the stylelint comments disappear from the CSS. | `src/styles/partials/vendors/libraries/scss-solutions/_general.scss:4`, `src/app/shared/services/screen-size.ts:15-16` | No | None | L |
| DELTA-014 | Test harness | There are no tests and no `test` target, so `npm test` (`ng test`) has nothing to run. Angular 21/22 offers `@angular/build:unit-test` with Vitest (peer `^4.0.8 \|\| ^5.0.0` in 22) or Karma `^6.4`; v22 removed the experimental jest and web-test-runner builders. `JavaScriptTestFramework=Jest` in the esproj is stale. | `package.json` `"test": "ng test"`; `Site/Gmf.Marush.Care.App/Gmf.Marush.Care.App.esproj` | No | See the order below | M |
| DELTA-015 | Node/CI/runtime | `@types/node` 22.13.8 → 26.6.11. Node 26 makes `localStorage` undefined unless a storage file is given; only browser paths use it (`afterNextRender`, admin pages under the `'**'` Client render mode). | `src/app/shared/services/authentication.ts:19-21` | No | Bump `@types/node` | L |
| DELTA-016 | Angular framework / SSR | Checked, with no impact found: v22 default OnPush (all 49 components set it explicitly; the migration made no changes); `paramsInheritanceStrategy` `'always'` (routes are flat); `data-` input binding (only `[attr.data-*]` is used); dev-server `PORT` priority (`start:aspire` passes the same `$PORT`); express 5.3 (only `static` and `use`). | `src/app/shared/routes/routes.ts:23-47`, `package.json` scripts | n/a | None | L |
| DELTA-017 | .NET (out of scope) | Unaffected by the frontend/Node move. Behind but not bumped: Microsoft.AspNetCore.* 10.0.14 → 10.0.15; `Microsoft.VisualStudio.JavaScript.Sdk` 1.0.2752196 → 1.0.7204101; Autofac 9.0.0 → 9.3.4; OpenTelemetry.Instrumentation.AspNetCore 1.15.2 → 1.21.0. Aspire 13.6.5 is the latest 13.x (17.0.0 exists); MessagePack 2.5.307 is the latest 2.x (3.1.12 exists). | `Directory.Packages.props` | n/a | Don't bump in this uplift | L |

(Paths without a prefix are relative to `Site/Gmf.Marush.Care.App/`.)

## Migration tools and what they reported

- **`ng update` (list mode):** "@angular/cli 20.3.4 -> 21.2.9 … @angular/core 20.3.3 -> 21.2.9"; it installed 21.2.31 / 21.2.26. On CLI 20, `ng version` reported "Node: 26.13.1 (Unsupported)", a warning only.
- **`--dry-run`:** "Error: Unknown argument: dry-run". There is no report-only mode, so the update was applied on the scratch copy instead.
- **To 21:**
  - Most migrations reported "No changes made" (BootstrapContext, `ApplicationConfig` import, `moduleResolution`, `lib`).
  - The control-flow migration changed 19 files.
  - Optional migrations: `router-current-navigation` (not used here) and `use-application-builder` (already done).
- **To 22:**
  - No changes from canMatch, `ChangeDetectionStrategy.Eager`, `withXhr` or `withNoIncrementalHydration`.
  - Changes made: duplicate outputs (2 files), safe-navigation (1), extended diagnostics (`tsconfig.app.json`), `trustProxyHeaders` (`server.ts`).
  - Optional: `migrate-karma-to-vitest`.
  - The post-update list says "everything seems to be in order".
- **`ts5to6`:** available on npm, not run; TS5101 was fixed by hand instead.
- **ESLint 10 / stylelint 18:** executed (DELTA-011, DELTA-012). ESLint 10 removed the `unix` formatter, which no script uses.
- **Not covered:** `ng build` was not run on the scratch copy, so template-level compile errors are not covered. `dotnet list package --outdated` was not run (it restores into the tree), so NuGet versions were queried over the API.

## Recommended order (build-graph leaf-first, with overrides)

0. **Prerequisite: apply `security_remediation.patch`.** It touches the same `package.json` and `package-lock.json` lines that `ng update` rewrites, so applying it later conflicts. It is also the only source of `allowedHosts`.
1. **Test harness first (override).** Most silent risk sits at the SSR/HTTP level. Build an SSR smoke characterization that doesn't depend on the Angular version: for each locale route, request it with the production Host and with the localhost Host, and record the status, `<html lang>`, title and meta, and the localized first heading. Run it against the 20.3 baseline. A Vitest `unit-test` target is optional and can come in step 4.
2. **Node/CI/runtime:** pin Node 26 in CI and on dev machines, install it on the IIS hosts, and bump `@types/node`. Angular 20.3 runs on Node 26 with only a warning.
3. **In-house style:** `@typhoon41/stylelint-config` 1.2.0 and `@typhoon41/scss-solutions` 0.2.4. They need Node from step 2 and nothing from Angular.
4. **Angular 21** (stays on TS 5.9).
5. **Coordinated cut (override):** Angular 22, TS 6.0, the tsconfig `baseUrl` change and the SSR host/proxy config (DELTA-001, -003, -004, -005). None of these can ship separately.
6. **In-house lint:** `@typhoon41/eslint-config-angular` 1.2.0, which needs devkit 22, plus the 107 fixes. It can join step 5's PR to keep CI lint green on every merge.

**Pilot unit:** step 3, the in-house style packages. They are small and independent of Angular, verified on scratch (2 directive renames, identical breakpoint CSS), and exercise the toolkit release flow.

## Open questions

1. Does IIS ARR keep the public Host on the rewrite to `localhost:<ssrPort>`, or send `localhost` and add `X-Forwarded-Host`? This decides the `allowedHosts` list and whether to keep `trustProxyHeaders` (DELTA-005/006).
2. Who upgrades Node on the test and prod IIS hosts, and is the target 26 or 24.15 LTS?
3. Fix all 107 new lint violations, or tune the in-house config first? `inject-at-top` (42 hits) and `prefer-service-decorator` (11 hits) may clash with project conventions.
4. Is losing smacss property ordering (stylelint-config 1.2.0) acceptable?
5. Test harness: SSR smoke only, or Vitest via `@angular/build:unit-test` as well? Should the stale esproj Jest setting be removed?
6. Accept the v22 migration output as is (the `$safeNavigationMigration` wrapper, `*Input` aliases, `extendedDiagnostics` suppressions), or clean it up in the same cut?
