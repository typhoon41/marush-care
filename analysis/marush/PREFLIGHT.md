# Preflight: marush

- **Date:** 2026-11-27
- **Target:** "Angular 22, Node 26, .NET 10" (from INTENT.md)
- **Source:** `legacy/marush` is a junction to `C:\Users\Nizzo\Desktop\Marush\.claude\worktrees\modernize-marush`, the repository root of this worktree (branch `worktree-modernize-marush`). It is excluded from git through `.git/info/exclude`. **It contains itself** (`legacy/marush/legacy/marush/...`), so any tool that walks `legacy/marush` must exclude `legacy/`, or it will loop.

## Answers

1. **Scope**: is this code the complete system, or one slice of a larger codebase?
   > "Complete system"
2. **Build & test locally**: can this environment restore, build and run the tests? How long is CI?
   > "Yes, pipeline <15 min"
   (Note: there are no tests to run; see Check 3.)
3. **Bespoke build infrastructure**:
   > "there are npm util packages that should also be bumped (all of them), the most of scss depends on them"
   (These are the `@typhoon41/*` packages: `eslint-config-angular`, `scss-solutions` and `stylelint-config`, all on the public npm registry. See Check 3a.)
4. **Prior attempts**:
   > "No prior attempts"
5. **Off limits**:
   > "Nothing off limits"

## Scope boundary (Check 6)

Standalone repository (`github.com/typhoon41/marush-care`). `legacy/marush` is its root. Every `ProjectReference` resolves inside the repo (`Packages/Gmf.*`, `Site/*`, `Gmf.Marush.Care.Host`), and there are no inbound consumers outside it. The answer to question 1 agrees.

## Checks

| # | Check | Status | Found | Fix |
|---|---|---|---|---|
| 0 | Human answers | ✅ | All five answered (above) | — |
| 1 | Stack | ✅ | 652 tracked files. C# on .NET 10 (208 `.cs`, 8 csproj, `.slnx`): ASP.NET Core API, EF Core on SQL Server, Autofac, Aspire 13.6.5 host. Angular 20.3 SSR SPA (151 `.ts`, 54 `.html`, 133 `.scss`) using `@angular/ssr` and Express 5, built with `@angular/build`. Azure Pipelines YAML. A `Microsoft.VisualStudio.JavaScript.Sdk` `.esproj` wraps the app (its build is a no-op). | — |
| 2 | Analysis tools | ⚠️ | `python` 3.15.2 ✅ (`python3` on PATH is the Windows Store stub; use `python` or `py -3`). `scc` ❌, `cloc` ❌, `lizard` ❌. | `winget install --id benboyter.scc` (or `scoop install scc`); `python -m pip install lizard`. Without them, assess falls back to `find` + `wc` and keyword counts. |
| 3a | Build definition | ✅ | `Deployment/Templates/build.yaml` pins **Node 22.20.0** and **.NET 10.0.x** and runs `npm ci` → `lint:ci` → `ng build --configuration=production` → `dotnet restore -r win-x64` → `dotnet build -c Release`. The EF bundle comes from `dnx dotnet-ef@10.0.*`. Public feeds only (no `nuget.config` or `.npmrc`). Central package versions in `Directory.Packages.props` (transitive pinning on, lock files on). `TreatWarningsAsErrors` and analyzers at `latest`. **Bespoke:** the `@typhoon41/*` npm packages are installed at `eslint-config-angular` 1.1.1, `scss-solutions` 0.2.1 and `stylelint-config` 1.1.2; npm's newest are 1.2.0, 0.2.4 and 1.2.0, all published 2026-11-26/27. `air-datepicker` is pinned at 3.5.3 on purpose ("DO NOT UPDATE … 3.6.0, it shows Russian language when English is set"). | The uplift must bump all `@typhoon41/*` packages (answer 3). Keep the `air-datepicker` pin. Update the `NodeVersion` pin in CI and the Node 22.20.0 in CLAUDE.md to 26. |
| 3b | Legacy smoke test (Level 2) | ✅ | On a clean `git archive` copy: **.NET**, `dotnet restore -r win-x64` + `dotnet build -c Release` → 8 projects, 0 warnings, 0 errors (223 s, SDK 11.0.100). **Angular**, `npm ci` (903 packages) + `lint:ci` (0 errors, 1 TODO warning) + production build → success (346 s, Node 26.13.1, npm 11.20.0). npm 11.20 skipped install scripts for `esbuild`, `lmdb`, `@parcel/watcher` and `msgpackr-extract` (not in `allowScripts`); the build still succeeded. | Optional: approve those four install scripts (`npm install-scripts approve <pkg>`) so native fallbacks don't bite later. |
| 3c | Tests | ⚠️ | **There are no tests anywhere.** 0 `*.spec.ts`, no `test` target in `angular.json`, no .NET test project, and CI runs none. `npm run test` (`ng test`) has nothing to run. | `uplift`/`verify` need characterization tests written first (test-engineer agent): API endpoint contracts plus Angular SSR output/route snapshots. |
| 3d | Target smoke test | ✅ | Throwaway projects (deleted afterwards): `ng new` with **Angular CLI 22.3.0** on **Node 26.13.1** with **TypeScript 6.0.3** → build ✅, `ng test` on **vitest 5.1.2** with 2/2 passing ✅. `dotnet new xunit -f net10.0` → 1/1 passing ✅. | — |
| 3e | Target support | ✅ | Angular 22 until 2028-06-30; Node 26 LTS until 2029-04-30; .NET 10 LTS until 2028-11-14; TypeScript 6.0 has no published end date (source: INTENT.md, checked 2026-11-27). **The current Angular 20 goes out of support 2026-11-28.** | — |
| 4 | Source completeness | ✅ | No binary-only artifacts (no committed dll/exe/jar/nupkg). Data definitions: EF configurations in `Infrastructure/Data/Configurations/**` plus 3 migration files (`20241105222844_InitialCreate`, snapshot). Config: `appsettings*.json`, `web.config`, Angular routes (`shared/routes/*.ts`, `server-routes.ts`), `server.ts`. All project references resolve. Secrets live in user secrets (not in the tree), as expected. | — |
| 5 | Optional context | ⚠️ | Git: 407 commits since 2023-09-21 ✅ (good for churn ranking). Telemetry: OpenTelemetry/Serilog are wired in code, but no APM MCP server or exported logs are connected here. | To get a runtime overlay in assess, export recent production logs or traces. |
| 6 | Scope boundary | ✅ | Standalone repository (above). | — |
| 7 | Source protected from edits | ⚠️ | No `Edit` deny rule covering `legacy/` in `.claude/settings.json`, `.claude/settings.local.json` or `~/.claude/settings.json`. `legacy/marush` is a junction, so a rule must also cover its real target. **That target is this worktree root, which is also where `analysis/` and `modernized/` are written**, so a target rule would block the commands' own output. | Add `{ "permissions": { "deny": ["Edit(/legacy/**)"] } }` to `.claude/settings.json`. Covering the target (`Edit(//C:/Users/Nizzo/Desktop/Marush/.claude/worktrees/modernize-marush/**)`) is not workable with this layout; see the note below. |

**Note on Check 7:** a permission rule covers Claude's file tools and the shell commands it recognizes (`sed`, `tee`, `> file`), not a script that opens files itself. The hard guarantee is the operating system: a read-only mount, or a sandbox that blocks shell writes. Because this uplift is in place on a git branch, git is the real safety net here: `main` and the live site are untouched until a PR goes through the pipeline's approval gate.

## Verdicts

| Command | Verdict | Why |
|---|---|---|
| `assess` | Ready-with-gaps | No `scc` or `lizard`, so metrics are coarser. Exclude `legacy/` when walking (self-referencing junction). |
| `map` | Ready | Python works. |
| `extract-rules` | Ready | — |
| `harden` | Ready-with-gaps | No SAST tool installed (`semgrep` missing); the review will be Claude-derived plus `npm audit` / `dotnet list package --vulnerable`. |
| `brief` | Ready | Needs discovery artifacts and `DELTA_CATALOG.md` from uplift analysis. |
| `uplift` | Ready-with-gaps | Target toolchain proven ✅. (a) The **source runtime is also here**: the Angular 20 app builds on this machine's Node 26, so old and new builds can run side by side (a true dual run for the front end). Node 22.20.0 itself is not installed, which is only needed to reproduce CI byte for byte. The backend version is unchanged. (b) The migration tool is `ng update`, available through the project's `@angular/cli`; there's no global upgrade-assistant (not needed, since .NET stays on 10). (c) No inbound consumers. **Gap:** there are no tests, so equivalence needs characterization tests first. |
| `transform`, `reimagine` | Not applicable | The goal is uplift. |

## Most important fix

Nothing is red. The biggest gap is **no tests at all**. Equivalence for the uplift depends on characterization tests written before any version bump. Until those exist, "behavior matches exactly" can only be checked by comparing build outputs and doing manual browser checks.

**Next:** `/code-modernization:modernize-assess marush`
