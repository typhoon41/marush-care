using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface ICustomerRetrievalRepository
{
    Customer? FindCustomerBy(string email, string phone);
    Task<(IEnumerable<Customer> Results, int TotalCount)> GetAllAsync(string? byFullName, IPaginateRequest request);
    Task<CustomerDetails?> GetByIdAsync(Guid id);
}
