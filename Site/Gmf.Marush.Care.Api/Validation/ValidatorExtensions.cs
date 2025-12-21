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
        _ = validator.RuleForEach(request => request.Emails)
            .EmailAddress()
            .WithMessage(Labels.ValidationEmail);
        _ = validator.RuleForEach(request => request.Phones)
            .Matches(Customer.PhoneRegex)
            .WithMessage(Labels.ValidationPhone);
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
