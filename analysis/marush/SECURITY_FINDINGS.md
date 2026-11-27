# Security findings: marush

- **Date:** 2026-11-27
- **Source:** `legacy/marush`, a junction to the worktree root `C:\Users\Nizzo\Desktop\Marush\.claude\worktrees\modernize-marush`, at commit `5c909d1`
- **Method:** fallback mode (no Workflow tool in this session).
  - **Finders:** one adversarial security-auditor pass over the code, run during `assess` on this same commit and reused here.
  - **Checking:** every Critical and High finding re-checked by hand against the code. Each patch hunk was reviewed by an independent security-auditor until it passed.
  - **Tools:** `npm audit` (lock file); `dotnet list package --vulnerable --include-transitive` (nuget.org feed); a running SSR server probed with forged Host headers.
  - **No SAST engine:** `semgrep` isn't installed.

## Scorecard

| Severity | Count | IDs |
|---|---|---|
| Critical | 1 | SEC-003 |
| High | 3 | SEC-001, SEC-002, SEC-004 |
| Medium | 5 | SEC-005 to SEC-009 |
| Low | 9 | SEC-010 to SEC-018 |
| **Total** | **18** | |

**Top CWE categories:**
- Input reaching output unescaped (CWE-79/80)
- Broken verification logic (CWE-697/804)
- Server-side request forgery and Host trust (CWE-918, CWE-644)
- Vulnerable components (CWE-1395)
- Missing rate limiting / resource limits (CWE-307/770)

**Refuted or adjusted after checking:**
- **Refuted (1):** "no HSTS / CSP / X-Frame-Options" (Medium, CWE-693). `Site/Gmf.Marush.Care.Api/web.config:61-67` sets HSTS and `:84-85` sets a strict CSP and frame options. The weaker parts that remain are logged as SEC-017.
- **Downgraded (1):** the anonymous decision GET went from High to Medium (SEC-005). The appointment ID it needs is an EF-generated sequential GUID with about 64 random bits, so it can't be guessed. A decision also only applies while the appointment is still in *Requested* status, so a second call does nothing (`Domain/Models/AppointmentDecision.cs:10`).
- **False-positive rate:** 1 of the 4 judged Critical/High-or-Medium claims was refuted outright.

**Hardcoded credentials:** none. Every secret in config is a `_-_-name-_-_` token replaced at deploy time from the Azure DevOps variable groups. No `SECRETS.local.md` or `.local.patch` was needed.

## Coverage gaps

This was a fallback run with a single auditor, not the five-class Workflow scan. What that leaves out:
- **Not scanned by a SAST engine:** no semgrep or CodeQL; injection, auth, secrets and validation were reviewed by reading the code.
- **Not judged by a second refuter:** Medium and Low findings came from one auditor. I checked them against the code but didn't adversarially refute them.
- **Dependency coverage is complete:** both feeds were checked (npm advisories, and NuGet direct and transitive dependencies).

The counts and the false-positive rate cover the judged findings only. If the Workflow tool becomes available, I can re-run the five-class scan for these gaps.

## Findings

| ID | Severity | CWE | Finding | file:line | Fix / status |
|---|---|---|---|---|---|
| SEC-003 | **Critical** | CWE-1395 | The locked Angular 20.3.3 / `@angular/ssr` 20.3.9 and Express 5.1.0 chain carries 18 runtime advisories, including SSR SSRF and header injection, open redirect, path traversal, SSR XSS and `proxy-addr` IP spoofing (dependency table below) | `Site/Gmf.Marush.Care.App/package.json:15-33`, `package-lock.json` | **Patched.** Same-major bump to patched 20.3.x |
| SEC-001 | **High** | CWE-697 / CWE-804 | Captcha verdict is `!Valid && Score < threshold`, so a valid token with a bot score passes. The expected action came from a client header and was never checked against the token. This covers booking, login and customer writes. | `Packages/Gmf.Net.Core.Common/Security/Response.cs:8`; `ValidateCaptchaAttribute.cs:41,57,64` | **Accepted risk**: the owner keeps the current behavior (RULE-030 confirmed, 2026-11-27); not patched |
| SEC-002 | **High** | CWE-79 / CWE-80 | Name, surname, treatments, phone and the query-string `Date` are string-replaced raw into HTML email, so anyone can send attacker HTML through the salon's SMTP to any address. `Treatments` has no validator at all. | `Packages/Gmf.Mail.Common/Models/BaseEmailTemplate.cs:14-17`; `Site/Gmf.Marush.Care.Api/Models/Templates/*.cs` | **Patched** |
| SEC-004 | **High** | CWE-918 | SSR has no host allowlist. Patched `@angular/ssr` without `allowedHosts` would also silently serve client-rendered pages for every public host, which is an SEO regression. | `Site/Gmf.Marush.Care.App/angular.json:57-60`; `src/server.ts:14-26` | **Patched** |
| SEC-005 | Medium | CWE-306 / CWE-352 | Anonymous `GET api/appointment/decision` accepts or rejects a booking and emails the customer. A link scanner prefetching the owner's email could trigger it, and the free-text `Date` can be spoofed. | `Site/Gmf.Marush.Care.Api/Controllers/AppointmentController.cs:40-59` | Open. Signed, expiring decision token; POST; date read from the DB. |
| SEC-006 | Medium | CWE-644 | The owner's Accept/Reject links are built from `Request.Host`, with `AllowedHosts: *` | `AppointmentController.cs:65`; `Api/appsettings.json:12` | Open. Configured base URL; explicit `AllowedHosts`. |
| SEC-007 | Medium | CWE-942 | CORS allows any origin, method and header | `Site/Gmf.Marush.Care.Api/Program.cs:52-55` | Open. Site origins only. |
| SEC-008 | Medium | CWE-307 / CWE-770 | No rate limiting or lockout on login, booking (which sends email) or decision | `Program.cs`; `UserController.cs:15` | Open. `AddRateLimiter` per IP; lockout. |
| SEC-009 | Medium | CWE-489 | Captcha is bypassed and Swagger is served whenever the environment isn't Production, which includes the public test site. A DEBUG-only anonymous `POST api/user/create` exists. | `ValidateCaptchaAttribute.cs:34-38`; `SwaggerExtensions.cs:15,46`; `UserController.cs:33-41` | Open. Bypass in Development only; protect the test site. |
| SEC-010 | Low | CWE-922 | Admin JWT stored in `localStorage` | `Site/Gmf.Marush.Care.App/src/app/shared/services/authentication.ts:19-20` | Open |
| SEC-011 | Low | CWE-285 | No roles or policies; any valid JWT reads customer health data | `CalendarController.cs:11`; `CustomerController.cs:16` | Open |
| SEC-012 | Low | CWE-209 / CWE-532 | Stack traces in developer emails; raw usernames logged on failed logins | `Initialization/Exceptions/HandlingExtensions.cs:84`; `Domain/Events/User/UserAuthenticationFailure.cs:20` | Open |
| SEC-013 | Low | CWE-214 | The migration connection string is passed on the efbundle command line | `Deployment/Templates/update-database.yaml:18` | Open |
| SEC-014 | Low | CWE-770 | `PageSize` has no upper bound (admin only) | `Packages/Gmf.Net.Core.Common/Requests/PaginatedRequest.cs:7` | Open |
| SEC-015 | Low | CWE-20 | `Customer.PhoneRegex` `^(06\d{7,8})\|(\+\d{10,13})$` is only half-anchored per branch, so extra characters pass. The phone is now HTML-encoded in email (SEC-002), so this is an input-validation issue only. | `Site/Gmf.Marush.Care.Domain/Models/Customer.cs:7` | Open. `^(?:06\d{7,8}\|\+\d{10,13})$` |
| SEC-016 | Low | CWE-532 | The reCAPTCHA API key is in the query string of a URL logged at Debug (`?key=****`); no timeout on the call | `ValidateCaptchaAttribute.cs:51,76` | Open. Use the `X-goog-api-key` header; don't log the URL. |
| SEC-017 | Low | CWE-693 | CSP allows `script-src 'unsafe-inline'`; production `connect-src` still lists `http://localhost:*` and `ws://localhost:*`; `X-Frame-Options: SAMEORIGIN` conflicts with `frame-ancestors 'none'`; HSTS applies only when IIS itself sees HTTPS | `Site/Gmf.Marush.Care.Api/web.config:61-67,84-85` | Open |
| SEC-018 | Low | CWE-209 | Verbose error pages: `customErrors mode="Off"`, `httpErrors errorMode="Detailed"` | `web.config:4,16` | Open |

## Dependency CVEs (runtime, `npm audit --omit=dev`)

| Package | Installed | Advisories (GHSA) | Fixed in | After patch |
|---|---|---|---|---|
| `@angular/ssr` | 20.3.9 | x288-3778-4hhx (critical, SSRF/header injection), xh43-g2fq-wjrj, 69xr-m8h6-h664 (open redirect via X-Forwarded-Prefix), vfx2-hv2g-xj5f, 7g7c-h8rr-7p6q (path traversal) | 20.3.36+ | 20.3.43 ✅ |
| `@angular/platform-server` | 20.3.3 | rfh7-fxqc-q52v, 45q2-gjvg-7973, xrxm-cp7j-8xf6, f6mr-pjwc-34m4 (SSRF), v3p8-whq6-r5jg, j3r3-mxqp-r2p4, vpx6-8pjr-4g3v, hqr9-c56f-3x7f, gxx4-3xcv-f8qx (SSR XSS), w739-gvwx-grc3, f67j-2jqw-jpq7 | 20.3.33+ | 20.3.35 ✅ |
| `@angular/core` | 20.3.3 | prjf-86w9-mfqv, g93w-mfhg-p222, jrmj-c5cx-3cw6, f3m7-gqxr-g87x, 692r-grfm-v8x7, rgjc-h3x7-9mwg, jj27-h5hq-8x99, hh8m-fm6v-7cvg (XSS / sanitizer bypass) | 20.3.28+ | 20.3.35 ✅ |
| `@angular/compiler` | 20.3.3 | g93w-mfhg-p222, jrmj-c5cx-3cw6, v4hv-rgfq-gp49, 58w9-8g37-x9v5, f3m7-gqxr-g87x, jj27-h5hq-8x99, hh8m-fm6v-7cvg | 20.3.28+ | 20.3.35 ✅ |
| `@angular/common` | 20.3.3 | 58c5-g7wp-6w37, jfgx-762w-99vr (XSRF token leak), q6f4-qqrg-jv6x, 39pv-4j6c-2g6v, jhpw-976m-542j, p297-fm68-3q8c (HttpTransferCache leak), 48r7-hpm6-gfxm, p3vc-36g9-x9gr (DoS) | 20.3.34+ | 20.3.35 ✅ |
| `@angular/router` | 20.3.3 | ff3f-86qr-9cv3, 62vg-58rm-qff7 (SSR DoS) | 20.3.33+ | 20.3.35 ✅ |
| `proxy-addr` | 2.0.7 | jqcg-44mw-7w3h (critical, IP spoofing) | 2.0.8 | 2.0.8 ✅ |
| `body-parser` | 2.2.0 | wqch-xfxh-vrr4, v422-hmwv-36x6, 27r3-jxmh-p828 (DoS) | 2.4.0 | 2.4.0 ✅ |
| `path-to-regexp` | 8.3.0 | j3q9-mxjg-w52f, 27v5-c462-wpq7 (ReDoS) | 8.4.0 | 8.4.2 ✅ |
| `qs` | 6.14.0 | w7fw-mjwx-w883, 6rw7-vpxm-498p, q8mj-m7cp-5q26, 4mjr-xmp4-gh2g, 6pq8-jhm2-2vcw (DoS) | 6.16.1+ | 6.17.1 ✅ |
| `picomatch` | 4.0.3 | 3v7f-55p6-f55p, c2c7-rcm5-vvqj | 4.0.4 | fixed ✅ |
| `@babel/core` | ≤7.29.0 | 4x5r-pxfx-6jf8 (low) | 7.29.1+ | fixed ✅ |
| `browserslist` | ≤4.28.6 | c83g-rgw3-j3cx, 73wf-gq98-2v4g | >4.28.6 | **still open, build-time only**: fixed by the Angular 22 uplift |
| `baseline-browser-mapping` | <2.11.0 | w5vr-8v7q-w6rv (moderate) | 2.11.0 | **still open, build-time only**: fixed by the uplift |

- **Runtime advisories:** 18 before (2 critical, 13 high, 2 moderate, 1 low), 2 after (both build-time tools).
- **All advisories, dev included:** 52 before, 30 after. The rest are build and dev tooling (`tar`, `vite`, `piscina`, …) that the Angular 22 uplift replaces.
- **NuGet:** 0 vulnerable packages in any of the 8 projects, direct or transitive (nuget.org feed).

## Remediation Log

| ID | Fix | Patch |
|---|---|---|
| SEC-001 | **Dropped by owner decision (2026-11-27)**: the reviewed hunks were removed from the patch; the captcha logic is unchanged (RULE-030 confirmed). The hunks below stay on record. | none |
| SEC-002 | `WebUtility.HtmlEncode` on each request-derived replacement: client name, each treatment item (markup kept), phone and formatted phone, and the decision `Date` in both the acceptance and rejection templates. The encoding happens per template, not globally, because `{{services}}` carries intended HTML. | `security_remediation.patch` (4 hunks) |
| SEC-003 | `@angular/*` ^20.3.35 (ssr, build, cli ^20.3.43) and Express ^5.3.0, with a lock refresh. Only `@angular/*` and the Express chain were re-resolved; the other lock changes follow from `@angular/build` 20.3.43. `air-datepicker` stays at 3.5.3. | `security_remediation.patch` (2 hunks) |
| SEC-004 | `security.allowedHosts: marushcare.com, test.marushcare.com, localhost (owner: ARR keeps the public Host, www is not bound)`. `localhost` is needed because IIS rewrites page routes to `http://localhost:<ssrPort>` (`web.config:57`). | `security_remediation.patch` (1 hunk) |
| SEC-005 to SEC-018 | Not patched: Medium and Low, logged above with the recommended fix. | none |

### Checks I ran
- **Code hunks:** the patched solution builds in **Release and Debug** with 0 warnings and 0 errors (warnings as errors, analyzers `latest`).
- **Patch applies:** `git apply --check` and `patch --binary --dry-run -p1` both pass against `legacy/marush`.
- **Dependency hunks:** fresh install of the patched lock in a scratch copy, then:
  - production build ✅
  - `lint:ci` with 0 errors (the 1 existing TODO warning remains) ✅
  - the runtime audit result above
- **SSR probe:** `node dist/server/server.mjs` with `GET /sr/početna`:
  - Host `localhost`, `marushcare.com` or `test.marushcare.com`: 200 with `ng-server-context="ssr"` (46 KB)
  - Host `evil.example`: 400

### Behavior changes (intended bug fixes, per INTENT.md "Fix known bugs")
- **Captcha:** low-score (bot-like) requests and tokens issued for another action now get 400 where they used to pass.
- **Email text:** characters U+00A0–U+00FF (e.g. `é`) in names and treatments become numeric entities in the email HTML. They render the same, and Serbian Latin and Cyrillic are unchanged.
- **SSR host check:** requests whose Host isn't on the allowlist get 400 from SSR.

**Host question resolved (owner, 2026-11-27):** ARR keeps the public Host and `www.marushcare.com` is not bound, so `www` was removed from `allowedHosts`.

## Patch Review

**Applied 2026-11-27, without the SEC-001 hunks** (owner decision). The SEC-001 rows below record that review; those hunks are not in the shipped patch.

The independent security-auditor reviewed the patch in rounds until every hunk passed. No raw credential appears in the patch; it has no keys, passwords or connection strings, and every lock-file `resolved` URL is `registry.npmjs.org`.

| Hunk | Round 1 | Round 2 | Round 3 | Final |
|---|---|---|---|---|
| SEC-001 `CaptchaActionAttribute.cs` (new) | — | RESOLVES | — | **RESOLVES**: a sealed attribute limited to methods |
| SEC-001 `Response.cs` | PARTIAL (action compared with the client's own header) | RESOLVES | — | **RESOLVES**: OR-combined verdict against the server-side action |
| SEC-001 `ResponseToken.cs` | RESOLVES | RESOLVES | — | **RESOLVES**: camel-case binding to `tokenProperties.action` |
| SEC-001 `ValidateCaptchaAttribute.cs` | PARTIAL (header-sourced action) | RESOLVES | — | **RESOLVES**: action from endpoint metadata; fails closed; dev bypass unaffected |
| SEC-001 `AppointmentController.cs` | — | RESOLVES | — | **RESOLVES**: matches `appointment-page.ts:86` |
| SEC-001 `CustomerController.cs` | — | RESOLVES | — | **RESOLVES**: create and update both use CLIENT_EDIT (`clients-edit-page.ts:73`) |
| SEC-001 `UserController.cs` | — | RESOLVES | — | **RESOLVES**: LOGIN matches `login-page.ts:50`; USER_CREATE is DEBUG-only |
| SEC-002 `AppointmentConfirmationTemplate.cs` | RESOLVES | RESOLVES | — | **RESOLVES**: encoded once, in element text |
| SEC-002 `AppointmentRejectionTemplate.cs` | RESOLVES | RESOLVES | — | **RESOLVES**: encoded once (the HTML has no `{{date}}` placeholder, so it is currently unused) |
| SEC-002 `AppointmentRequestTemplate.cs` | RESOLVES | RESOLVES | — | **RESOLVES** |
| SEC-002 `BaseMarushRequestTemplate.cs` | RESOLVES (phone left raw) | RESOLVES | — | **RESOLVES**: treatments and both phone placeholders encoded; `tel:` links unchanged |
| SEC-003 `package.json` | — | — | RESOLVES | **RESOLVES**: same major; `air-datepicker` pin kept |
| SEC-003 `package-lock.json` | — | — | RESOLVES | **RESOLVES**: spot-checked ssr 20.3.43, platform-server 20.3.35, proxy-addr 2.0.8, body-parser 2.4.0, path-to-regexp 8.4.2, qs 6.17.1 |
| SEC-004 `angular.json` | — | — | PARTIAL (www unproven; hunk comment contradicted the observed 400) | **RESOLVES** (round 4: www added and comment corrected; `localhost` is an accepted Low residual, needed for the ARR rewrite) |

## Apply

From the workspace root:

```
patch --binary -p1 -d legacy/marush < analysis/marush/security_remediation.patch
```

The files use CRLF line endings, so plain `patch` without `--binary` rejects them. `git apply analysis/marush/security_remediation.patch` from inside the repo works too.

After applying:
1. Run `npm ci` in `Site/Gmf.Marush.Care.App`.
2. Run `dotnet build`.
3. Rerun `/code-modernization:modernize-harden marush` to confirm.

There are no credentials to rotate.
