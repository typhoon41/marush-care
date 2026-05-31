using FluentValidation;
using Gmf.Marush.Care.Api.Models.Calendar;

namespace Gmf.Marush.Care.Api.Validation;
public class NewCalendarNoteDtoValidator : AbstractValidator<NewCalendarNoteDto>
{
    public NewCalendarNoteDtoValidator()
    {
        _ = RuleFor(x => x.Date).NotEmpty();
        _ = RuleFor(x => x.NoteType).Must(t => t is "Daily" or "Weekly" or "NonWorkingDay").WithMessage("Vrsta napomene mora biti 'Daily', 'Weekly' ili 'NonWorkingDay'.");
        _ = RuleFor(x => x.Content).NotEmpty().MaximumLength(2000).When(x => x.NoteType != "NonWorkingDay");
    }
}
