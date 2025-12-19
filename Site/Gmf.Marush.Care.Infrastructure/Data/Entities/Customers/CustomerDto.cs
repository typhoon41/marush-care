using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
public record CustomerDto : EntityDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public CustomerPropertiesDto? Properties { get; set; }
    public IList<AppointmentDto> Appointments { get; } = [];
    public IList<CustomerPhoneDto> Phones { get; } = [];
    public IList<CustomerEmailDto> Emails { get; } = [];

    public static CustomerDto MapFrom(CustomerDto target, CustomerDetails customer, Guid userId)
    {
        target.Name = customer.Name;
        target.Surname = customer.Surname;
        target.Properties ??= new CustomerPropertiesDto();

        target.Properties.DateOfBirth = customer.DateOfBirth;
        target.Properties.PlaceOfResidence = customer.PlaceOfResidence ?? throw ValidationError(nameof(customer.PlaceOfResidence));
        target.Properties.Diagnosis = customer.Diagnosis ?? throw ValidationError(nameof(customer.Diagnosis));
        target.Properties.Allergies = customer.Allergies ?? throw ValidationError(nameof(customer.Allergies));
        target.Properties.Comments = customer.Comments ?? throw ValidationError(nameof(customer.Comments));
        target.Properties.Notes = customer.Notes ?? throw ValidationError(nameof(customer.Notes));
        target.Properties.LastEditAt = DateTime.UtcNow;
        target.Properties.LastEditedById = userId;

        return target;
    }

    public Customer MapToCustomer()
    {
        var email = Emails.FirstOrDefault()?.Email ?? string.Empty;
        var phone = Phones.FirstOrDefault()?.PhoneNumber ?? string.Empty;
        return new Customer(Id, Name, Surname, email, phone);
    }

    public CustomerDetails MapToDetails()
    {
        var properties = Properties;
        var appointments = Appointments
            .            Select(appointmentDto => new CustomerAppointment(DateOnly.FromDateTime(appointmentDto.ScheduledFor.DateTime), appointmentDto.Description)).ToList();
        return new CustomerDetails(Id, Name, Surname, Phones.Select(phone => phone.PhoneNumber),
            Emails.Select(email => email.Email), properties?.DateOfBirth,
            properties?.PlaceOfResidence, properties?.Diagnosis, properties?.Allergies, properties?.Comments, properties?.Notes, appointments);
    }

    private static InvalidOperationException ValidationError(string propertyName) => new($"Validation of upper layer failed for {propertyName}");
}
