using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface ICustomerRepository
{
    Customer? FindCustomerBy(string email, string phone);
    Task<IEnumerable<Customer>> GetAllAsync(string? byFullName, IPaginateRequest request);
    Task<Customer?> GetByIdAsync(Guid id);
    Task<Customer> CreateAsync(Customer customer);
    Task<bool> UpdateAsync(Customer customer);
    Task<bool> DeleteAsync(Guid id);
}
