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
        Expression<Func<T, string>> property, int? length = null)
    {
        var lengthToSet = length ?? CustomerConfiguration.DefaultLength;
        return validator.RuleFor(property)
        .NotNull()
        .WithMessage(Labels.ValidationRequired)
        .MaximumLength(lengthToSet)
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
        _ = validator.RuleFor(request => request.DateOfBirth)
            .NotNull()
            .WithMessage(Labels.ValidationRequired)
            .Must((request, date) => new Period(DateTime.UtcNow.AddYears(-100), DateTime.UtcNow).Contains(date.ToDateTime(new TimeOnly(0))))
            .WithMessage(Labels.ValidationInterval);
        _ = validator.SetupValidationFor(request => request.PlaceOfResidence);
        _ = validator.SetupValidationFor(request => request.Diagnosis, CustomerPropertiesConfiguration.IssuesLength);
        _ = validator.SetupValidationFor(request => request.Allergies, CustomerPropertiesConfiguration.IssuesLength);
        _ = validator.SetupValidationFor(request => request.Comments, CustomerPropertiesConfiguration.AttachmentsLength);
        _ = validator.SetupValidationFor(request => request.Notes, CustomerPropertiesConfiguration.AttachmentsLength);
    }
}
