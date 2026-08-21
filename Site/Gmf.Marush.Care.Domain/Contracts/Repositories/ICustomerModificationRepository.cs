using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface ICustomerModificationRepository
{
    Task Store(CustomerDetails customer, Guid userId);
    Task<bool> Delete(Guid id);
}
