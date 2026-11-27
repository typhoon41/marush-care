# Business rules: marush

- **Date:** 2026-11-27
- **Source:** `legacy/marush` (junction to the worktree root), commit `5c909d1` (before the security patch, which is not applied)
- **Method:** Method B (no Workflow tool). Three business-rules-extractor agents ran in parallel, one each for calculations, validations and lifecycle.
  - They produced 72 candidate cards.
  - Merging cards that described the same behavior from different lenses (slot conflict ×3, captcha ×2, login ×2, sum/duration ×2, booking window ×2 and others) left **57 rules**.
  - Every P0 citation, and every suspected defect marked High, was re-read against the code. Front-end line numbers the agents got wrong were corrected; none was rejected.
- **Paths:** every `Source` is relative to `legacy/marush`.
- **Prompt-injection scan:** no instruction-shaped text aimed at automated analysis was found. Two items were flagged but are harmless: a "False positive" analyzer-suppression justification at `Packages/Gmf.Net.Core.Common/Logging/SerilogLogger.cs:31`, and base64 noise in `app_offline_template.htm`.
- **Comment-only claim, not used as a rule:** comments at `AppointmentBookingWindow.cs:5` and `AppointmentRequest.cs:29` say the server runs in Belgrade time. No code enforces it, so it is recorded as a suspected defect on RULE-002 and RULE-017.

## Summary

| ID | Name | Category | Priority | Source | Confidence |
|---|---|---|---|---|---|
| RULE-001 | Online booking price is the sum of selected treatment prices | Calculation | P0 | `Site/Gmf.Marush.Care.App/src/app/features/appointment/appointment-page.ts:46-83` | High |
| RULE-002 | Online booking end = start + summed duration, in server-local time | Calculation | P0 | `Site/Gmf.Marush.Care.Api/Models/AppointmentRequest.cs:15-32` | High |
| RULE-003 | Server accepts the browser's price and duration unchecked | Calculation | P0 | `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:42-55` | High |
| RULE-004 | Money is decimal(10,2), at most 99,999,999.99 RSD | Calculation | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Configurations/Appointments/AppointmentConfiguration.cs:12-31` | High |
| RULE-005 | An appointment without an end time lasts 1 hour | Calculation | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Appointments/AppointmentDto.cs:10-39` | High |
| RULE-006 | Calendar entries and online requests store time differently | Calculation | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Calendar/CalendarSlot.cs:10-22` | Medium |
| RULE-007 | Calendar week = Monday + 6 working days (Mon–Sat) | Calculation | P1 | `Site/Gmf.Marush.Care.Domain/Models/CalendarWeek.cs:8-16` | High |
| RULE-008 | A visit added on the client card covers the whole day | Calculation | P1 | `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Appointments/AppointmentDto.cs:77-89` | Medium |
| RULE-009 | Admin entry price follows the treatment total until edited | Calculation | P1 | `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/money-synchronization.ts:7-24` | High |
| RULE-010 | Admin treatment total counts an unknown treatment as 0 | Calculation | P1 | `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/treatment-selection.ts:12-17` | High |
| RULE-011 | Calendar grid: 44 quarter-hour slots, 11:00–22:00 | Calculation | P1 | `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/calendar-time-slots.ts:4-50` | High |
| RULE-012 | Treatment prices and durations are fixed in the browser | Calculation | P0 | `Site/Gmf.Marush.Care.App/src/app/shared/models/services/treatments/definitions/face-treatments.ts:4-60` | High |
| RULE-013 | Home-page discount prices are hardcoded with a fixed end date | Calculation | P2 | `Site/Gmf.Marush.Care.App/src/app/features/home/page-metadata.model.ts:7-34` | Medium |
| RULE-014 | Client-list pagination: defaults, page count, 3-page window, no limits | Calculation | P2 | `Packages/Gmf.Net.Core.Common/Requests/PaginatedResponse.cs:9` | High |
| RULE-015 | Money display formats | Calculation | P2 | `Site/Gmf.Marush.Care.Api/Models/Templates/BaseMarushRequestTemplate.cs:25-29` | High |
| RULE-016 | Salon phone display format | Calculation | P2 | `Site/Gmf.Marush.Care.Api/Models/StringExtensions.cs:5-9` | Medium |
| RULE-017 | Online booking window: today to the same day next month, weekdays only | Validation | P0 | `Site/Gmf.Marush.Care.Api/Validation/AppointmentBookingWindow.cs:12-19` | High |
| RULE-018 | Date picker mirrors the booking window | Validation | P2 | `Site/Gmf.Marush.Care.App/src/app/shared/components/forms/date-picker/date-picker.ts:54-86` | High |
| RULE-019 | Online start time 12:00–20:45 on quarter hours (UI offers only to 20:00) | Validation | P0 | `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:28-36` | Medium |
| RULE-020 | Booking name, surname and email are required and at most 100 characters | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:14-18` | High |
| RULE-021 | Phone must be a Serbian mobile or international number, max 16 characters | Validation | P0 | `Site/Gmf.Marush.Care.Domain/Models/Customer.cs:7` | High |
| RULE-022 | A booking lists at most 20 treatments of 1–200 characters each | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:45-55` | High |
| RULE-023 | Admin entry: 11:00–22:00, 15-minute grid, at most 4 hours | Validation | P0 | `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:13-34` | High |
| RULE-024 | Admin entry needs a client or a source online request | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:35` | High |
| RULE-025 | Admin entry money, notes and treatment limits | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:36-47` | High |
| RULE-026 | Client record field requirements | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:29-73` | High |
| RULE-027 | Client comments and remarks: server 4,096 vs browser 6,000 characters | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:72-73` | High |
| RULE-028 | Client birthday, if given, must be within the last 100 years | Validation | P1 | `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:65-67` | High |
| RULE-029 | Calendar note type and content | Validation | P2 | `Site/Gmf.Marush.Care.Api/Validation/NewCalendarNoteDtoValidator.cs:9-11` | High |
| RULE-030 | Captcha verdict: rejected only if the token is invalid AND the score < 0.25 | Validation | P0 | `Packages/Gmf.Net.Core.Common/Security/Response.cs:8` | High |
| RULE-031 | Admin login: password-hash check, audit on success and failure | Validation | P0 | `Site/Gmf.Marush.Care.Services/Domain/UserService.cs:33-47` | High |
| RULE-032 | Client search matches name, surname or full name as a substring | Validation | P2 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerRetrievalRepository.cs:29-32` | Medium |
| RULE-033 | Slot conflict: no overlap, back-to-back allowed (admin entries only) | Policy | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarRetrievalRepository.cs:36-53` | High |
| RULE-034 | Slot check runs only for new or moved entries | Policy | P1 | `Site/Gmf.Marush.Care.Domain/Models/CalendarBooking.cs:7-33` | High |
| RULE-035 | One note per date per type (a later save overwrites) | Policy | P2 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:75-86` | High |
| RULE-036 | Returning client matched only when both email and phone match | Policy | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerRetrievalRepository.cs:13-22` | Medium |
| RULE-037 | Decision link: anonymous GET, date taken from the query, fixed Serbian redirects | Policy | P0 | `Site/Gmf.Marush.Care.Api/Controllers/AppointmentController.cs:40-59` | High |
| RULE-038 | JWT: signed, bound to issuer and audience, expires after configured minutes | Policy | P0 | `Site/Gmf.Marush.Care.Api/Initialization/AuthenticationExtensions.cs:14-28` | Medium |
| RULE-039 | Client and calendar APIs accept any logged-in user (no roles) | Policy | P0 | `Site/Gmf.Marush.Care.Api/Controllers/CustomerController.cs:16` | High |
| RULE-040 | Browser admin pages check only that a token is stored | Policy | P1 | `Site/Gmf.Marush.Care.App/src/app/shared/guards/authenticated.ts:6-15` | High |
| RULE-041 | Admin user creation exists only in DEBUG builds | Policy | P0 | `Site/Gmf.Marush.Care.Api/Controllers/UserController.cs:33-41` | High |
| RULE-042 | Database commit condition per request | Policy | P0 | `Packages/Gmf.Net.Core.Common/Initialization/Filters/TransactionFilter.cs:8-22` | Medium |
| RULE-043 | Events dispatched after commit, in the background, best effort | Policy | P1 | `Packages/Gmf.Net.Core.Common/Persistence/BaseDbContext.cs:21-51` | High |
| RULE-044 | Appointment status set: Requested, Rejected, Approved, Performed | Lifecycle | P0 | `Site/Gmf.Marush.Care.Domain/Enumerations/AppointmentStatus.cs:4-12` | High |
| RULE-045 | An online request starts as Requested and is flagged booked-online | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/AppointmentRepository.cs:55-83` | High |
| RULE-046 | A booking is saved only if both notification emails are sent | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Services/AppointmentNotificationService.cs:21-33` | High |
| RULE-047 | Owner decision moves Requested to Approved or Rejected, once | Lifecycle | P0 | `Site/Gmf.Marush.Care.Domain/Models/AppointmentDecision.cs:4-11` | High |
| RULE-048 | Decision email uses the client's stored language; a failed send undoes the decision | Lifecycle | P1 | `Site/Gmf.Marush.Care.Infrastructure/Services/AppointmentNotificationService.cs:35-59` | High |
| RULE-049 | Admin entry without a request creates an Approved appointment | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarEntryAppointments.cs:52-72` | High |
| RULE-050 | Placing an online request on the calendar keeps its status | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarEntryAppointments.cs:19-48` | Medium |
| RULE-051 | Entry notes, price and treatments overwrite the appointment | Lifecycle | P1 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:15-58` | Medium |
| RULE-052 | Moving an entry raises a rescheduled event for the client | Lifecycle | P1 | `Site/Gmf.Marush.Care.Services/Domain/Calendar/CalendarService.cs:27-70` | High |
| RULE-053 | Reschedule email content and delivery | Lifecycle | P1 | `Site/Gmf.Marush.Care.Api/Services/AppointmentRescheduledHandler.cs:18-30` | High |
| RULE-054 | Deleting a calendar entry hard-deletes its appointment silently | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:60-73` | Medium |
| RULE-055 | Calendar shows pending or approved requests not yet placed | Lifecycle | P2 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarRetrievalRepository.cs:70-84` | High |
| RULE-056 | Saving the client card marks history visits Performed and deletes other appointments | Lifecycle | P0 | `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerModificationRepository.cs:83-119` | High |
| RULE-057 | Staff see a "client will be notified" warning when moving an entry | Lifecycle | P2 | `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/reschedule-warning.ts:8-22` | High |

**Totals:**
- **By category:** 16 Calculation, 16 Validation, 11 Policy, 14 Lifecycle.
- **By priority:** 28 P0, 19 P1, 10 P2.
- **By confidence:** 45 High, 12 Medium, 0 Low.
- **Defects:** 26 rules carry a suspected defect.

---

## Calculation

### RULE-001: Online booking price is the sum of selected treatment prices
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/appointment/appointment-page.ts:46-83`
**Plain English:** When a customer books online, the price sent to the salon is the sum of the catalog prices of the ticked treatments, with no discount, tax or rounding. The browser computes it and sends it as `sum`.
**Specification:**
  Given a customer selects "Klasičan higijenski tretman" (3,500 RSD) and "Dermapen" (6,500 RSD)
  When  they submit the booking form
  Then  `sum` = 10,000 and the summary shows a total of 10,000 RSD
**Parameters:** Prices come from the browser catalog (RULE-012). The sum starts at 0.
**Edge cases handled:** No treatments gives 0. Duplicates are not blocked here.
**Suspected defect:** The server never recomputes the price (RULE-003).
**Confidence:** High. The reduce (line 46) and the assignment (line 79) are explicit.

### RULE-002: Online booking end = start + summed duration, in server-local time
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Models/AppointmentRequest.cs:15-32`
**Plain English:** The browser adds up the selected treatment durations. The server reads the requested date and time as server-local time, sets the end to start plus that many minutes, and converts both to UTC for storage.
**Specification:**
  Given date 2026-12-01, time 14:30, and treatments of 60 + 60 minutes, on a server running Belgrade time (UTC+1 in December)
  When  the request is processed
  Then  the appointment runs 14:30–16:30 local and is stored as 13:30Z–15:30Z
**Parameters:** The time zone is whatever the server host uses (`DateTimeKind.Local`).
**Edge cases handled:** A start later than the end throws (`Packages/Gmf.DDD.Common/Abstractions/Period.cs:6-9`).
**Suspected defect:** Correct only if the host runs Europe/Belgrade time. Only a comment says so; on a UTC host every online booking would be shifted.
**Confidence:** High. SME: is the production host guaranteed to run Europe/Belgrade time? The rewrite should name the zone explicitly.

### RULE-003: Server accepts the browser's price and duration unchecked
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:42-55`
**Plain English:** The booking endpoint only checks that `Sum` is between 0 and 99,999,999. It never compares `Sum` with the catalog. `Duration` has no rule at all. Both are stored exactly as sent: `Sum` becomes the appointment's money, and `Duration` sets its end.
**Specification:**
  Given a request for "Dermapen" (catalog 6,500) with `sum` = 1 and `duration` = 600
  When  it is posted to /api/appointment
  Then  it is accepted, stored with money 1, and lasts 10 hours
**Parameters:** Sum range 0–99,999,999, which is `(int)99,999,999.99`.
**Edge cases handled:** A negative or oversized Sum is rejected.
**Suspected defect:**
- The price and duration can be tampered with.
- A negative Duration throws inside `Period`, giving a 500 instead of a 400.
- Duration 0 and very large durations are accepted, and a very long online request blocks the calendar (RULE-033).
- `Sum` is an `int`, so fractional amounts are impossible.
**Confidence:** High. Verified: there is no Duration rule in the validator. SME: should the server recompute price and duration from a server-side catalog? What duration range is allowed?

### RULE-004: Money is decimal(10,2), at most 99,999,999.99 RSD
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Configurations/Appointments/AppointmentConfiguration.cs:12-31`
**Plain English:** Appointment money is stored with 10 digits, 2 of them decimals. Admin entries may leave money empty; when present it must be 0–99,999,999.99 inclusive. Online requests use the whole-number limit 99,999,999.
**Specification:**
  Given an admin saves an entry with money 100,000,000.00
  When  validation runs
  Then  it is rejected with "Iznos mora biti između 0 i 99.999.999,99 RSD."
  And   12,500.50 is accepted and stored with 2 decimals
**Parameters:** MoneyPrecision 10, MoneyScale 2, MaximumMoney 99,999,999.99.
**Edge cases handled:** Empty money is allowed on entries, and so is 0.
**Confidence:** High.

### RULE-005: An appointment without an end time lasts 1 hour
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Appointments/AppointmentDto.cs:10-39`
**Plain English:** A stored appointment with no expected end time is treated as lasting 1 hour, both on the calendar and in the overlap check.
**Specification:**
  Given an approved online request starting 14:00 with no ExpectedEndTime
  When  the calendar draws it, or an entry is placed at 14:30–15:00
  Then  it shows 14:00–15:00, and the 14:30 entry is rejected as overlapping
**Parameters:** DefaultDuration = 1 hour.
**Edge cases handled:** The same fallback is used in memory and in the database query (`CalendarRetrievalRepository.cs:39,46`).
**Confidence:** High.

### RULE-006: Calendar entries and online requests store time differently
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Calendar/CalendarSlot.cs:10-22`
**Plain English:** An admin calendar entry stores the salon wall-clock time with offset zero (14:00 is stored as 14:00+00:00). An online request stores the real moment: server-local time converted to UTC. Each slot is built in both forms, so each kind of record is compared in its own form.
**Specification:**
  Given an admin entry on 2026-12-01 14:00–15:00 (Belgrade, UTC+1)
  When  it is saved
  Then  ScheduledFor = 2026-12-01T14:00+00:00
  And   an online request for the same wall-clock time stores 2026-12-01T13:00Z
**Parameters:** The server's local time zone.
**Edge cases handled:** The overlap check compares each kind against its matching form.
**Suspected defect:** The week query for online requests (`CalendarRetrievalRepository.cs:77`) compares UTC moments against a window built from offset-zero wall-clock times. Any reporting that mixes the two kinds is off by 1–2 hours.
**Confidence:** Medium. SME/dev: should the rewrite store one form (UTC plus an explicit Europe/Belgrade zone) and migrate the entry rows?

### RULE-007: Calendar week = Monday + 6 working days (Mon–Sat)
**Category:** Calculation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Domain/Models/CalendarWeek.cs:8-16`
**Plain English:** Any date is moved back to the Monday of its week; Sunday belongs to the previous week. The calendar covers Monday 00:00 to Saturday 23:59:59.9999999. The browser applies the same rule and moves 7 days for previous and next.
**Specification:**
  Given Sunday 2026-11-29
  When  the week is loaded
  Then  Monday is 2026-11-23, and the range runs from 2026-11-23 00:00 to 2026-11-28 23:59:59.9999999
**Parameters:** WorkingDaysInWeek 6, total days 7.
**Edge cases handled:** Sunday maps to the previous Monday.
**Confidence:** High.

### RULE-008: A visit added on the client card covers the whole day
**Category:** Calculation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/Appointments/AppointmentDto.cs:77-89`
**Plain English:** A visit added on the client edit page has only a date. It is stored from 00:00 to 23:59:59.9999999 at offset zero, with language "sr" and status Performed. Having no calendar entry, it never blocks a slot.
**Specification:**
  Given staff add a visit for 2026-10-05 on the client card
  When  the card is saved
  Then  it is stored from 2026-10-05T00:00+00:00 to 2026-10-05T23:59:59.9999999+00:00 with status Performed
**Parameters:** Language "sr", status Performed.
**Edge cases handled:** None.
**Confidence:** Medium. SME: are these history-only records that must never show on or block the calendar?

### RULE-009: Admin entry price follows the treatment total until edited
**Category:** Calculation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/money-synchronization.ts:7-24`
**Plain English:** In the entry dialog, money fills in automatically with the sum of the selected treatment prices, and a total of 0 leaves it empty. Once the admin types their own amount it stops following; clearing the field turns following back on. An existing entry starts in following mode only if its saved amount equals the current total or is empty.
**Specification:**
  Given a new entry with "PRX T33 piling" (6,000) selected
  When  "Dermapen" (6,500) is added
  Then  money becomes 12,500
  And   after the admin types 11,000, adding another treatment leaves 11,000
**Parameters:** A total of 0 maps to empty (null).
**Edge cases handled:** Old requests with no money keep following the total (`calendar-week-parser.ts:29-30`).
**Confidence:** High.

### RULE-010: Admin treatment total counts an unknown treatment as 0
**Category:** Calculation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/treatment-selection.ts:12-17`
**Plain English:** The dialog totals the catalog prices of the selected names. A name no longer in the catalog counts as price 0 and duration 0, and the same name cannot be selected twice.
**Specification:**
  Given selected names "Dermapen" (6,500) and a retired treatment that is no longer in the catalog
  When  the total is computed
  Then  it is 6,500
**Parameters:** Fallback price 0, fallback duration 0.
**Edge cases handled:** Duplicate selection is blocked.
**Confidence:** High.

### RULE-011: Calendar grid: 44 quarter-hour slots, 11:00–22:00
**Category:** Calculation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/calendar-time-slots.ts:4-50`
**Plain English:** The admin grid runs 11:00–22:00 in 15-minute slots: (22 − 11) × 4 = 44. Slot i starts at 11:00 + 15·i, and a time maps to slot (hour − 11) × 4 + floor(minute / 15), clamped to 0–44.
**Specification:**
  Given slot index 10
  When  it is converted to a time
  Then  it is 13:30
  And   13:40 maps to slot 10, and 23:00 clamps to 44
**Parameters:** Start hour 11, end hour 22, 4 slots per hour.
**Edge cases handled:** Out-of-grid times clamp to the edges; a cell is drawn at least 1 slot high.
**Confidence:** High.

### RULE-012: Treatment prices and durations are fixed in the browser
**Category:** Calculation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.App/src/app/shared/models/services/treatments/definitions/face-treatments.ts:4-60`
**Plain English:** Every treatment's price (RSD) and duration (minutes) is hardcoded in four Angular definition files: face, combination, brows/lashes and body. The server has no price list, and an appointment stores the Serbian treatment name as its key. `rangedPrice` and `rangedDuration` are display text only and never feed the totals.
**Specification:**
  Given the catalog
  When  prices are read
  Then  examples include Klasičan higijenski tretman 3,500 / 60 min, Premium higijenski tretman 5,000 / 90, PRX T33 piling 6,000 / 60, Dermapen 6,500 / 60, and Violeta tretman 6,500 / 120 (`combination-treatments.ts`)
**Parameters:** Whole-RSD prices across 4 definition files.
**Edge cases handled:** The ranged price and duration are display-only.
**Suspected defect:** A price change needs a front-end release. An old appointment keeps only its treatment names and the money it was saved with.
**Confidence:** High. SME: should the catalog move to server-side data with effective dates?

### RULE-013: Home-page discount prices are hardcoded with a fixed end date
**Category:** Calculation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/home/page-metadata.model.ts:7-34`
**Plain English:** Promotions are fixed text with an original and a discounted price, published as structured-data offers valid until 2026-11-27. They are never applied to a booking total and never hidden after the date passes.
**Specification:**
  Given the promotion "Prem. higij. tret. + Dermapen"
  When  the home page renders
  Then  it shows 11.500 → 9.500, with offer end date 2026-11-27
**Parameters:** 3 offers. End date 2026-11-27 (today). The slider advances every 10,000 ms.
**Edge cases handled:** None.
**Suspected defect:** Booking the same pair online sends the full catalog sum (11,500), not 9,500. The offers expire today.
**Confidence:** Medium. SME: should promotional prices apply to online bookings, and should expired offers hide automatically?

### RULE-014: Client-list pagination: defaults, page count, 3-page window, no limits
**Category:** Calculation
**Priority:** P2
**Source:** `Packages/Gmf.Net.Core.Common/Requests/PaginatedResponse.cs:9`
**Plain English:**
- **Server:** total pages = ceiling(total ÷ page size), or 0 when the size is 0 or less. The client list skips (page − 1) × size rows and sorts by name, then surname. Defaults are page 1 and size 20.
- **Browser:** shows up to 3 page buttons centred on the current page, and the client search uses size 8.
**Specification:**
  Given 41 clients and page size 20
  When  the page count is computed
  Then  it is 3
  And   on page 2 of 10 the buttons are 1, 2, 3
**Parameters:** Default size 20, search size 8, button window 3.
**Edge cases handled:** A page size of 0 or less gives 0 pages.
**Suspected defect:** The server does not clamp PageNumber or PageSize. PageNumber ≤ 0 gives a negative Skip (a 500), and an unlimited PageSize can dump every client.
**Confidence:** High.

### RULE-015: Money display formats
**Category:** Calculation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Api/Models/Templates/BaseMarushRequestTemplate.cs:25-29`
**Plain English:** Booking emails show the sum with "." as the thousands separator and no decimals. The public `money` pipe adds "." every 3 digits and shows "" for 0. The admin calendar uses the sr-RS locale with no decimals plus " RSD".
**Specification:**
  Given a sum of 12,500
  When  it is displayed
  Then  the email shows "12.500", the pipe shows "12.500", and an admin cell shows "12.500 RSD"
**Parameters:** Thousands separator ".", 0 fraction digits.
**Edge cases handled:** Zero or missing values.
**Confidence:** High.

### RULE-016: Salon phone display format
**Category:** Calculation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Api/Models/StringExtensions.cs:5-9`
**Plain English:** In emails, "+381" becomes "0", then "/" and "-" are inserted at fixed positions. This is applied to the salon's configured contact phone.
**Specification:**
  Given "+381641234567"
  When  it is formatted
  Then  it shows "064/123-45-67"
**Parameters:** Prefix "+381" becomes "0". Separators go at positions 3, 7 and 10.
**Edge cases handled:** None. A string shorter than 10 characters throws.
**Confidence:** Medium. SME: what is the official display format? It is one configured value, so a fixed string could replace the logic.

## Validation

### RULE-017: Online booking window: today to the same day next month, weekdays only
**Category:** Validation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Validation/AppointmentBookingWindow.cs:12-19`
**Plain English:** Online, a customer may request a Monday–Friday date from today up to and including the same calendar day next month (clamped to month end). The validator calls this with `DateOnly.FromDateTime(DateTime.Now)` and returns 400 otherwise.
**Specification:**
  Given today is Friday 2026-11-27 on the server clock
  When  requests ask for 2026-11-27, 2026-12-25 or 2026-12-28
  Then  the first two are accepted and 2026-12-28 is rejected; Saturdays and Sundays are always rejected
**Parameters:** Window `AddMonths(1)`. Excluded days are Saturday and Sunday.
**Edge cases handled:** 2026-01-31 gives a last day of 2026-02-28. Both ends are inclusive.
**Suspected defect:** "Today" is the server's local clock, and Belgrade time is stated only in a comment. Same-day booking has no time-of-day cutoff, so a time that has already passed can be requested.
**Confidence:** High. SME: should requests for a time already past be blocked, and is there a minimum lead time?

### RULE-018: Date picker mirrors the booking window
**Category:** Validation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.App/src/app/shared/components/forms/date-picker/date-picker.ts:54-86`
**Plain English:** On the public form, the picker disables weekends and limits dates to today through the same day next month. A `startDate` input (admin use) turns these limits off.
**Specification:**
  Given today is 2026-01-31 and the public form is open
  When  the user opens the picker
  Then  only weekdays from 2026-01-31 to 2026-02-28 can be chosen
**Parameters:** Minimum today. Maximum same day next month, clamped. Saturday and Sunday disabled.
**Edge cases handled:** Month-end clamping. `onBeforeSelect` blocks only Sunday; Saturday is blocked only by how cells render.
**Confidence:** High.

### RULE-019: Online start time 12:00–20:45 on quarter hours (UI offers only to 20:00)
**Category:** Validation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:28-36`
**Plain English:** The server accepts a start hour of 12–20 with minutes 00, 15, 30 or 45. The customer form offers only 12:00–20:00 (33 options, `customer-details.ts`). Nothing checks that start plus duration ends by closing time.
**Specification:**
  Given a request at 20:45
  When  it is validated
  Then  it is accepted (the UI never offers it), while 21:00 and 12:10 are rejected
**Parameters:** Hours 12–20. Minutes {0, 15, 30, 45}.
**Edge cases handled:** Minutes off the grid are rejected.
**Suspected defect:** The browser and server disagree on the last start (20:00 vs 20:45). A 20:45 start with a 3-hour treatment ends at 23:45, past the 22:00 admin grid.
**Confidence:** Medium. SME: is the last online start 20:00 or 20:45, and must a booking end by a closing time?

### RULE-020: Booking name, surname and email are required and at most 100 characters
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:14-18`
**Plain English:** Name, surname and email must be present and at most 100 characters, and the email must be email-shaped. The browser applies the same rules.
**Specification:**
  Given a request with a 101-character surname
  When  it is validated
  Then  the response is 400 with the length message
**Parameters:** Max length 100 (`CustomerConfiguration.DefaultLength`).
**Edge cases handled:** `SetupValidationFor` checks `NotNull`, not `NotEmpty`.
**Suspected defect:** An empty or blank name passes validation. The `Customer` constructor then throws `ArgumentException`, giving a 500 instead of a 400. Only crafted calls reach this.
**Confidence:** High.

### RULE-021: Phone must be a Serbian mobile or international number, max 16 characters
**Category:** Validation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Domain/Models/Customer.cs:7`
**Plain English:** Phones are checked against `^(06\d{7,8})|(\+\d{10,13})$` on booking requests and on every client phone, with a maximum of 16 characters on bookings.
**Specification:**
  Given phone "0641234567"
  When  it is validated
  Then  it is accepted, as is "+381641234567"; "0123" is rejected
**Parameters:** Local numbers are 06 plus 7–8 digits. International numbers are + plus 10–13 digits. Max length 16 (`PhonesConfiguration.PhoneLength`).
**Edge cases handled:** None beyond the regex.
**Suspected defect:** The regex is half-anchored: `^` binds only the first branch and `$` only the second. "0641234567abc" and "abc+38164123456" pass. The browser regex `^(?:06\d{7,8}|\+\d{10,13})$` is correct. Logged as SEC-015; the phone is HTML-encoded in email once the security patch is applied.
**Confidence:** High. Verified.

### RULE-022: A booking lists at most 20 treatments of 1–200 characters each
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/AppointmentRequestValidator.cs:45-55`
**Plain English:** The Serbian treatment list must be present, with at most 20 entries, each non-empty and at most 200 characters.
**Specification:**
  Given a request with 21 Serbian treatment names
  When  it is validated
  Then  it is rejected with 400
**Parameters:** `TreatmentSelection.MaximumTreatments` 20. `AppointmentTreatmentConfiguration.NameLength` 200.
**Edge cases handled:** A null list is rejected. Duplicate names are dropped on save (`AppointmentDto.cs`, `.Distinct()`).
**Suspected defect:**
- An empty list passes, so a booking with zero treatments is accepted.
- The English `Treatments` list is not validated at all.
- Names are never checked against the catalog.
**Confidence:** High. SME: must a booking include at least one treatment, and must names come from the catalog?

### RULE-023: Admin entry: 11:00–22:00, 15-minute grid, at most 4 hours
**Category:** Validation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:13-34`
**Plain English:** An entry must satisfy all of these; the browser mirrors them with a 16-slot cap:
- start ≥ 11:00, before 22:00, on a quarter hour;
- end > 11:00 and ≤ 22:00, after the start;
- length a multiple of 15 minutes and at most 4 hours.
**Specification:**
  Given an entry 18:00–22:00
  When  it is saved
  Then  it is accepted; 17:45–22:00 (4h15), 18:00–22:15 and 14:10–15:10 are rejected ("Termin ne može trajati duže od 4 sata.", "Trajanje mora biti na 15 minuta.")
**Parameters:** CalendarStart 11:00, CalendarEnd 22:00, step 15 minutes, MaximumDurationInHours 4.
**Edge cases handled:** A zero-length entry is rejected.
**Suspected defect:** There is no weekday or closed-day restriction: admin entries are accepted on Sundays, past dates and non-working days.
**Confidence:** High. Verified. SME: should admin entries be blocked on Sundays or on days marked non-working?

### RULE-024: Admin entry needs a client or a source online request
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:35`
**Plain English:** An entry not linked to an online request (no AppointmentId) must name a client. A missing request or client returns 404 and changes nothing. The browser checks the same thing (`entry-form-value.ts:31-33`).
**Specification:**
  Given a new entry with no client and no appointment
  When  it is saved
  Then  the response is 400
  And   with an unknown CustomerId the response is 404
**Parameters:** None.
**Edge cases handled:** An edit can reassign the client.
**Confidence:** High. Verified.

### RULE-025: Admin entry money, notes and treatment limits
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/NewCalendarEntryDtoValidator.cs:36-47`
**Plain English:** Notes are at most 6,000 characters. Money is optional and 0–99,999,999.99. Treatments are at most 20, each 1–200 characters, and the list must not be null. The browser only checks that money is not negative.
**Specification:**
  Given an entry with money 100,000,000.00
  When  it is saved
  Then  the response is 400 "Iznos mora biti između 0 i 99.999.999,99 RSD."
**Parameters:** Notes 6,000. MaximumMoney 99,999,999.99. 20 treatments of up to 200 characters.
**Edge cases handled:** A null money value skips the check.
**Confidence:** High.

### RULE-026: Client record field requirements
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:29-73`
**Plain English:** Creating or updating a client requires:
- name and surname of at most 100 characters each;
- at least one email, each non-empty and email-shaped;
- at least one phone, each matching RULE-021;
- a non-empty description on every history visit.

Optional limits are city 100, diagnosis 1,024, allergies 1,024, and comments and remarks 4,096 characters.
**Specification:**
  Given a new client with no emails
  When  it is saved
  Then  the response is 400 (emails required)
**Parameters:** DefaultLength 100, IssuesLength 1,024, AttachmentsLength 4,096.
**Edge cases handled:** Optional fields may be null.
**Suspected defect:** The server has no per-item length check:
- **Emails:** the column is 100 characters; the browser enforces 100.
- **Phones:** the column is 16 characters; the browser checks no length.
- **Visit descriptions:** the column has no limit; the browser caps at 6,000.

Oversized values fail in the database rather than returning a 400.
**Confidence:** High.

### RULE-027: Client comments and remarks: server 4,096 vs browser 6,000 characters
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:72-73`
**Plain English:** The server caps comments and remarks at 4,096 characters, matching the database columns. The browser form allows 6,000 (`Site/Gmf.Marush.Care.App/src/app/features/admin/clients/edit/request.ts:43-44`).
**Specification:**
  Given an admin types a 5,000-character remark
  When  they save
  Then  the browser accepts it but the server returns 400, which the user sees as a generic save failure
**Parameters:** Server 4,096. Browser 6,000.
**Edge cases handled:** Null is allowed.
**Suspected defect:** The browser and server disagree.
**Confidence:** High. Verified. SME: which limit is intended?

### RULE-028: Client birthday, if given, must be within the last 100 years
**Category:** Validation
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Validation/ValidatorExtensions.cs:65-67`
**Plain English:** A birthday must fall between 100 years ago and now (UTC). A missing birthday is treated as "50 years ago", so it always passes. The browser has no rule.
**Specification:**
  Given today is 2026-11-27
  When  birthday 2000-05-10 is saved
  Then  it is accepted
  And   1926-11-26 and any future date are rejected
**Parameters:** Maximum age 100 years.
**Edge cases handled:** The field is optional.
**Confidence:** High.

### RULE-029: Calendar note type and content
**Category:** Validation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Api/Validation/NewCalendarNoteDtoValidator.cs:9-11`
**Plain English:** A note needs a date and a type of Daily, Weekly or NonWorkingDay. Content is required and at most 2,000 characters, except that a NonWorkingDay note may be empty.
**Specification:**
  Given a note of type "Holiday"
  When  it is saved
  Then  the response is 400
  And   an empty NonWorkingDay note is accepted
**Parameters:** Types {Daily, Weekly, NonWorkingDay}. Content at most 2,000 characters.
**Edge cases handled:** The domain mapping falls back to Daily, but the validator stops unknown names first.
**Confidence:** High.

### RULE-030: Captcha verdict: rejected only if the token is invalid AND the score < 0.25
**Category:** Validation
**Priority:** P0
**Source:** `Packages/Gmf.Net.Core.Common/Security/Response.cs:8`
**Plain English:** In production, these calls must carry `Captcha` and `CaptchaAction` headers, which are assessed by Google reCAPTCHA Enterprise:
- booking (`AppointmentController.cs:24`);
- login (`UserController.cs:16`);
- client create and update (`CustomerController.cs:46,58`).

A missing header gives 400. A request is rejected only when the token is invalid **and** the score is below 0.25. Outside production the check is skipped.
**Specification:**
  Given production and a valid token with score 0.1
  When  a booking is posted
  Then  it is accepted
  And   only an invalid token with a score below 0.25 is rejected with 400
**Parameters:** Threshold 0.25. API key, site key and project come from `CaptchaSettings` (`<credential — masked>`).
**Edge cases handled:** Missing headers are rejected; non-production environments bypass the check.
**Suspected defect:**
- `&&` should be `||`.
- The expected action comes from the client's own header and is never compared with the token's action, so a token for one action can be replayed on another endpoint.
- Both are fixed by SEC-001 in `security_remediation.patch` (not yet applied).
**Confidence:** High. Verified.

### RULE-031: Admin login: password-hash check, audit on success and failure
**Category:** Validation
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Services/Domain/UserService.cs:33-47`
**Plain English:** Login succeeds only if the user exists and the password matches the stored hash.
- **Success:** issues a JWT and audits the username, user id, IP, browser and referrer.
- **Failure** (unknown user or wrong password, handled the same way): audits the username, IP, browser and referrer, and returns a plain 400.
**Specification:**
  Given user "owner" with a stored hash
  When  a login uses the wrong password from 1.2.3.4
  Then  the response is 400, no token is issued, and "Failed authentication attempt was caught for user owner from IP 1.2.3.4 …" is logged
**Parameters:** ASP.NET Identity `PasswordHasher`; only `Success` passes (`SuccessRehashNeeded` fails). The signing key is masked (config `Jwt`).
**Edge cases handled:** An unknown user is indistinguishable from a wrong password.
**Suspected defect:**
- There is no lockout or rate limit beyond the captcha.
- `SuccessRehashNeeded` is treated as a failure, which would lock users out after a hashing upgrade.
- The server has no length checks on username or password (the browser caps them at 64 and 512).
- The failure audit is saved only because a 400 still commits (RULE-042).
**Confidence:** High. SME: is there an account-lockout policy, and should a rehash-needed password still log the user in?

### RULE-032: Client search matches name, surname or full name as a substring
**Category:** Validation
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerRetrievalRepository.cs:29-32`
**Plain English:** A non-blank filter keeps clients whose name, surname or "name surname" contains the text. A blank filter returns everyone. The browser caps the search box at 100 characters; the server has no limit.
**Specification:**
  Given clients "Ana Petrović" and "Jana Ilić"
  When  filtering by "ana"
  Then  both match
  And   "Ana P" matches only Ana Petrović
**Parameters:** Browser maximum 100 characters.
**Edge cases handled:** A whitespace-only filter counts as no filter.
**Confidence:** Medium. Case and accent sensitivity depend on the SQL Server collation. SME/DBA: what is the production collation?

## Policy

### RULE-033: Slot conflict: no overlap, back-to-back allowed (admin entries only)
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarRetrievalRepository.cs:36-53`
**Plain English:** A slot is taken when another appointment overlaps it: the other starts before the new end and ends after the new start. Appointments that count:
- every appointment that has a calendar entry, whatever its status;
- online requests in Requested or Approved status that have no entry yet.

The appointment being saved is ignored, and a missing end counts as start + 1 hour. A conflict raises `CalendarSlotTakenException` and returns 409.
**Specification:**
  Given an entry 14:00–15:00 on 2026-12-02
  When  an admin saves a new entry 15:00–16:00 the same day
  Then  it is accepted
  And   14:30–15:30 gets 409
  And   a Rejected online request at 14:00 does not block
**Parameters:** Blocking request statuses are {Requested, Approved}. Default duration 1 hour.
**Edge cases handled:** Back-to-back slots, the record's own appointment, the two time-storage forms (RULE-006).
**Suspected defect:** Only admin calendar writes run this check. Public booking (`Site/Gmf.Marush.Care.Services/Domain/Appointment/Service.cs:12-23`) never checks occupancy, so two customers can request the same slot or a slot already filled. NonWorkingDay notes are ignored too.
**Confidence:** High. Verified. SME: should public booking reject taken slots, or is the owner's manual approval the intended guard?

### RULE-034: Slot check runs only for new or moved entries
**Category:** Policy
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Domain/Models/CalendarBooking.cs:7-33`
**Plain English:** A new entry always needs a free slot. An edit is checked only when the date, start or end changes, so entries that already overlap can still have their notes, price, client or treatments edited.
**Specification:**
  Given two entries that already overlap
  When  staff change only the price of one
  Then  the save succeeds without a slot check
  And   moving it from 14:00 to 14:15 runs RULE-033
**Parameters:** Period equality compares date, start and end (record equality).
**Edge cases handled:** As RULE-033.
**Confidence:** High.

### RULE-035: One note per date per type (a later save overwrites)
**Category:** Policy
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:75-86`
**Plain English:** Saving a note for a date and type that already has one replaces its content instead of adding a second note.
**Specification:**
  Given a Daily note "Dr. visit" on 2026-12-02
  When  a Daily note "Late start" is saved for the same date
  Then  the single Daily note reads "Late start"
**Parameters:** Key = (date, type).
**Edge cases handled:** A Weekly note is keyed by the exact date sent, not normalized to Monday.
**Suspected defect:** A NonWorkingDay note blocks neither public bookings nor admin entries.
**Confidence:** High. SME: should a non-working day close the day to online booking?

### RULE-036: Returning client matched only when both email and phone match
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerRetrievalRepository.cs:13-22`
**Plain English:** A public booking attaches to an existing client only if one client has both the given email and the given phone. Otherwise a new client is created (`Service.cs:12-23`). On a match, the stored name is kept and the submitted name is ignored.
**Specification:**
  Given client Ana with ana@x.rs and 0641234567
  When  a booking arrives with ana@x.rs and 0659999999
  Then  a second client "Ana" is created
  And   a booking with ana@x.rs and 0641234567 attaches to the existing Ana
**Parameters:** Match key = email AND phone, exact. The first match wins.
**Edge cases handled:** None.
**Suspected defect:**
- Duplicate clients pile up whenever one contact detail changes.
- The incoming email is lower-cased, but the comparison is plain equality, so matching depends on the database collation.
**Confidence:** Medium. Verified code; the intent is unclear. SME: should a booking match on email OR phone, and should a new name update the client?

### RULE-037: Decision link: anonymous GET, date taken from the query, fixed Serbian redirects
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Controllers/AppointmentController.cs:40-59`
**Plain English:** Anyone holding the owner's link can approve or reject a request; there is no login, captcha or signed token. The date shown in the customer's email comes from the query string. On success the browser goes to `https://marushcare.com/sr/klijent-obavešten`, otherwise to `https://marushcare.com/sr/greška/sistemska`, always the Serbian production pages.
**Specification:**
  Given a GET to /api/appointment/decision?appointmentId=A&accepted=true&date=03.12.2026
  When  A is Requested and the email is sent
  Then  the response is 302 to the client-notified page
  And   any failure redirects to the system-error page
**Parameters:** Both redirect URLs are hardcoded. The decision links are built from `Request.Host` (`AppointmentController.cs:65`).
**Edge cases handled:** None.
**Suspected defect:**
- **Not patched (Medium):** the appointment GUID is the only secret; mail link-scanners can trigger the GET; the test environment redirects to production; the host header is trusted (SEC-005, SEC-006).
- **Patched:** the date is HTML-encoded (SEC-002) but can still be spoofed.
**Confidence:** High.

### RULE-038: JWT: signed, bound to issuer and audience, expires after configured minutes
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Initialization/AuthenticationExtensions.cs:14-28`
**Plain English:** API calls must carry a token signed with the configured key. The server checks the issuer, audience, signature and expiry. Tokens carry the username and user id and expire `TokenExpiryTime` minutes after issue.
**Specification:**
  Given TokenExpiryTime = 60 and a token issued at 10:00 UTC
  When  it is used at 11:01 UTC
  Then  the call is rejected with 401 (subject to the default clock tolerance)
**Parameters:** HMAC-SHA256. The key, issuer, audience and expiry come from config (`<credential — masked>`; expiry is a deploy-time token in `appsettings.json`).
**Edge cases handled:** No refresh tokens and no revocation.
**Confidence:** Medium. SME: what is the production expiry in minutes?

### RULE-039: Client and calendar APIs accept any logged-in user (no roles)
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Controllers/CustomerController.cs:16`
**Plain English:** Every client operation (list, read, create, update, delete) and every calendar operation (`CalendarController.cs:11`) needs a valid login. Every authenticated user has full access, including to diagnosis and allergy fields. Client writes record the acting user's id.
**Specification:**
  Given no token
  When  GET /api/customer/{id} is called
  Then  the response is 401
  And   with any valid token the full record is returned
**Parameters:** No roles or policies.
**Edge cases handled:** Deleting an unknown id returns 404.
**Confidence:** High. SME: will any staff need restricted access to medical fields or delete?

### RULE-040: Browser admin pages check only that a token is stored
**Category:** Policy
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.App/src/app/shared/guards/authenticated.ts:6-15`
**Plain English:** The clients, client edit and calendar pages open only if a token is in browser storage; otherwise the user goes to the no-access page. The login page sends already-logged-in users to the client list.
**Specification:**
  Given localStorage holds an expired token
  When  the user opens the calendar
  Then  the page opens and its API calls fail with 401
**Parameters:** Storage key "token".
**Edge cases handled:** Logging out in one tab logs out the other tabs through the storage event.
**Confidence:** High.

### RULE-041: Admin user creation exists only in DEBUG builds
**Category:** Policy
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Api/Controllers/UserController.cs:33-41`
**Plain English:** The endpoint that creates accounts is compiled only into DEBUG builds, so production cannot create users through the API. When present, it needs only a captcha, which is itself skipped outside production.
**Specification:**
  Given a Release build
  When  POST /api/user/create is called
  Then  the response is 404
  And   in a Debug build anyone can create an account
**Parameters:** Compile flag DEBUG.
**Edge cases handled:** A duplicate or failed create returns 400.
**Confidence:** High. SME: how are production accounts provisioned?

### RULE-042: Database commit condition per request
**Category:** Policy
**Priority:** P0
**Source:** `Packages/Gmf.Net.Core.Common/Initialization/Filters/TransactionFilter.cs:8-22`
**Plain English:** Each API call is one unit of work, saved once at the end if no exception escaped, the model is valid and the response status is 2xx. The status is read after the action runs but **before its result executes**, so it is still the default 200. In practice this means "commit unless an exception or invalid input": 404, 400 and 302 results also commit.
**Specification:**
  Given a calendar update that returns NotFound() without an exception
  When  the filter runs
  Then  the status is read as 200 and the save runs
  And   a CalendarSlotTakenException (409) saves nothing
**Parameters:** 2xx = 200–299.
**Edge cases handled:** An earlier `CancelSaving()` skips the save.
**Suspected defect:** The 2xx check is ineffective. Existing behavior depends on it: the decision redirect (302) and the failed-login audit (400) are saved only because of it.
**Confidence:** Medium. Verified code (`TransactionFilter.cs:13-18`); based on ASP.NET Core filter ordering. SME/engineer: is "commit unless exception or invalid model" the intended rule? An uplift must not change it silently.

### RULE-043: Events dispatched after commit, in the background, best effort
**Category:** Policy
**Priority:** P1
**Source:** `Packages/Gmf.Net.Core.Common/Persistence/BaseDbContext.cs:21-51`
**Plain English:** Events attached to saved records, and queued business events (reschedule, login audits), are published only after a successful save. A background worker hands each to the audit logger and then the reschedule emailer. Errors are logged and the event is dropped.
**Specification:**
  Given a request that queued AppointmentRescheduled
  When  SaveChangesAsync succeeds
  Then  the event goes to in-memory storage and is handled by the audit handler, then the reschedule handler
  And   if the save throws, nothing is published
**Parameters:** In-memory dispatcher.
**Edge cases handled:** The design-time context uses `NoEventsDispatcher`.
**Suspected defect:** Events still queued when the process restarts are lost.
**Confidence:** High.

## Lifecycle

### RULE-044: Appointment status set: Requested, Rejected, Approved, Performed
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Domain/Enumerations/AppointmentStatus.cs:4-12`
**Plain English:** An appointment has exactly one of four statuses, stored as GUID-keyed `Enumeration` rows. Approved and Performed count as "executed": the visit is real and goes into the client's history.
**Specification:**
  Given an appointment with status Approved or Performed
  When  the system asks whether it is executed
  Then  the answer is yes; for Requested or Rejected it is no
**Parameters:** Fixed status GUIDs, seeded into `AppointmentStatus` (`AppointmentStatusConfiguration.cs:22-23`).
**Edge cases handled:** There is no Cancelled status: deleting an entry hard-deletes the appointment (RULE-054).
**Confidence:** High.

### RULE-045: An online request starts as Requested and is flagged booked-online
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/AppointmentRepository.cs:55-83`
**Plain English:** A public booking creates an appointment with status Requested and BookedOnline = true. It stores the requested start and end, the price, the treatments and the visitor's browsing language.
**Specification:**
  Given a visitor browsing in English requests 2026-12-03 10:00–11:30 for one treatment at 4,500
  When  the request is submitted
  Then  an appointment is created with Status Requested, BookedOnline true, Language "en", ScheduledFor 10:00, ExpectedEndTime 11:30, Money 4,500 and that treatment
**Parameters:** Language is `CultureInfo.CurrentCulture.TwoLetterISOLanguageName`, at most 2 characters.
**Edge cases handled:** For a known client, the existing email and phone rows are reused (RULE-036).
**Confidence:** High.

### RULE-046: A booking is saved only if both notification emails are sent
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Services/AppointmentNotificationService.cs:21-33`
**Plain English:** After a request, the owner gets an email with approve and reject links, then the customer gets a "request submitted" email. If either fails, the pending changes are detached and the request is not saved.
**Specification:**
  Given a valid booking request
  When  the owner email succeeds but the customer email throws
  Then  changes are detached, the error propagates, nothing is saved and the visitor sees an error
**Parameters:** The owner address is `SmtpSettings.Username`. The owner subject is the hardcoded "Marush: Space of Care - zahtev za zakazivanje termina". The customer subject is `Labels.AppointmentSubmitedTitle`.
**Edge cases handled:** The appointment GUID is generated before the save, so the owner email can carry it.
**Suspected defect:** The owner email goes first. If the customer email then fails, the owner holds approve and reject links for an appointment that was never saved.
**Confidence:** High.

### RULE-047: Owner decision moves Requested to Approved or Rejected, once
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Domain/Models/AppointmentDecision.cs:4-11`
**Plain English:** A decision sets the status to Approved (accept) or Rejected (reject), but only while the appointment is Requested. An unknown id, or an appointment that has already been decided, counts as outdated: nothing changes, and the redirect goes to the error page.
**Specification:**
  Given appointment A in status Requested
  When  the owner opens the accept link
  Then  A becomes Approved
  And   opening the reject link afterwards changes nothing
**Parameters:** Source status Requested. Target status Approved or Rejected.
**Edge cases handled:** An unknown id (`AppointmentRepository.cs:17-29`).
**Confidence:** High. Verified.

### RULE-048: Decision email uses the client's stored language; a failed send undoes the decision
**Category:** Lifecycle
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Services/AppointmentNotificationService.cs:35-59`
**Plain English:** The confirmation or rejection email is written in the language stored at booking and goes to the appointment's email address. If the send fails, the status change is discarded, so the request stays Requested and can be decided again.
**Specification:**
  Given a Requested appointment with Language "ru"
  When  the owner approves and SMTP succeeds
  Then  the customer gets the Russian confirmation and the appointment is Approved
  And   if SMTP throws, it stays Requested and the owner sees the error page
**Parameters:** Accept uses the confirmation template; reject uses the rejection template. Both include `ContactSettings.PhoneNumber`.
**Edge cases handled:** The thread culture is switched before the templates are built.
**Confidence:** High.

### RULE-049: Admin entry without a request creates an Approved appointment
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarEntryAppointments.cs:52-72`
**Plain English:** When staff put a client straight on the calendar, an appointment is created already Approved. It has language "sr", is not flagged booked-online, and is linked to the client's first phone and first email.
**Specification:**
  Given an existing client C
  When  staff create an entry for C on 2026-12-04 09:00–10:00
  Then  an Approved appointment and a CalendarEntry pointing to it are created
  And   for an unknown client nothing is created and the response is 404
**Parameters:** Language hardcoded "sr".
**Edge cases handled:** A client with no email gets a null email.
**Confidence:** High.

### RULE-050: Placing an online request on the calendar keeps its status
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarEntryAppointments.cs:19-48`
**Plain English:** Placing an online request on the calendar reuses the request record. It is reassigned to another client if staff chose one, and rescheduled to the entry's time. Its status is not changed, so it stays Requested.
**Specification:**
  Given a Requested online appointment R for client X
  When  staff create an entry from R and choose client Y
  Then  R is reassigned to Y, rescheduled and linked to a CalendarEntry, and stays Requested with BookedOnline true
**Parameters:** None.
**Edge cases handled:** With no client chosen, or the same client, R is not reassigned. A missing R or Y returns "not found" and changes nothing.
**Suspected defect:** Because R stays Requested, the owner's email link still works on it. The owner could later reject it, leaving a Rejected appointment on the calendar that still blocks the slot.
**Confidence:** Medium. SME: when a request is placed on the calendar, should it become Approved, and should the client be told?

### RULE-051: Entry notes, price and treatments overwrite the appointment
**Category:** Lifecycle
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:15-58`
**Plain English:** Creating or editing an entry copies its time, price and treatments onto the appointment. On create, blank notes keep the request's original description; on edit, blank notes clear it.
**Specification:**
  Given request R with description "allergic to latex"
  When  staff create an entry from R with empty notes
  Then  the description is kept
  And   a later edit with empty notes sets it to ""
**Parameters:** None.
**Edge cases handled:** Treatment rows still named are kept, removed ones are deleted and new ones added, de-duplicated.
**Confidence:** Medium. SME: should clearing notes on edit wipe the client's original request description?

### RULE-052: Moving an entry raises a rescheduled event for the client
**Category:** Lifecycle
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Services/Domain/Calendar/CalendarService.cs:27-70`
**Plain English:** If an edit changes an entry's date or time and the appointment has an email, an AppointmentRescheduled event is queued with the old and new periods, the email and the stored language.
**Specification:**
  Given an entry on 2026-12-04 10:00–11:00 for a client with an email and language "en"
  When  staff move it to 2026-12-05 12:00–13:00
  Then  AppointmentRescheduled is queued
  And   a notes-only change queues nothing
**Parameters:** Language falls back to "sr". No event when the email is blank (`CalendarRetrievalRepository.cs:86-93`).
**Edge cases handled:** No event when the update fails.
**Confidence:** High.

### RULE-053: Reschedule email content and delivery
**Category:** Lifecycle
**Priority:** P1
**Source:** `Site/Gmf.Marush.Care.Api/Services/AppointmentRescheduledHandler.cs:18-30`
**Plain English:** The reschedule email is written in the client's language and shows the old and new date and time in that culture's format, plus the salon phone. It is sent in the background after the commit.
**Specification:**
  Given an AppointmentRescheduled event for language "sr"
  When  the background handler processes it
  Then  an email titled AppointmentRescheduledTitle shows "04.12.2026. 10:00–11:00" and the new period, both in Serbian format
**Parameters:** `ContactSettings.PhoneNumber`. The period format is the date (`d`) plus start and end times (`t`) (`CalendarPeriod.cs:4-5`).
**Edge cases handled:** A failed send is only logged: no retry, nothing persisted.
**Confidence:** High.

### RULE-054: Deleting a calendar entry hard-deletes its appointment silently
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarModificationRepository.cs:60-73`
**Plain English:** Removing an entry deletes the entry and its appointment, including one that began as an online request. The client is not emailed, and no cancelled status is kept.
**Specification:**
  Given an entry created from online request R
  When  staff delete the entry
  Then  the entry and R are removed; no notification or audit is produced
**Parameters:** The appointment–entry link cascades on delete (`CalendarEntryConfiguration.cs:18-22`).
**Edge cases handled:** An unknown id returns 404.
**Confidence:** Medium. SME: should deleting an entry cancel the appointment (keep the history, notify the client) instead of erasing it?

### RULE-055: Calendar shows pending or approved requests not yet placed
**Category:** Lifecycle
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CalendarRetrievalRepository.cs:70-84`
**Plain English:** The weekly calendar shows a clickable "Onlajn zahtev" card for each Requested or Approved appointment in the week that has no entry yet; Rejected and Performed ones are hidden. Once placed, it shows as an entry marked "Onlajn zakazano".
**Specification:**
  Given request R (Requested, 2026-12-03 10:00) with no entry
  When  the admin opens that week
  Then  R appears as "Onlajn zahtev: …"
  And   clicking it pre-fills a new entry with the requested time, id, description and price
**Parameters:** Visible statuses {Requested, Approved}.
**Edge cases handled:** The pre-fill on click.
**Confidence:** High.

### RULE-056: Saving the client card marks history visits Performed and deletes other appointments
**Category:** Lifecycle
**Priority:** P0
**Source:** `Site/Gmf.Marush.Care.Infrastructure/Data/Repositories/CustomerModificationRepository.cs:83-119`
**Plain English:** The client card lists only executed visits (Approved or Performed), one per date. On save:
- a new date becomes a whole-day Performed visit (RULE-008);
- an existing executed visit on a listed date gets its description updated;
- **any** appointment whose date is not in the list is deleted, whatever its status.
**Specification:**
  Given client C with an Approved calendar visit on 2026-12-10 and a Requested online request on 2026-12-20
  When  staff save C's card listing 2026-12-10 and a new 2026-11-01 visit
  Then  2026-11-01 is added as Performed, 2026-12-10 is kept, and the 2026-12-20 request is deleted
**Parameters:** History visits are Performed with language "sr". The card shows only `IsExecuted()` visits (`CustomerDto.cs:44-48`).
**Edge cases handled:** None.
**Suspected defect:**
- `toRemove` is not filtered by `IsExecuted()`, so pending and rejected requests, which never appear on the card, are deleted on every save, and their calendar entries cascade-delete with them.
- Two executed visits on the same date make `ToDictionary` throw, so the card cannot be saved.
**Confidence:** High. Verified (`CustomerModificationRepository.cs:85-96`). SME: should saving the client card ever delete pending or rejected requests or calendar bookings?

### RULE-057: Staff see a "client will be notified" warning when moving an entry
**Category:** Lifecycle
**Priority:** P2
**Source:** `Site/Gmf.Marush.Care.App/src/app/features/admin/calendar/entry-dialog/reschedule-warning.ts:8-22`
**Plain English:** When staff edit an entry and change its date, start or end, the dialog warns that the client will be notified, matching when the server raises the event (RULE-052).
**Specification:**
  Given an entry 04.12.2026 10:00–11:00 open for editing
  When  staff change the start to 10:30
  Then  the warning appears
  And   it stays hidden for new entries and for notes-only changes
**Parameters:** None.
**Edge cases handled:** The warning also shows when the client has no email, although the server then sends nothing.
**Confidence:** High.

---

## Rules requiring SME confirmation

These are the Medium-confidence rules, plus High-confidence rules with an open question. P0 rules come first.

| Rule | Priority | Question |
|---|---|---|
| RULE-006 | P0 | Should the rewrite store one time form (UTC plus Europe/Belgrade) and migrate the entry rows? |
| RULE-019 | P0 | Is the last online start 20:00 (UI) or 20:45 (API)? Must a booking end by a closing time? |
| RULE-036 | P0 | Should a booking match an existing client on email OR phone? Should a new name update the client? |
| RULE-038 | P0 | What is the production JWT expiry in minutes? |
| RULE-042 | P0 | Is "commit unless exception or invalid model" the intended rule? The decision redirect and the failed-login audit depend on it. |
| RULE-050 | P0 | When a request is placed on the calendar, should it become Approved, and should the client be told? |
| RULE-054 | P0 | Should deleting an entry cancel the appointment (keep the history, notify the client) instead of erasing it? |
| RULE-002 | P0 | Is the production host guaranteed to run Europe/Belgrade time? |
| RULE-003 | P0 | Should the server recompute price and duration from a server-side catalog? What duration range is allowed? |
| RULE-012 | P0 | Should the treatment catalog move to server-side data with effective dates? |
| RULE-017 | P0 | Should requests for a time already past be blocked? Is there a minimum lead time? |
| RULE-023 | P0 | Should admin entries be blocked on Sundays or on non-working days? |
| RULE-030 | P0 | Confirm a request is rejected when the token is invalid OR the score is below 0.25 (SEC-001). |
| RULE-031 | P0 | Is there an account-lockout policy? Should a rehash-needed password still log the user in? |
| RULE-033 | P0 | Should public booking reject slots that are already taken, or is the owner's approval the guard? |
| RULE-039 | P0 | Will any staff need restricted access to medical fields or delete? |
| RULE-041 | P0 | How are production admin accounts provisioned? |
| RULE-056 | P0 | Should saving the client card ever delete pending or rejected requests or calendar bookings? |
| RULE-008 | P1 | Are client-card visits history-only, never shown on or blocking the calendar? |
| RULE-022 | P1 | Must a booking include at least one treatment? Must names come from the catalog? |
| RULE-027 | P1 | Is the comments and remarks limit 4,096 or 6,000 characters? |
| RULE-051 | P1 | Should clearing notes on edit wipe the original request description? |
| RULE-013 | P2 | Should promotional prices apply to online bookings? Should expired offers hide automatically? |
| RULE-016 | P2 | What is the official display format for the salon phone? |
| RULE-032 | P2 | What is the production SQL collation (case and accent sensitivity of search and matching)? |
| RULE-035 | P2 | Should a NonWorkingDay note close the day to online booking? |

**For `review`:** 22 P0 rules are flagged for a person, because each has a suspected defect, an SME question or below-High confidence:
- **Suspected defect or SME question:** RULE-001, 002, 003, 012, 017, 021, 023, 030, 031, 033, 037, 039, 041, 046 and 056.
- **Medium confidence:** RULE-006, 019, 036, 038, 042, 050 and 054.

Under INTENT.md ("Fix known bugs"), each defect is either preserved or listed as an intended difference.
