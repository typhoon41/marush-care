using FluentValidation;
using Gmf.Marush.Care.Api.Models.Customers;

namespace Gmf.Marush.Care.Api.Validation;

public class CustomerDtoValidator : AbstractValidator<CustomerDto>
{
    public CustomerDtoValidator()
    {
        this.SetupCustomerRules();
    }
}
