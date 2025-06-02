using Gmf.Marush.Care.Api.Models.Customers;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Net.Core.Common.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class CustomerController(ICustomerRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<PaginatedResponse<CustomerListItemDto>> GetAll(CustomerFilteredPagination data)
    {
        var customers = await repository.GetAllAsync();
        return Ok(customers.Select(MapToDto));
    }
    // Filter-Sort-Paginate, Get, Create, Update, Delete

    //[HttpGet("{id:guid}")]
    //public async Task<IActionResult> GetById(Guid id)
    //{
    //    var customer = await repository.GetByIdAsync(id);
    //    return customer is null ? NotFound() : Ok(MapToDto(customer));
    //}

    //[HttpPost]
    //public async Task<IActionResult> Create([FromBody] CustomerDto dto)
    //{
    //    var customer = MapToDomain(dto);
    //    var created = await repository.CreateAsync(customer);
    //    return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
    //}

    //[HttpPut("{id:guid}")]
    //public async Task<IActionResult> Update(Guid id, [FromBody] CustomerDto dto)
    //{
    //    if (id != dto.Id)
    //    {
    //        return BadRequest();
    //    }

    //    var customer = MapToDomain(dto);
    //    var updated = await repository.UpdateAsync(customer);
    //    return updated ? NoContent() : NotFound();
    //}

    //[HttpDelete("{id:guid}")]
    //public async Task<IActionResult> Delete(Guid id)
    //{
    //    var deleted = await repository.DeleteAsync(id);
    //    return deleted ? NoContent() : NotFound();
    //}

    //private static CustomerDto MapToDto(Customer c) => new()
    //{
    //    Id = c.Id,
    //    Name = c.Name,
    //    Surname = c.Surname,
    //    Email = c.Email,
    //    Phone = c.Phone,
    //    Properties = c.Properties is null ? null : new CustomerPropertiesDto
    //    {
    //        Notes = c.Properties.Notes,
    //        DateOfBirth = c.Properties.DateOfBirth
    //    }
    //};

    //private static Customer MapToDomain(CustomerDto dto) =>
    //    new(dto.Id, dto.Name, dto.Surname, dto.Email, dto.Phone,
    //        dto.Properties is null ? null : new CustomerProperties
    //        {
    //            Notes = dto.Properties.Notes,
    //            DateOfBirth = dto.Properties.DateOfBirth
    //        });
}
