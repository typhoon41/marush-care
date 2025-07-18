using Gmf.Marush.Care.Api.Models.Customers;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize]
public class CustomerController(ICustomerModificationRepository customerModificationRepository,
    ICustomerRetrievalRepository customerRetievalRepository) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDetails), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await customerRetievalRepository.GetByIdAsync(id);
        return customer is null ? NotFound() : Ok(customer);
    }

    [HttpPost("get-all")]
    [ProducesResponseType(typeof(PaginatedResponse<CustomerListItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<PaginatedResponse<CustomerListItemDto>>> GetAll(CustomerFilteredPagination data)
    {
        var customers = await customerRetievalRepository.GetAllAsync(data.Filter, data);
        var items = customers.Results.Select(customer => new CustomerListItemDto { Id = customer.Id, ContactNumber = customer.Phone, FullName = customer.FullName });
        return Ok(new PaginatedResponse<CustomerListItemDto>
        {
            Items = items,
            PageSize = data.PageSize,
            PageNumber = data.PageNumber,
            TotalCount = customers.TotalCount
        });
    }

    [HttpPost]
    [ProducesResponseType(typeof(CustomerDetails), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create(NewCustomerDto dto)
    {
        var customer = MapToDomain(dto);
        await customerModificationRepository.StoreAsync(customer);
        return Created();
    }


    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(CustomerDto dto)
    {
        var customer = MapToDomain(dto);
        await customerModificationRepository.StoreAsync(customer);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await customerModificationRepository.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private static CustomerDetails MapToDomain(NewCustomerDto dto) => new(null, dto.Name, dto.Surname, dto.Phones, dto.Emails,
         dto.DateOfBirth, dto.PlaceOfResidence, dto.Diagnosis, dto.Allergies, dto.Comments, dto.Notes);
}
