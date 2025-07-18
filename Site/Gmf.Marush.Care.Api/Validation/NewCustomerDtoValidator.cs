using FluentValidation;
using Gmf.Marush.Care.Api.Models.Customers;

namespace Gmf.Marush.Care.Api.Validation;

public class NewCustomerDtoValidator : AbstractValidator<NewCustomerDto>
{
    public NewCustomerDtoValidator()
    {
        this.SetupCustomerRules();
    }
}
