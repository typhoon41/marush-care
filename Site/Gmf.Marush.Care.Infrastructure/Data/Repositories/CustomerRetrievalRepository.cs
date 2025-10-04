using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CustomerRetrievalRepository(DbContext context) : ICustomerRetrievalRepository
{
    private readonly DbSet<CustomerDto> _customers = context.Set<CustomerDto>();

    public Customer? FindCustomerBy(string email, string phone)
    {
        var entity = _customers
            .Include(c => c.Emails)
            .Include(c => c.Phones)
            .FirstOrDefault(c =>
                c.Emails.Any(e => e.Email == email) &&
                c.Phones.Any(p => p.PhoneNumber == phone));
        return entity is null ? null : MapToDomain(entity);
    }

    public async Task<(IEnumerable<Customer> Results, int TotalCount)> GetAllAsync(string? byFullName, IPaginateRequest request)
    {
        IQueryable<CustomerDto> entities = _customers.Include(c => c.Phones).Include(c => c.Emails)
                .Include(c => c.Properties);

        if (!string.IsNullOrWhiteSpace(byFullName))
        {
            entities = entities.Where(c => c.Name.Contains(byFullName) || c.Surname.Contains(byFullName) || (c.Name + " " + c.Surname).Contains(byFullName));
        }

        var orderedResult = request is { SortBy: "FullName", DescendingSort: true }
            ? entities.OrderByDescending(c => c.Name).ThenByDescending(c => c.Surname)
            : entities.OrderBy(c => c.Name).ThenBy(c => c.Surname);

        var paginatedResult = await orderedResult
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return (paginatedResult.Select(MapToDomain), entities.Count());
    }

    public async Task<CustomerDetails?> GetByIdAsync(Guid id)
    {
        var customerFound = await _customers
            .Include(c => c.Emails)
            .Include(c => c.Phones)
            .Include(c => c.Properties)
            .Include(c => c.Appointments)
            .AsSplitQuery()
            .SingleOrDefaultAsync(c => c.Id == id);
        return customerFound is null ? null : MapTo(customerFound);
    }

    private static CustomerDetails MapTo(CustomerDto dto)
    {
        var properties = dto.Properties;
        return new CustomerDetails(dto.Id, dto.Name, dto.Surname, dto.Phones.Select(phone => phone.PhoneNumber),
            dto.Emails.Select(phone => phone.Email), properties?.DateOfBirth,
            properties?.PlaceOfResidence, properties?.Diagnosis, properties?.Allergies, properties?.Comments, properties?.Notes);
    }

    private static Customer MapToDomain(CustomerDto dto)
    {
        var email = dto.Emails.FirstOrDefault()?.Email ?? string.Empty;
        var phone = dto.Phones.FirstOrDefault()?.PhoneNumber ?? string.Empty;
        return new Customer(dto.Id, dto.Name, dto.Surname, email, phone);
    }
}
