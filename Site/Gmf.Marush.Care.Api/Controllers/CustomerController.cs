using System.Security.Claims;
using Gmf.Marush.Care.Api.Models.Customers;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Requests;
using Gmf.Net.Core.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize]
public class CustomerController(ICustomerModificationRepository customerModificationRepository,
    IUserService userService,
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
        return Ok(new PaginatedResponse<CustomerListItemDto>(data.PageSize)
        {
            Items = items,
            TotalCount = customers.TotalCount
        });
    }

    [HttpPost]
    [ServiceFilter(typeof(ValidateCaptchaAttribute))]
    [ProducesResponseType(typeof(CustomerDetails), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create(NewCustomerDto dto)
    {
        await Store(MapToDomain(dto));
        return Created();
    }


    [HttpPut]
    [ServiceFilter(typeof(ValidateCaptchaAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(CustomerDto dto)
    {
        await Store(MapToDomain(dto, dto.Id));
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

    private async Task Store(CustomerDetails customerDetails)
    {
        var usedId = userService.GetUserIdFrom(Identity());
        await customerModificationRepository.StoreAsync(customerDetails, usedId);
    }

    private static CustomerDetails MapToDomain(NewCustomerDto dto, Guid? id = null) => new(id, dto.Name, dto.Surname, dto.Phones, dto.Emails,
         dto.Birthday, dto.City, dto.Diagnosis, dto.Allergies, dto.Comments, dto.Remarks, 
         dto.Appointments.Select(appointment => new CustomerAppointment(appointment.Date, appointment.Description)));

    private ClaimsIdentity Identity() =>
        HttpContext.User.Identity as ClaimsIdentity ?? throw new InvalidOperationException("Identity is missing");
}
