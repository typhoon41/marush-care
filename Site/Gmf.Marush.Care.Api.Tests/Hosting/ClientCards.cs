using System.Net;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Client records created through api/customer; the API answers 201 without an id, so the id is read back by email.</summary>
public sealed class ClientCards(MarushApiFactory factory)
{
    public async Task<Guid> Create(MarushApiClient staff, CustomerCardBody card)
    {
        ArgumentNullException.ThrowIfNull(staff);
        ArgumentNullException.ThrowIfNull(card);
        using var response = await staff.Post("api/customer", card);
        _ = response.EnsureSuccessStatusCode();
        return await IdFor(card.Email);
    }

    public async Task<Guid> IdFor(string email) =>
        await factory.QueryDatabase(async context => await context.Set<CustomerEmailDto>()
            .Where(row => row.Email == email)
            .Select(row => row.CustomerId)
            .SingleAsync(TestContext.Current.CancellationToken));

    public async Task<IReadOnlyList<Guid>> AllIdsFor(string email) =>
        await factory.QueryDatabase(async context => await context.Set<CustomerEmailDto>()
            .Where(row => row.Email == email)
            .Select(row => row.CustomerId)
            .ToListAsync(TestContext.Current.CancellationToken));

    public async Task<CustomerDto?> Stored(Guid id) =>
        await factory.QueryDatabase(async context => await context.Set<CustomerDto>()
            .AsNoTracking()
            .Include(customer => customer.Phones)
            .Include(customer => customer.Emails)
            .SingleOrDefaultAsync(customer => customer.Id == id, TestContext.Current.CancellationToken));
}
