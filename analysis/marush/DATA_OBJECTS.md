# Data objects: marush

Core records, with their typed fields, the rules that use them, and where they live. Paths are relative to `legacy/marush`. Tables are from the EF configurations and the single migration `20241105222844_InitialCreate`.

## Persistence records (SQL Server, `Site/Gmf.Marush.Care.Infrastructure/Data/Entities/`)

| Record (table) | Fields | Used by | Location |
|---|---|---|---|
| **AppointmentDto** (`Appointments`) | Id Guid · CustomerId Guid · Email string? (composite FK with CustomerId to CustomerEmails) · Phone string (composite FK to CustomerPhones) · Language string?(2) · ScheduledFor DateTimeOffset (required) · ExpectedEndTime DateTimeOffset? · Description string · Money decimal?(10,2) · BookedOnline bool · Status → AppointmentStatusDto · Treatments list | RULE-004, 005, 006, 008, 033, 044–051, 054–056 | `Appointments/AppointmentDto.cs` |
| **AppointmentStatusDto** (`AppointmentStatus`) | Id Guid · Name string(100). Seeded with the 4 statuses. | RULE-044, 047, 055 | `Appointments/AppointmentStatusDto.cs` |
| **AppointmentTreatmentDto** (`AppointmentTreatments`) | AppointmentId Guid · Name string(200). De-duplicated on save. | RULE-022, 025, 051 | `Appointments/AppointmentTreatmentDto.cs` |
| **CalendarEntryDto** (`CalendarEntries`) | Id Guid · AppointmentId Guid (required, 1:1, cascade delete) | RULE-033, 049–051, 054 | `Calendar/CalendarEntryDto.cs` |
| **CalendarNoteDto** (`CalendarNotes`) | Id Guid · Date DateOnly · NoteType Guid (Daily / Weekly / NonWorkingDay) · Content string(2000). Upserted per (Date, NoteType). | RULE-029, 035 | `Calendar/CalendarNoteDto.cs` |
| **CustomerDto** (`Customers`) | Id Guid · Name string(100) · Surname string(100) · Properties · Phones · Emails · Appointments | RULE-026, 032, 036, 056 | `Customers/CustomerDto.cs` |
| **CustomerPropertiesDto** (`CustomerProperties`) | DateOfBirth? · PlaceOfResidence(100) · Diagnosis(1024) · Allergies(1024) · Comments(4096) · Notes/Remarks(4096) · LastEditAt DateTime (UTC) · LastEditedBy → UserDto. **Holds health data.** | RULE-026–028, 039 | `Customers/CustomerPropertiesDto.cs` |
| **CustomerPhoneDto** (`CustomerPhones`) | (CustomerId, PhoneNumber string(16)) composite key | RULE-021, 026, 036 | `Customers/CustomerPhoneDto.cs` |
| **CustomerEmailDto** (`CustomerEmails`) | (CustomerId, Email string(100)) composite key | RULE-026, 036 | `Customers/CustomerEmailDto.cs` |
| **UserDto** (`Users`) | Id Guid · Username string · Password string (ASP.NET Identity hash) · carries domain events | RULE-031, 038, 041 | `UserDto.cs` |

## Domain records (`Site/Gmf.Marush.Care.Domain/`)

| Record | Fields | Used by |
|---|---|---|
| **AppointmentStatus** (Enumeration) | Requested · Rejected · Approved · Performed (fixed GUIDs). `IsExecuted()` = Approved or Performed. | RULE-044, 047, 056 |
| **AppointmentDecision** | AppointmentId Guid · NewStatus Guid. `MadeOnOutdated(status)` = not Requested. | RULE-047 |
| **Customer** | Name · Surname · Email (lower-cased) · Phone. `PhoneRegex`. | RULE-020, 021, 036 |
| **TreatmentSelection** | Treatments list · Money. `MaximumTreatments` = 20. | RULE-003, 022 |
| **Period** (`Packages/Gmf.DDD.Common/Abstractions/Period.cs`) | StartDate · EndDate (UTC). Throws when the start is after the end. | RULE-002, 003 |
| **CalendarEntry** | Id · AppointmentId? · CustomerId · Date · StartTime · EndTime · Notes? · Money? · Treatments · ClientName · BookedOnline | RULE-023–025, 033, 034, 049–051 |
| **CalendarPeriod** | Date · StartTime · EndTime (record equality decides "moved") | RULE-034, 052, 053 |
| **CalendarBooking** | Wraps the slot check: new or moved entry → `CalendarSlotTakenException` (409) | RULE-033, 034 |
| **CalendarWeek / CalendarWeekRange** | Monday · 6 working days | RULE-007 |
| **AppointmentRescheduled** (event) | Email · Language · Previous · Current | RULE-052, 053 |
| **UserAuthenticated / UserAuthenticationFailure / UserCreated** (events) | Username · UserId? · IP · User-Agent · Referrer | RULE-031, 043 |

## API request models (`Site/Gmf.Marush.Care.Api/Models/`)

| Record | Fields | Used by |
|---|---|---|
| **AppointmentRequest** | Name · Surname · Email · Phone · Treatments[] · SerbianTreatments[] · Sum int · Date DateOnly · Time TimeOnly · Duration int (minutes) | RULE-001–003, 017, 019–022, 045 |
| **AppointmentDecision** (query) | AppointmentId Guid · Accepted bool · Date string (display only, from the URL) | RULE-037, 047 |
| **NewCalendarEntryDto / CalendarEntryDto** | Date · StartTime · EndTime · CustomerId? · AppointmentId? · Notes(6000) · Money? · Treatments[] | RULE-023–025 |
| **NewCalendarNoteDto** | Date · NoteType · Content | RULE-029 |
| **NewCustomerDto / CustomerDto** | Name · Surname · Emails[] · Phones[] · Properties · Appointments[] (date + description) | RULE-026–028, 056 |
| **PaginatedRequest / PaginatedResponse** (`Packages/Gmf.Net.Core.Common/Requests/`) | PageNumber = 1 · PageSize = 20 · SortBy · Descending → Results · TotalCount · TotalPages | RULE-014 |

## Client-side data (`Site/Gmf.Marush.Care.App/src/app/`)

| Record | Fields | Used by |
|---|---|---|
| **TreatmentDefinition** (`shared/models/services/treatments/`) | title (localized) · name (Serbian key) · price RSD · duration min · rangedPrice? · rangedDuration? · showDuration? · description? | RULE-001, 010, 012 |
| **Discount definitions** (`features/home/page-metadata.model.ts`) | title · original price · discounted price · validThrough 2026-11-27 | RULE-013 |
| **Auth token** (localStorage key `token`) | JWT string | RULE-040 |
