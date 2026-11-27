# Rule reviews: marush

The person who knows the business reviewed the 22 flagged P0 rules from `BUSINESS_RULES.md` on 2026-11-27. Flagged means a suspected defect, an SME question or below-High confidence. **17 are Right, 5 are Wrong or not wanted, and 0 need discussion.**

The rules marked Wrong (RULE-006, 019, 021, 023, 046) are known bugs to fix, under INTENT.md "Fix known bugs". They are not settled: `brief` lists them as open questions and intended differences, never as Behavior Contract anchors.

**Conflict to resolve:** RULE-030 (captcha AND logic) was confirmed as correct. The pending security patch SEC-001 (`security_remediation.patch`) changes exactly this behavior to OR, and checks the action on the server. Settle it before `brief`: either drop SEC-001 or change this review to Wrong.

Several Right verdicts keep behavior that the extraction flagged as a suspected defect: RULE-003, 033, 037, 054 and 056. They are now the intended legacy behavior and must be preserved exactly.

| Rule | Verdict | When | Title | Note |
|---|---|---|---|---|
| RULE-001 | Right | 2026-11-27T19:01:52+00:00 | Online booking price is the sum of selected treatment prices |  |
| RULE-002 | Right | 2026-11-27T19:01:52+00:00 | Online booking end = start + summed duration, in server-local time |  |
| RULE-003 | Right | 2026-11-27T19:01:52+00:00 | Server accepts the browser's price and duration unchecked |  |
| RULE-006 | Wrong / not wanted | 2026-11-27T19:01:52+00:00 | Calendar entries and online requests store time differently | Should be unified: one time-storage form (chosen option). |
| RULE-012 | Right | 2026-11-27T19:01:52+00:00 | Treatment prices and durations are fixed in the browser |  |
| RULE-017 | Right | 2026-11-27T19:01:52+00:00 | Online booking window: today to the same day next month, weekdays only |  |
| RULE-019 | Wrong / not wanted | 2026-11-27T19:01:52+00:00 | Online start time 12:00–20:45 on quarter hours (UI offers only to 20:00) | Last online start should match the UI (20:00) and/or the booking must end by closing time (chosen option). |
| RULE-021 | Wrong / not wanted | 2026-11-27T19:01:52+00:00 | Phone must be a Serbian mobile or international number, max 16 characters | Server regex should be anchored like the browser regex (chosen option). |
| RULE-023 | Wrong / not wanted | 2026-11-27T19:01:52+00:00 | Admin entry: 11:00–22:00, 15-minute grid, at most 4 hours | Sundays / non-working days should be blocked for admin entries (chosen option). |
| RULE-030 | Right | 2026-11-27T19:01:52+00:00 | Captcha verdict: rejected only if the token is invalid AND the score < 0.25 | Confirmed as current behavior. Conflicts with the pending security patch SEC-001 (OR logic + server-side action): resolve before brief. |
| RULE-031 | Right | 2026-11-27T19:01:52+00:00 | Admin login: password-hash check, audit on success and failure |  |
| RULE-033 | Right | 2026-11-27T19:01:52+00:00 | Slot conflict: no overlap, back-to-back allowed (admin entries only) |  |
| RULE-036 | Right | 2026-11-27T19:01:52+00:00 | Returning client matched only when both email and phone match |  |
| RULE-037 | Right | 2026-11-27T19:01:52+00:00 | Decision link: anonymous GET, date taken from the query, fixed Serbian redirects |  |
| RULE-038 | Right | 2026-11-27T19:01:52+00:00 | JWT: signed, bound to issuer and audience, expires after configured minutes |  |
| RULE-039 | Right | 2026-11-27T19:01:52+00:00 | Client and calendar APIs accept any logged-in user (no roles) |  |
| RULE-041 | Right | 2026-11-27T19:01:52+00:00 | Admin user creation exists only in DEBUG builds |  |
| RULE-042 | Right | 2026-11-27T19:01:52+00:00 | Database commit condition per request |  |
| RULE-046 | Wrong / not wanted | 2026-11-27T19:01:52+00:00 | A booking is saved only if both notification emails are sent | Email order / atomicity of the booking save should change (chosen option). |
| RULE-050 | Right | 2026-11-27T19:01:52+00:00 | Placing an online request on the calendar keeps its status |  |
| RULE-054 | Right | 2026-11-27T19:01:52+00:00 | Deleting a calendar entry hard-deletes its appointment silently |  |
| RULE-056 | Right | 2026-11-27T19:01:52+00:00 | Saving the client card marks history visits Performed and deletes other appointments |  |
