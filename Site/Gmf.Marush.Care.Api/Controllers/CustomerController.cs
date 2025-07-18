using Gmf.Marush.Care.Api.Models.Customers;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class CustomerController(ICustomerRepository repository) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDetails), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await repository.GetByIdAsync(id);
        return customer is null ? NotFound() : Ok(customer);
    }

    [HttpPost("get-all")]
    [ProducesResponseType(typeof(PaginatedResponse<CustomerListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse<CustomerListItemDto>>> GetAll(CustomerFilteredPagination data)
    {
        var customers = await repository.GetAllAsync(data.Filter, data);
        var items = customers.Results.Select(customer => new CustomerListItemDto { Id = customer.Id, ContactNumber = customer.Phone, FullName = customer.FullName });
        return Ok(new PaginatedResponse<CustomerListItemDto>
        {
            Items = items,
            PageSize = data.PageSize,
            PageNumber = data.PageNumber,
            TotalCount = customers.TotalCount
        });
    }

    // Get, Create, Update, Delete

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
