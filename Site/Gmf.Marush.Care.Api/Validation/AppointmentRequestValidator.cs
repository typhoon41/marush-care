using FluentValidation;
using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Infrastructure.Data.Configurations;
using System.Linq.Expressions;

namespace Gmf.Marush.Care.Api.Validation;

public class AppointmentRequestValidator : AbstractValidator<AppointmentRequest>
{
    public AppointmentRequestValidator()
    {
        SetupValidationFor(request => request.Name);
        SetupValidationFor(request => request.Surname);
        SetupValidationFor(request => request.Email);
        SetupValidationFor(request => request.Phone, CustomerConfiguration.PhoneLength);
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

    private void SetupValidationFor(Expression<Func<AppointmentRequest, string>> property, int? length = null)
    {
        var lengthToSet = length.HasValue ? length.Value : CustomerConfiguration.DefaultLength;
        _ = RuleFor(property)
        .NotNull()
        .WithMessage(Labels.ValidationRequired)
        .MaximumLength(lengthToSet)
        .WithMessage(Labels.ValidationLength);
    }
}
