using FluentValidation;
using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Configurations.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

namespace Gmf.Marush.Care.Api.Validation;

public class AppointmentRequestValidator : AbstractValidator<AppointmentRequest>
{
    public AppointmentRequestValidator()
    {
        _ = this.SetupValidationFor(request => request.Name);
        _ = this.SetupValidationFor(request => request.Surname);
        _ = this.SetupValidationFor(request => request.Email)
            .EmailAddress()
            .WithMessage(Labels.ValidationEmail);
        _ = this.SetupValidationFor(request => request.Phone, true, PhonesConfiguration.PhoneLength)
            .Matches(Customer.PhoneRegex)
            .WithMessage(Labels.ValidationPhone);

        _ = RuleFor(request => request.Date)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must(date => new AppointmentBookingWindow(DateOnly.FromDateTime(DateTime.Now)).Contains(date))
            .WithMessage(Labels.ValidationInterval);
        _ = RuleFor(request => request.Time)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must((request, time) =>
            {
                int[] allowedMinutes = [0, 15, 30, 45];
                return time.Hour is >= 12 and < 21 && allowedMinutes.Contains(time.Minute);
            })
            .WithMessage(Labels.ValidationInterval);
        _ = RuleFor(appointment => appointment.Email)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .EmailAddress()
            .WithMessage(Labels.ValidationEmail);
        _ = RuleFor(request => request.Sum)
            .Must(sum => sum is >= 0 and <= (int)AppointmentConfiguration.MaximumMoney)
            .WithMessage(Labels.ValidationLength);
        _ = RuleForEach(request => request.SerbianTreatments)
            .NotEmpty()
            .WithMessage(Labels.ValidationRequired)
            .MaximumLength(AppointmentTreatmentConfiguration.NameLength)
            .WithMessage(Labels.ValidationLength);
        _ = RuleFor(request => request.SerbianTreatments)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must(treatments => treatments.Count() <= TreatmentSelection.MaximumTreatments)
            .WithMessage(Labels.ValidationLength);
    }
}
