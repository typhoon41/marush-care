using FluentValidation;
using Gmf.Marush.Care.Api.Models.Calendar;

namespace Gmf.Marush.Care.Api.Validation;
public class CalendarEntryValidator : AbstractValidator<CalendarEntryRequest>
{
    private static readonly TimeOnly CalendarStart = new(11, 0);
    private static readonly TimeOnly CalendarEnd = new(22, 0);

    public CalendarEntryValidator()
    {
        _ = RuleFor(x => x.Date).NotEmpty();
        _ = RuleFor(x => x.StartTime)
            .Must(t => t >= CalendarStart && t < CalendarEnd)
            .WithMessage("Start time must be between 11:00 and 22:00.");
        _ = RuleFor(x => x.EndTime)
            .Must(t => t > CalendarStart && t <= CalendarEnd)
            .WithMessage("End time must be between 11:00 and 22:00.")
            .Must((req, end) => end > req.StartTime)
            .WithMessage("End time must be after start time.")
            .Must((req, end) => (end - req.StartTime).TotalMinutes % 15 == 0)
            .WithMessage("Duration must be a multiple of 15 minutes.");
        _ = RuleFor(x => x.StartTime)
            .Must(t => t.Minute % 15 == 0)
            .WithMessage("Start time must align to a 15-minute boundary.");
        _ = RuleFor(x => x.CustomerId).NotEmpty().When(x => !x.AppointmentId.HasValue);
        _ = RuleFor(x => x.Notes).MaximumLength(1000);
        _ = RuleFor(x => x.Money).GreaterThanOrEqualTo(0).When(x => x.Money.HasValue);
    }
}
