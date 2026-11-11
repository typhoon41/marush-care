using Gmf.Marush.Care.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public static class CalendarEntrySaveOutcomeMapping
{
    public static IActionResult ToActionResult(this CalendarEntrySaveOutcome outcome, IActionResult saved) =>
        outcome switch
        {
            CalendarEntrySaveOutcome.Saved => saved,
            CalendarEntrySaveOutcome.NotFound => new NotFoundResult(),
            CalendarEntrySaveOutcome.Overlapping => new ConflictResult(),
            _ => throw new InvalidOperationException($"Unknown calendar entry save outcome: {outcome}.")
        };
}
