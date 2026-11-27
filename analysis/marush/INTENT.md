# Modernization intent: marush

- **Date:** 2026-11-27
- **System:** Marush: Space of Care (marushcare.com), an ASP.NET Core API, an Angular SPA, and EF Core on SQL Server
- **Source:** the repository root (no separate `legacy/` copy; the code is modernized in place on a branch)
- **Goal:** uplift (same-stack version move)

## Answers (word for word)

- What do you want to do with it? **"Move to newer version"**
- What must stay true? **"Behavior matches exactly, Fix known bugs, Security review first, Old system keeps running"**
- What should it become? **"Angular 22, Node 26, .NET 10"**

## From → to

| Component | From | To |
|---|---|---|
| Angular (`@angular/*`) | ^20.3 | 22.x (22.3.0 on npm) |
| TypeScript | ~5.9.2 | 6.0.x (6.0.3 on npm; Angular 22.3 needs `>=6.0 <6.1`) |
| Node.js | 22.20.0 (CLAUDE.md) | 26 LTS |
| .NET | net10.0 | net10.0 (unchanged; already the newest LTS) |

## What must stay true

1. The old system keeps running: marushcare.com stays live and unchanged until the uplift ships through the normal pipeline (test environment, then approval, then production).
2. Behavior matches exactly, including quirks, *except* where a known bug is explicitly listed for fixing.
3. Fix known bugs as we go. **Tension with item 2:** each bug fix must be named in `review` / the brief and accepted as an intended difference. Any other difference is a regression.
4. A security review comes first: `harden` runs right after `assess`, before any build.

## Target versions

| Component | Version | Support ends | Checked (source, date) | Status |
|---|---|---|---|---|
| Angular | 22 (22.3.x) | 2028-06-30 | endoflife.date/api/v1/products/angular, npm registry; 2026-11-27 | supported |
| TypeScript | 6.0 (6.0.3) | none published | npm registry (`@angular/compiler-cli@22.3.0` peer `>=6.0 <6.1`); 2026-11-27 | supported (pinned by Angular 22; TS 7.0.2 exists but is not supported by Angular 22.3) |
| Node.js | 26 LTS (26.13.1) | 2029-04-30 | endoflife.date/api/v1/products/nodejs; `@angular/core@22` engines `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`; 2026-11-27 | supported |
| .NET | 10 LTS (10.0.15) | 2028-11-14 | endoflife.date/api/v1/products/dotnet; 2026-11-27 | supported |

Notes:
- Angular 20 support ends **2026-11-28**, which is what makes this urgent.
- .NET 11 (STS) has the same end date as .NET 10, so moving the backend gains no support time.
- This machine has the .NET SDKs 9.0.305 and 11.0.100 (no 10.x SDK; 11 builds net10.0). Local Node is v26.13.1.
- CLAUDE.md and the pipeline pin Node 22.20.0; both need updating to 26.

## Open items

- Which known bugs to fix: to be named during `extract-rules` / `review`.
