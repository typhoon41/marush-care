using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface ICustomerModificationRepository
{
    Task StoreAsync(CustomerDetails customer);
    Task<bool> DeleteAsync(Guid id);
}
