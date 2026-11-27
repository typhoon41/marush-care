# Assessment: marush

- **Date:** 2026-11-27
- **Source:** `legacy/marush`, a junction to the worktree root `C:\Users\Nizzo\Desktop\Marush\.claude\worktrees\modernize-marush`
- **Inventory tool:** `git ls-files` + line counts (no `scc`/`cloc` installed). Complexity is a decision-keyword count (`if/for/foreach/while/case/catch/&&/||/??/?:`).

## Executive Summary

Marush: Space of Care is a salon web app: a public site with online booking, plus an admin calendar and customer CRM. It's built as an ASP.NET Core 10 API with EF Core on SQL Server and an Angular 20 SSR front end. It is small (about 15.5 KSLOC, 560 source files) and has low code complexity. The code is already in modern style (standalone components, signals, zoneless, no NgModules or legacy control flow). The risk sits in three places:
- **Angular 20 goes out of support on 2026-11-28**, and the locked versions carry 4 critical and 34 high npm advisories, including SSR SSRF in `@angular/ssr` 20.3.9.
- **There are no tests at all.**
- **There are real security bugs**: inverted captcha logic, an anonymous state-changing GET, and HTML injection into outgoing email.

**Recommendation:** a **Replatform** uplift of the front end (Angular 22, TypeScript 6.0, Node 26) on the unchanged .NET 10 backend, preceded by `harden` and by writing characterization tests.

## System Inventory

| Kind | Files | Non-blank lines |
|---|---|---|
| C# | 188 | 5,289 |
| TypeScript | 151 | 4,561 |
| SCSS | 133 | 2,801 |
| JSON (config/locale, excl. lock files) | 21 | 1,118 |
| HTML templates | 49 | 969 |
| YAML/YML (pipelines) | 8 | 454 |
| csproj/props | 10 | 295 |
| **Total** | **560** | **15,487** |

- **Complexity:** 62 decision points per KSLOC of C#+TS. The most complex files are `Infrastructure/Data/Repositories/CustomerModificationRepository.cs` (19, 178 lines), `AppointmentRepository.cs` (17), `CalendarRetrievalRepository.cs` (16), `App/.../entry-dialog/entry-form-value.ts` (15), `Gmf.Net.Core.Common/.../DateOnlyJsonConverter.cs` (14) and `App/.../date-picker/date-picker.ts` (14). No hotspot stands out.
- **History:** 407 commits since 2023-09-21.

### Technology fingerprint

| Area | Evidence |
|---|---|
| Backend | .NET 10 (`Directory.Build.props`: `net10.0`, warnings as errors, analyzers `latest`). ASP.NET Core, Autofac, FluentValidation 11.3.1, Swashbuckle 10.2.3, Serilog, OpenTelemetry. Central versions in `Directory.Packages.props` (`DotnetVersion` 10.0.14), with lock files. |
| Data | EF Core SQL Server. Configurations in `Site/Gmf.Marush.Care.Infrastructure/Data/Configurations/**`, one migration `20241105222844_InitialCreate`, unit of work committed by `TransactionFilter`. |
| Frontend | Angular 20.3 (`@angular/build:application`, `outputMode: server`, SSR with Express 5, `localize` for sr/en/ru). TypeScript ~5.9.2 with `baseUrl` and paths aliases `@env`, `@features/*`, `@shared/*`. In-house packages `@typhoon41/eslint-config-angular` 1.1.1, `scss-solutions` 0.2.1 and `stylelint-config` 1.1.2. `air-datepicker` intentionally pinned at 3.5.3. |
| Hosting | IIS (`Api/web.config`). The API serves `dist/browser` and starts the Node SSR server as a child process (`Api/Services/NodeJsRunnerService.cs`). Aspire 13.6.5 orchestrates SQL, the API and Angular locally. |
| Integrations | SMTP via MailKit (`Packages/Gmf.Mail.Common`), Google reCAPTCHA Enterprise (`Gmf.Net.Core.Common/Security/ValidateCaptchaAttribute.cs`), JWT bearer auth, static files from `https://marushcare.com/files/`. |
| CI/CD | Azure Pipelines (`Deployment/azure-pipelines.yml`, `Templates/build.yaml`): Node 22.20.0, .NET 10.0.x, `npm ci` → lint → build → publish, EF bundle, token replacement (`_-_-name-_-_`), DB backup, test environment → approval → production. |
| Tests | **None.** 0 `*.spec.ts`, no `test` target in `angular.json`, no .NET test project, no test step in CI. |

## Architecture at a Glance

The diagram is in `ARCHITECTURE.mmd`.

| # | Domain | Key paths | Depends on |
|---|---|---|---|
| D1 | Public site and treatment catalog (hardcoded price list) | `App/src/app/features/{home,services,gallery,contact,errors}`, `shared/models/services/treatments/**` | D6 |
| D2 | Online booking: request, owner email with accept/reject links, decision | `features/appointment/**`, `Api/Controllers/AppointmentController.cs`, `Services/Domain/Appointment/Service.cs` | D6, D7, D9, D10 |
| D3 | Admin calendar: weekly grid, entries, notes, reschedule (raises a domain event that emails the customer) | `features/admin/calendar/**`, `Api/Controllers/CalendarController.cs`, `Services/Domain/Calendar/CalendarService.cs` | D5, D8, D9 |
| D4 | Customer CRM (calls repositories directly, with no service layer) | `features/admin/clients/**`, `Api/Controllers/CustomerController.cs` | D5, D9 |
| D5 | Identity and access: JWT login with captcha, guards, audit events | `features/admin/authentication`, `Api/Controllers/UserController.cs`, `Services/Domain/UserService.cs` | D8, D9, D10 |
| D6 | Frontend shell: SSR, translated routes, interceptors, shared form components, SEO | `src/app/application*.ts`, `shared/**`, `src/server.ts`, `src/locale/*` | D11 (token-filled API URL) |
| D7 | Notifications and email templates | `Packages/Gmf.Mail.Common`, `Api/Models/Templates/*`, `Infrastructure/Services/AppointmentNotificationService.cs` | D9, D10 |
| D8 | Domain events and audit (in-memory queue drained by a background service) | `Packages/Gmf.Net.Core.Common/Persistence/{Dispatchers,Handlers}`, `Api/Services/*Handler.cs` | D7, D9 |
| D9 | Persistence | `Infrastructure/Data/**`, `Infrastructure/Migrations/*` | Gmf.DDD.Common |
| D10 | API hosting platform: runner, DI, validation, Swagger, captcha, filters | `Packages/Gmf.Net.Core.Common/**`, `Api/Program.cs` | D8, D9 |
| D11 | Ops and delivery: Aspire, pipelines, Node SSR runner | `Gmf.Marush.Care.Host`, `Deployment/**`, `Api/Services/NodeJsRunnerService.cs` | All |

Dangling or drifting items:
- `DELETE api/customer/{id}` is never called from the UI.
- `POST api/user/create` exists only under `#if DEBUG`, and admin provisioning in production is undocumented.
- `Infrastructure.csproj` references `Services`, and the notification service lives in Infrastructure, contrary to CLAUDE.md.
- `src/express.tokens.ts` is unused.

## Production Runtime Profile

**No telemetry available.** OpenTelemetry and Serilog are wired in code, but no APM connection or exported logs were provided. Nothing ranks domains by runtime cost or variance.

## Technical Debt (top 10)

**U** = affects the Angular 22 / TS 6 / Node 26 uplift.

| # | Location | Debt | Why it matters |
|---|---|---|---|
| 1 **U** | `App/package.json:15`, `angular.json` (no `test` target), `tsconfig.spec.json`, `README.md:19`, `Gmf.Marush.Care.App.esproj:3` | No tests anywhere; the `ng test` script has no target; Karma and Jest remnants | Nothing guards a two-major-version jump. Angular 21+ uses `@angular/build:unit-test` with Vitest. |
| 2 **U** | `App/tsconfig.json:23` (`:17`, `:22`) | `baseUrl` with path aliases; `experimentalDecorators`, `useDefineForClassFields: false` | TS 6.0 deprecates `baseUrl`. Make the paths relative instead of using `ignoreDeprecations`. |
| 3 **U** | `App/package.json:44-46`, `package-lock.json:4606` | `@typhoon41/eslint-config-angular` 1.1.1 hard-pins `angular-eslint` 20.6.0 | The CI lint gate runs before the build. **1.2.0 is already published with `angular-eslint` 22.8.0**, and `stylelint-config` 1.2.0 moves to stylelint 18. Bump all three `@typhoon41/*` (per preflight). |
| 4 **U** | `Deployment/Templates/build.yaml:19`, `package.json:43` (`@types/node` 22.13.8), `NodeJsRunnerService.cs:40` | Node is pinned in CI, but production SSR runs whatever `node` is on the IIS host's PATH | You could build on 26 and still serve on 22. Pin and verify the server's Node. |
| 5 **U** | `Api/Services/NodeJsRunnerService.cs:13-18,51-56,70`; `src/server.ts:28` (`pm_id`) | The SSR child process is fire-and-forget: no restart or health check, output goes to Console, `Kill()` doesn't take down the process tree. There's also a second PM2 hosting path. | An SSR crash after the upgrade would be silent. |
| 6 **U** | `src/server.ts:23-25,9`; `src/express.tokens.ts:4` | SSR render errors are swallowed into `next()`; the assets path depends on the working directory; a dead duplicate `REQUEST` token | Breakage would be invisible. |
| 7 | `Gmf.Net.Core.Common/Security/ValidateCaptchaAttribute.cs:51,62,76` | The API key sits in the query string, and that URL is logged at Debug (`?key=****`). The HTTP call has no timeout or error handling. | A higher log level leaks the key, and a Google outage turns into 500s. |
| 8 | `AppointmentController.cs:58`; `Initialization/Http/ClientExtensions.cs:18`; `Api/Program.cs:52-55` | Production `/sr/` redirect URLs and the Referrer header are hardcoded; CORS allows any origin | The test environment redirects to production. |
| 9 **U** | `package.json:32,37`; `shared/models/language.ts:22-26`; `angular.json:39-40` | The `air-datepicker` 3.5.3 pin is guarded only by a non-standard `"warnings"` key; CommonJS locale unwrap via an `as unknown as {default}` cast | esbuild's CommonJS interop may change, and the pin can be bumped by accident. |
| 10 **U** | `shared/components/forms/field.ts:10-17`; `CommonModule` in about 18 components | `get` accessors waiting for Signal Forms (TODO); unused `CommonModule` imports | Angular 21+ Signal Forms resolve the TODO, and the dead imports should go. |

Lower priority:
- The API project references the AppHost-only `Aspire.Hosting.SqlServer`.
- The `copyfiles` asset workaround in `build`.
- `CustomerModificationRepository.cs` is over the 120-line split trigger.
- `GetService<>()!` captcha construction in `Program.cs:157`.

## Security Findings

There are no hardcoded credentials. Every secret is a `_-_-name-_-_` token replaced at deploy time from the Azure DevOps variable groups (`Deployment/Variables/*.yaml`). The Aspire host's connection string is localhost with Integrated Security, so it carries no password. **No credential inventory was needed** (no `SECRETS.local.md`).

npm audit (lock file, `Site/Gmf.Marush.Care.App`) reports 52 advisories: 4 critical, 34 high, 13 moderate, 1 low. Those that matter at runtime:
- `@angular/ssr` 20.3.9 (critical: GHSA-x288-3778-4hhx SSRF and header injection; open redirect via `X-Forwarded-Prefix`)
- `@angular/platform-server` 20.3.3 (hostname-hijack SSRF, SSR XSS)
- `@angular/core` and `@angular/compiler` 20.3.3 (i18n and SVG sanitization XSS)
- `@angular/common` (HttpTransferCache leak, XSRF token leak)
- `proxy-addr` 2.0.7 (critical, IP spoofing), plus `body-parser`, `path-to-regexp` and `qs` DoS

The rest are build-time only. Everything pinned in NuGet is current for .NET 10; no advisory feed was available to confirm further.

| Severity | CWE | Finding | file:line | Recommendation |
|---|---|---|---|---|
| High | CWE-306 / CWE-352 | Anonymous `GET api/appointment/decision` accepts or rejects a booking and emails the customer. The only guard is the appointment GUID in the link, and link scanners can trigger it. **Verified.** | `Site/Gmf.Marush.Care.Api/Controllers/AppointmentController.cs:40-59` | Use an HMAC-signed, expiring decision token (or admin auth) and POST for the state change. Read the date server-side. |
| High | CWE-79 / CWE-80 | Name, surname, treatments and the query-string `Date` go raw into HTML email via `string.Replace`. That allows phishing through the salon's SMTP to any address. **Verified.** | `Packages/Gmf.Mail.Common/Models/BaseEmailTemplate.cs:14-17`; `Api/Models/Templates/*Template.cs` | HTML-encode every replacement; check treatments against the catalog; load the date from the DB. |
| High | CWE-697 / CWE-804 | Captcha is inverted: `Invalid = !Valid && Score < threshold`, so a valid token with a 0.0 bot score passes. The client-supplied `ExpectedAction` is never compared with the token's action. **Verified.** | `Packages/Gmf.Net.Core.Common/Security/Response.cs:8`; `ValidateCaptchaAttribute.cs:57` | Use `!Valid \|\| Score < threshold`, a fixed action per endpoint, and a check of `tokenProperties.action`. |
| High | CWE-918 | Vulnerable `@angular/ssr` / `platform-server`, and no host allowlist in `server.ts` | `App/package.json:25,31`; `src/server.ts:14-26` | The uplift fixes the versions; also set `security.allowedHosts`. |
| Medium | CWE-644 | Decision links are built from `Request.Host`, with `AllowedHosts: *` | `AppointmentController.cs:65`; `Api/appsettings.json:12` | Use a configured base URL and restrict `AllowedHosts`. |
| Medium | CWE-942 | CORS allows any origin, method and header | `Api/Program.cs:52-55` | Allow the site origins only. |
| Medium | CWE-307 / CWE-770 | No rate limiting or lockout on login, booking or decision | `Api/Program.cs`; `UserController.cs:15` | `AddRateLimiter` per IP; account lockout. |
| Medium | CWE-489 | Captcha is bypassed and Swagger is exposed whenever the environment isn't Production, including the public test site. A DEBUG-only anonymous user-create endpoint exists. | `ValidateCaptchaAttribute.cs:34-38`; `SwaggerExtensions.cs:15,46`; `UserController.cs:33-41` | Bypass in Development only; protect the test environment. |
| Medium | CWE-693 | `UseHsts` is never called; `UseHttpsRedirection` runs after the endpoints, so it does nothing; no CSP, X-Frame-Options or nosniff | `Packages/Gmf.Net.Core.Common/ApiRunner.cs:83-87`; `SecurityExtensions.cs:15` | Reorder the middleware and add security headers. |
| Low | CWE-922 | Admin JWT stored in `localStorage` | `App/src/app/shared/services/authentication.ts:19-20` | HttpOnly cookie, or a short lifetime plus CSP. |
| Low | CWE-285 | No roles; any JWT can read customer health data | `CalendarController.cs:11`; `CustomerController.cs:16` | Admin role and policy. |
| Low | CWE-209 / CWE-532 | Stack traces in developer emails; raw usernames logged on failed logins | `HandlingExtensions.cs:84`; `UserAuthenticationFailure.cs:20` | Trim what gets logged. |
| Low | CWE-214 | Migration connection string on the efbundle command line | `Deployment/Templates/update-database.yaml:18` | Pass it via an environment variable or config file. |
| Low | CWE-770 | Unbounded `PageSize` (admin only) | `Gmf.Net.Core.Common/Requests/PaginatedRequest.cs:7` | Clamp it. |

What looks sound:
- JWT validation turns on issuer, audience, lifetime and signing-key checks.
- Passwords use the Identity `PasswordHasher`.
- EF queries are parameterized, with no raw SQL.
- `[innerHTML]` bindings render static catalog strings only.

## Documentation Gaps (top 5)

1. **Production hosting of SSR.** IIS runs the API, which starts Node SSR as a child process (`NodeJsRunnerService`). `server.ts` also has a PM2 path. Nothing says which one is live, or how Node is installed and pinned on the server.
2. **Booking decision flow.** The owner email carries accept/reject GET links (`AppointmentController.cs:40-65`), there are hardcoded production `/sr/` redirects, and the customer is emailed on the decision. This is undocumented and security-relevant.
3. **Deploy-time configuration.** All secrets and URLs are `_-_-name-_-_` tokens replaced by the pipeline (`environment-deploy.yaml:65-75`), so a local production build ships raw tokens. Only the YAML records this.
4. **Domain events and audit.** An in-memory queue is drained by a background service into the audit and reschedule-email handlers (`Api/Initialization/InjectionExtensions.cs:17-27`). Delivery guarantees are undocumented (are events lost on restart?).
5. **Admin user provisioning and the test story.** Production has no way to create a user. CLAUDE.md lists `dotnet test` / `npm run test`, and `README.md` is Angular 17 boilerplate that mentions Karma, but no tests exist.

Also, CLAUDE.md's layering (`NotificationService` in `Services/`, controller list) has drifted from the code.

## Relative Scale

- **KSLOC:** 15.5
- **Complexity index (`2.94 × KSLOC^1.10`):** **59.9**

The index is only for ranking this system against others by size. **It is not a timeline, an effort estimate or a cost.**

## Recommended Modernization Pattern

**Replatform** (same-stack version uplift), which routes to **`/code-modernization:modernize-uplift`**.

The architecture and code style are already where modern Angular and .NET want them: standalone components, signals, zoneless, central NuGet pinning. Nothing calls for a rewrite or a re-architecture. What is urgent is the platform:
- Angular 20 goes out of support on 2026-11-28, and the locked Angular/SSR versions carry critical SSRF and XSS advisories.
- The move is Angular 22.3, TypeScript 6.0 (pinned by Angular 22.3's `>=6.0 <6.1`) and Node 26 LTS, with .NET 10 LTS unchanged.
- Target versions were checked on 2026-11-27 and recorded in `INTENT.md`: Angular 22 is supported until 2028-06-30, Node 26 until 2029-04-30, .NET 10 until 2028-11-14.

The uplift is mostly mechanical: `ng update` across 20→21→22, `baseUrl`→relative paths, bumping the `@typhoon41/*` packages (the lint config 1.2.0 already targets angular-eslint 22), Vitest for the new test target, and the Node pin in CI, on the server and in `@types/node`.

The guarantees in `INTENT.md` shape the order:
- *Security review first:* `harden` runs next, before any build. The three verified High findings are code bugs the uplift won't fix.
- *Behavior must match exactly:* characterization tests for the booking, calendar, customer and login API contracts, and SSR route snapshots per locale, have to exist before the bump. Today there are none.
- *Fix known bugs:* the captcha inversion, the email HTML injection and the decision endpoint are candidates to list as intended differences.
