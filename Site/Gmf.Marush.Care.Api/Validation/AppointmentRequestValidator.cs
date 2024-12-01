using System.Linq.Expressions;
using FluentValidation;
using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

namespace Gmf.Marush.Care.Api.Validation;

public class AppointmentRequestValidator : AbstractValidator<AppointmentRequest>
{
    private const string PhoneRegex = @"^(06\d{7,8})|(\+\d{10,13})$";

    public AppointmentRequestValidator()
    {
        _ = SetupValidationFor(request => request.Name);
        _ = SetupValidationFor(request => request.Surname);
        _ = SetupValidationFor(request => request.Email)
            .EmailAddress()
            .WithMessage(Labels.ValidationEmail);
        _ = SetupValidationFor(request => request.Phone, PhonesConfiguration.PhoneLength)
            .Matches(PhoneRegex)
            .WithMessage(Labels.ValidationPhone);

        _ = RuleFor(request => request.Date)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must((request, date) => new Period(DateTime.UtcNow, DateTime.UtcNow.AddDays(32)).Contains(date.ToDateTime(new TimeOnly(0))))
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
    }

    private IRuleBuilderOptions<AppointmentRequest, string> SetupValidationFor(Expression<Func<AppointmentRequest, string>> property, int? length = null)
    {
        var lengthToSet = length ?? CustomerConfiguration.DefaultLength;
        return RuleFor(property)
        .NotNull()
        .WithMessage(Labels.ValidationRequired)
        .MaximumLength(lengthToSet)
        .WithMessage(Labels.ValidationLength);
    }
}
