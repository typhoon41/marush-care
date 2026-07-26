using FluentValidation;
using Gmf.Marush.Care.Api.Models.Calendar;

namespace Gmf.Marush.Care.Api.Validation;
public class NewCalendarEntryDtoValidator : AbstractValidator<NewCalendarEntryDto>
{
    // Must stay in sync with CalendarEntryTreatmentConfiguration.NameLength in Infrastructure.
    private const int TreatmentNameLength = 200;
    // Notes are stored as the appointment description; must stay in sync with the client edit page limit.
    private const int NotesLength = 6000;
    private const int MaximumTreatments = 20;
    private static readonly TimeOnly CalendarStart = new(11, 0);
    private static readonly TimeOnly CalendarEnd = new(22, 0);

    public NewCalendarEntryDtoValidator()
    {
        _ = RuleFor(x => x.Date).NotEmpty();
        _ = RuleFor(x => x.StartTime)
            .Must(t => t >= CalendarStart && t < CalendarEnd)
            .WithMessage("Vreme početka mora biti između 11:00 i 22:00.");
        _ = RuleFor(x => x.EndTime)
            .Must(t => t > CalendarStart && t <= CalendarEnd)
            .WithMessage("Vreme kraja mora biti između 11:00 i 22:00.")
            .Must((request, end) => end > request.StartTime)
            .WithMessage("Vreme kraja mora biti posle vremena početka.")
            .Must((request, end) => (end - request.StartTime).TotalMinutes % 15 == 0)
            .WithMessage("Trajanje mora biti na 15 minuta.");
        _ = RuleFor(x => x.StartTime)
            .Must(t => t.Minute % 15 == 0)
            .WithMessage("Vreme početka mora biti na 15 minuta.");
        _ = RuleFor(x => x.CustomerId).NotEmpty().When(x => !x.AppointmentId.HasValue);
        _ = RuleFor(x => x.Notes).MaximumLength(NotesLength);
        _ = RuleFor(x => x.Money).GreaterThanOrEqualTo(0).When(x => x.Money.HasValue);
        _ = RuleForEach(x => x.Treatments).NotEmpty().MaximumLength(TreatmentNameLength)
            .WithMessage($"Naziv tretmana mora imati između 1 i {TreatmentNameLength} karaktera.");
        _ = RuleFor(x => x.Treatments)
            .Must(treatments => treatments.Count() <= MaximumTreatments)
            .WithMessage($"Najviše {MaximumTreatments} tretmana po terminu.");
    }
}
