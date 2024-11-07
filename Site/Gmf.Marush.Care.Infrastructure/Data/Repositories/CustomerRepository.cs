using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;
public class CustomerRepository(MarushCareContext context) : ICustomerRepository
{
    private readonly DbSet<CustomerDto> _customers = context.Set<CustomerDto>();

    public Customer? FindCustomerBy(string email, string phone)
    {
        var customerFound = _customers.Include(s => s.Phones).Include(s => s.Emails)
            .SingleOrDefault(customerFound => customerFound.Phones.Select(x => x.PhoneNumber).Contains(phone) &&
                                              customerFound.Emails.Select(x => x.Email).Contains(email));

        return customerFound == null ? null : new Customer(customerFound.Id, customerFound.Name, customerFound.Surname, email, phone);
    }
}
