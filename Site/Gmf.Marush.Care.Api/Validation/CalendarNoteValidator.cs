using FluentValidation;
using Gmf.Marush.Care.Api.Models.Calendar;

namespace Gmf.Marush.Care.Api.Validation;
public class CalendarNoteValidator : AbstractValidator<CalendarNoteRequest>
{
    public CalendarNoteValidator()
    {
        _ = RuleFor(x => x.Date).NotEmpty();
        _ = RuleFor(x => x.NoteType).Must(t => t is "Daily" or "Weekly").WithMessage("Vrsta napomene mora biti 'Daily' ili 'Weekly'.");
        _ = RuleFor(x => x.Content).NotEmpty().MaximumLength(2000);
    }
}
