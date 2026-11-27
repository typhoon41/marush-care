# Baseline: marush (Phase 1)

- **Date:** 2026-11-28
- **Branch:** `modernize/phase-1-harness`, cut from `main` at `538453c` (Angular 20.3.35, `@angular/ssr` 20.3.43, Express 5.3.0, .NET 10).
- **Machine:** Node 26.13.1, .NET SDK 11.0.100 targeting net10.0.
- **The oracle:** this is today's behavior. Every later phase must reproduce these results, except the differences the brief lists and the approver accepts.

Recorded: `baseline/api-baseline.trx` (85 tests, VSTest TRX), `baseline/frontend-unit.junit.xml` (72 tests, Vitest JUnit), `baseline/ssr-baseline.json` (216 route × locale × Host cases, identical to `Site/Gmf.Marush.Care.App/tests/ssr/baseline.json`).

## Results

| Suite | Runner | Executed | Passed | Failed | Skipped |
|---|---|---|---|---|---|
| API contract (`Site/Gmf.Marush.Care.Api.Tests`) | xUnit v3 (VSTest), Release | 85 | 85 | 0 | 0 |
| Front-end unit (13 specs) | Vitest 3.2.7 via `@angular/build:unit-test`, jsdom | 72 | 72 | 0 | 0 |
| SSR snapshot (`tests/ssr`) | `node --test`, built `dist/server/server.mjs` | 216 | 216 | 0 | 0 |

**The suite can fail:**
- **API:** changing `< 21` to `< 20` in `AppointmentRequestValidator.cs:34` turns the RULE-019 20:45 case red (1 of 5 fails); the change was reverted.
- **Front end:** the agent changed `total > 0` → `>= 0` and the 16-slot cap → 17, and the matching specs went red; both were reverted.
- **SSR:** tampering with the baseline file produces a readable diff.

## SSR matrix (216 cases)

There are 54 paths: the root with 3 Accept-Language values, plus 3 locales × 17 paths (locale root, every `lazyRoute`, 3 error pages and 1 unknown path). Each is requested with 4 Host headers.

| Answer | Count | Where |
|---|---|---|
| 200, server-rendered (`ng-server-context="ssr"`) | 54 | home, services, contact, appointment, request-sent, client-notified × 3 locales × 3 allowed hosts |
| 200, client-rendered | 81 | gallery, login, admin pages, error pages |
| 302 | 27 | `/` → `/sr` (or `/en`, `/ru` by Accept-Language); `/sr/` → `/sr/početna`; unknown → `/<locale>/greška/stranica-nije-pronađena` |
| 400 `text/plain` | 54 | every path with `Host: evil.example` (`allowedHosts`) |

`localhost`, `marushcare.com` and `test.marushcare.com` give identical answers.

## Behavior Contract coverage

These are the §5 rules of `MODERNIZATION_BRIEF.md`.

| Rule | Covered by | Note |
|---|---|---|
| RULE-001 | `appointment-page.spec.ts` | Browser total |
| RULE-002 | `OnlineBookingTests` | Expectations use the test machine's time zone, so this pins "server-local time", not Europe/Belgrade |
| RULE-003 | `OnlineBookingTests` (6) | A negative duration gives a 500 and emails the developer |
| RULE-004 | `CalendarEntryValidationTests` (6) | |
| RULE-005 | `SlotConflictTests`, `EntryLifecycleTests` | |
| RULE-012 | `appointment-page.spec.ts`, `treatment-selection.spec.ts` | Catalog values through totals |
| RULE-017 | `BookingWindowTests` (6), `date-picker.spec.ts` | Relative to `DateTime.Now` / a fixed fake clock |
| RULE-030 | `OnlineBookingTests`, `LoginTests` | Only the non-Production skip; the Production path calls Google and is not tested |
| RULE-031 | `LoginTests` (3) | |
| RULE-033 | `SlotConflictTests` (3) | Includes "public booking never checks the slot" |
| RULE-036 | `ReturningClientTests` (4) | |
| RULE-037 | `AppointmentDecisionTests` (4) | |
| RULE-038 | `TokenValidationTests` (10) | |
| RULE-039 | `CustomerCardTests` | |
| RULE-041 | `LoginTests` | Debug: 200 and login works; Release: 404 (both configurations run) |
| RULE-042 | `AppointmentDecisionTests`, `LoginTests` | Observable through the 302 commit and the failed-login audit. No NotFound path leaves pending changes. |
| RULE-044 | `CustomerCardTests` (3) | |
| RULE-045 | `OnlineBookingTests` (3) | |
| RULE-047 | `AppointmentDecisionTests` (3) | |
| RULE-049 | `EntryLifecycleTests` (2) | |
| RULE-050 | `EntryLifecycleTests` | |
| RULE-054 | `EntryLifecycleTests` (2) | |
| RULE-056 | `CustomerCardTests` | The calendar-entry cascade is SQL-only and not asserted |

**Also pinned as today's behavior** (Wrong rules, to change deliberately in Phase 5): RULE-019 (5 tests), RULE-021 (6 API + 6 browser regex), RULE-023 (7), RULE-046 (2).

**Extras:** RULE-009, 010, 011, 015 (browser) and RULE-048, 052, 053 (API).

**DELTA-007 pins:** `type-selector.spec.ts` and `hamburger/button.spec.ts`. One event per action reaches the parent today, plus the hamburger's initial `false` on creation.

## Known limits of this baseline

- **EF Core InMemory, not SQL Server** (owner's choice; SQLite cannot translate the `DateTimeOffset` comparisons). There is no collation, no `decimal(10,2)` or max-length enforcement, LINQ runs in memory, and there are no SQL cascades for rows not being tracked. Matching and search that depend on collation (RULE-032, RULE-036 case) are pinned only for exact-case input.
- **Captcha Production path** and real SMTP are not exercised. Email is captured from `EmailClientStub` by a recording decorator.
- **ICU:** the working-week labels and admin money formatting come from Node's ICU (78.3), so a Node change could move those specs (watch in Phase 2).
- **SSR baseline uses an unreplaced build:** pages carry the `_-_-applicationUrl-_-_` canonical token, as the CI build does before deploy-time token replacement.

## Findings the harness surfaced (not yet in BUSINESS_RULES.md)

1. **RULE-004:** the money message is formatted in the request culture (English digits inside a Serbian sentence for `Accept-Language: en`).
2. **RULE-045:** an unsupported `Accept-Language` (for example `de`) is stored as `sr`.
3. **RULE-036:** booking emails are lower-cased before matching, but client-card emails are stored as typed. Mixed-case card emails match only because of the SQL collation.
4. **RULE-023 (browser):** `TimeInterval` checks only order and duration. 18:00–22:15 and 14:10–15:10 pass it; only the combobox options keep them out.
5. **RULE-009:** clearing the money field resumes following the total only on the next change to the treatment total.
6. **RULE-015:** the money pipe has no decimal handling (`1234.5` → `"1.234.5"`); the admin formatter rounds instead.
7. **SSR metadata:**
   - `request-sent` renders an empty title and description.
   - `klijent-obavešten` keeps the default metadata, and its slug is untranslated in every locale.
   - The public gallery is client-rendered.
8. **`EmailClientStub`** names pickup files by `DateTime.UtcNow.Ticks`, so two emails in one tick overwrite each other (dev/test only).
9. **DELTA-007 premise corrected:** one event per action, not two. See the correction in `DELTA_CATALOG.md`.
