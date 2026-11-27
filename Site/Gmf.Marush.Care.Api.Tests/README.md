# Gmf.Marush.Care.Api.Tests

Characterization and contract tests for the backend. They pin what the API does **today**, known quirks included, so later
modernization phases can prove nothing changed. A test that fails after a change means behavior changed. Either the change is
a regression, or it is an intended difference that is listed and accepted in `analysis/marush/`. Never edit a test just to make it green.

## Run

```bash
dotnet test Site/Gmf.Marush.Care.Api.Tests                 # Debug: RULE-041 expects api/user/create to exist
dotnet test Site/Gmf.Marush.Care.Api.Tests -c Release      # Release: RULE-041 expects it to be gone (404)
dotnet test Site/Gmf.Marush.Care.Api.Tests --logger "trx;LogFileName=api-baseline.trx" --results-directory <folder>
```

No database, SMTP server, Node.js or network access is needed.

## How the API is hosted

`Hosting/MarushApiFactory` is a `WebApplicationFactory<Program>`. It runs the real `Program.cs`, `ApiRunner`, Autofac modules,
filters and validators, and changes only the edges:

| Edge | Under test |
|---|---|
| Environment | `Test`, the name the test deployment uses. Captcha is skipped (it runs only in Production); Swagger is on. |
| Configuration | `appsettings.Test.json`. Every value is a fake placeholder, never a real secret. |
| SQL Server | EF Core InMemory, one database per test class (`EnsureCreated` seeds the four `AppointmentStatus` rows). |
| SMTP | `Smtp:UsePickupDirectory=true`, so `EmailClientStub` writes `.eml` files to a temporary folder. `RecordingEmailClient` decorates it and records each email in `EmailOutbox`, which can also simulate an unreachable recipient. |
| Node.js SSR | `NodeJsRunnerService` is removed (Program.cs registers it outside Development). |
| Domain events | `RecordingDomainEventsHandler` decorates the real handler and records what was published after a commit. |

Two hosting traps, both worked around in the factory:

- `ConfigureTestContainer` is ignored under minimal hosting. Autofac changes go through `builder.ConfigureContainer` in `CreateHost`, which runs after Program's own `ConfigureContainer`.
- `SwaggerExtensions` loads `<entry assembly>.xml`, so this project generates its XML documentation file.

Clients use `https://localhost`, as production is served over HTTPS. The pipeline ends with `UseHttpsRedirection`, so an HTTP request that matches no endpoint could get a redirect instead of a 404.

### Known limits of EF Core InMemory

The real database is SQL Server. InMemory differs in ways these tests cannot see:

- There is no SQL collation, so string comparison is ordinal and case-sensitive (RULE-032 search, RULE-036 email matching).
- `decimal(10,2)` precision and `HasMaxLength` limits are not enforced.
- LINQ is evaluated in memory, so a query that SQL Server could not translate would still pass here.
- Database-level cascade deletes do not happen for rows that are not tracked.

Whatever depends on these needs a SQL Server run.

## Add a case

1. Find the rule in `analysis/marush/BUSINESS_RULES.md` and check its verdict in `RULE_REVIEWS.json`. For a rule marked `wrong`, pin today's behavior and say so in a comment.
2. Put the test in the class for the module that owns the behavior (`Booking/`, `Calendar/`, `Customers/`, `Security/`). Every class takes `MarushApiFactory` as an `IClassFixture`, so the tests in a class share one database. Give each test its own data: a fresh `OnlineBooking` or `CustomerCardBody` comes with a unique email, and calendar tests use dates no other test in the class uses.
3. Name the test after the rule: `Rule047_DecisionOnlyFromRequested_SecondDecisionChangesNothing`. `modernize-verify` finds tests by that id.
4. Use literal inputs and literal expected values. Booking dates come from `BookingWindow`, relative to the server clock, so they never go stale.
5. Write the expected value from what the code does. If that differs from `BUSINESS_RULES.md`, keep the observed value and report the difference.
