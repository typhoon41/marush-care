using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;
public interface ICustomerRepository
{
    Customer? FindCustomerBy(string email, string phone);
}
