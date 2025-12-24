using System.Linq.Expressions;
using FluentValidation;
using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Api.Models.Customers;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

namespace Gmf.Marush.Care.Api.Validation;

public static class ValidatorExtensions
{
    public static IRuleBuilderOptions<T, string> SetupValidationFor<T>(this AbstractValidator<T> validator,
        Expression<Func<T, string>> property, bool required = true, int? length = null)
    {
        var lengthToSet = length ?? CustomerConfiguration.DefaultLength;
        var rule = validator.RuleFor(property);

        if (required)
        {
            rule.NotNull()
            .WithMessage(Labels.ValidationRequired);
        }

        return rule.MaximumLength(lengthToSet)
                .WithMessage(Labels.ValidationLength);
    }

    public static void SetupCustomerRules<T>(this AbstractValidator<T> validator) where T : NewCustomerDto
    {
        _ = validator.SetupValidationFor(request => request.Name);
        _ = validator.SetupValidationFor(request => request.Surname);

        _ = validator.RuleFor(request => request.Emails)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must(emails => emails.Any())
            .WithMessage(Labels.ValidationRequired);

        _ = validator.RuleForEach(request => request.Emails)
            .NotEmpty()
            .WithMessage(Labels.ValidationRequired)
            .EmailAddress()
            .WithMessage(Labels.ValidationEmail);

        _ = validator.RuleFor(request => request.Phones)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must(phones => phones.Any())
            .WithMessage(Labels.ValidationRequired);

        _ = validator.RuleForEach(request => request.Phones)
            .NotEmpty()
            .WithMessage(Labels.ValidationRequired)
            .Matches(Customer.PhoneRegex)
            .WithMessage(Labels.ValidationPhone);

        _ = validator.RuleForEach(request => request.Appointments)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .ChildRules(appointment => appointment.RuleFor(a => a.Description)
                    .NotEmpty()
                    .WithMessage(Labels.ValidationRequired));

        _ = validator.RuleFor(request => request.Birthday)
            .Must((request, date) => new Period(DateTime.UtcNow.AddYears(-100), DateTime.UtcNow).Contains(date?.ToDateTime(new TimeOnly(0)) ?? DateTime.UtcNow.AddYears(-50)))
            .WithMessage(Labels.ValidationInterval);

        _ = validator.SetupValidationFor(request => request.City!, false);
        _ = validator.SetupValidationFor(request => request.Diagnosis!, false, CustomerPropertiesConfiguration.IssuesLength);
        _ = validator.SetupValidationFor(request => request.Allergies!, false, CustomerPropertiesConfiguration.IssuesLength);
        _ = validator.SetupValidationFor(request => request.Comments!, false, CustomerPropertiesConfiguration.AttachmentsLength);
        _ = validator.SetupValidationFor(request => request.Remarks!, false, CustomerPropertiesConfiguration.AttachmentsLength);
    }
}
