using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>Clients of a fresh development database; their order is the index a <see cref="DevelopmentVisit"/> refers to.</summary>
public static class DevelopmentCustomers
{
    public static IReadOnlyList<CustomerDto> EditedBy(UserDto editor, DateTime editedAt) =>
    [
        Create(editor, editedAt, "Jelena", "Petrović", "+381641234501", "jelena.petrovic@example.com",
            new CustomerPropertiesDto { DateOfBirth = new DateOnly(1990, 4, 12), PlaceOfResidence = "Beograd", Allergies = "Lateks" }),
        Create(editor, editedAt, "Milica", "Jovanović", "+381641234502", "milica.jovanovic@example.com",
            new CustomerPropertiesDto { PlaceOfResidence = "Novi Sad", Diagnosis = "Rozacea", Comments = "Blagi tretmani, bez jakih pilinga." }),
        Create(editor, editedAt, "Ana", "Nikolić", "+381641234503", "ana.nikolic@example.com",
            new CustomerPropertiesDto { DateOfBirth = new DateOnly(1986, 11, 3), PlaceOfResidence = "Beograd" }),
        Create(editor, editedAt, "Marija", "Ilić", "+381641234504", "marija.ilic@example.com",
            new CustomerPropertiesDto { PlaceOfResidence = "Pančevo", Comments = "Preferira jutarnje termine." }),
        Create(editor, editedAt, "Ivana", "Stojanović", "+381641234505", "ivana.stojanovic@example.com",
            new CustomerPropertiesDto { PlaceOfResidence = "Zemun", Notes = "Osetljiva koža." }),
        Create(editor, editedAt, "Tamara", "Đorđević", "+381641234506", "tamara.djordjevic@example.com",
            new CustomerPropertiesDto { DateOfBirth = new DateOnly(1995, 7, 21) }),
        Create(editor, editedAt, "Sara", "Marković", "+381641234507", "sara.markovic@example.com",
            new CustomerPropertiesDto { PlaceOfResidence = "Beograd", Allergies = "Parfemi" }),
        Create(editor, editedAt, "Nevena", "Pavlović", "+381641234508", "nevena.pavlovic@example.com",
            new CustomerPropertiesDto { PlaceOfResidence = "Novi Beograd" })
    ];

    private static CustomerDto Create(UserDto editor, DateTime editedAt, string name, string surname, string phone,
        string email, CustomerPropertiesDto properties)
    {
        var customer = new CustomerDto { Id = Guid.NewGuid(), Name = name, Surname = surname, Properties = properties };
        properties.CustomerId = customer.Id;
        properties.Customer = customer;
        properties.LastEditedBy = editor;
        properties.LastEditAt = editedAt;
        customer.Phones.Add(new CustomerPhoneDto { CustomerId = customer.Id, Customer = customer, PhoneNumber = phone });
        customer.Emails.Add(new CustomerEmailDto { CustomerId = customer.Id, Customer = customer, Email = email });

        return customer;
    }
}
