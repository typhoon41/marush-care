using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CustomerModificationRepository(DbContext context) : ICustomerModificationRepository
{
    private readonly DbSet<CustomerDto> _customers = context.Set<CustomerDto>();

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _customers.FindAsync(id);
        if (entity is null)
        {
            return false;
        }

        _ = _customers.Remove(entity);
        return true;
    }

    public async Task StoreAsync(CustomerDetails customer, Guid userId)
    {
        if (customer.Id is null)
        {
            await Create(customer, userId);
        }

        else
        {
            Update(customer, customer.Id.Value, userId);
        }
    }

    private async Task Create(CustomerDetails customer, Guid userId)
    {
        var entity = EntityFrom(customer, userId);
        SetContactDetailsFor(customer, entity);

        _ = await _customers.AddAsync(entity);
    }

    private void Update(CustomerDetails customer, Guid id, Guid userId)
    {
        var entity = EntityFrom(customer, userId);
        entity.Id = id;

        _ = _customers.Attach(entity);

        entity.Phones.Clear();
        entity.Emails.Clear();

        SetContactDetailsFor(customer, entity);
    }

    private static void SetContactDetailsFor(CustomerDetails customer, CustomerDto entity)
    {
        foreach (var phone in customer.Phones)
        {
            entity.Phones.Add(new CustomerPhoneDto { PhoneNumber = phone });
        }

        foreach (var email in customer.Emails)
        {
            entity.Emails.Add(new CustomerEmailDto { Email = email });
        }
    }

    private static CustomerDto EntityFrom(CustomerDetails customer, Guid userId) => new()
    {
        Name = customer.Name,
        Surname = customer.Surname,
        Properties = new CustomerPropertiesDto
        {
            DateOfBirth = customer.DateOfBirth,
            PlaceOfResidence = customer.PlaceOfResidence ?? throw ValidationError(nameof(customer.PlaceOfResidence)),
            Diagnosis = customer.Diagnosis ?? throw ValidationError(nameof(customer.Diagnosis)),
            Allergies = customer.Allergies ?? throw ValidationError(nameof(customer.Allergies)),
            Comments = customer.Comments ?? throw ValidationError(nameof(customer.Comments)),
            Notes = customer.Notes ?? throw ValidationError(nameof(customer.Notes)),
            LastEditAt = DateTime.UtcNow,
            LastEditedById = userId
        }
    };

    private static InvalidOperationException ValidationError(string propertyName) => new($"Validation of upper layer failed for {propertyName}");
}
