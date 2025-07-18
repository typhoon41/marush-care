using System.Diagnostics.CodeAnalysis;
using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;
public class Customer : Entity<Guid>
{
    public const string PhoneRegex = @"^(06\d{7,8})|(\+\d{10,13})$";

    [SuppressMessage("Globalization", "CA1308:Normalize strings to uppercase",
        Justification = "In email case, it doesn't matter but uppercase email is barely readable.")]
    public Customer(Guid id, string name, string surname, string email, string phone) : base(id)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is invalid", nameof(name));
        }
        if (string.IsNullOrWhiteSpace(surname))
        {
            throw new ArgumentException("Surname is invalid", nameof(surname));
        }
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email is invalid", nameof(email));
        }
        if (string.IsNullOrWhiteSpace(phone))
        {
            throw new ArgumentException("Phone is invalid", nameof(phone));
        }

        Name = name;
        Surname = surname;
        Email = email.ToLowerInvariant();
        Phone = phone;
    }

    public string Name { get; } = string.Empty;
    public string Surname { get; } = string.Empty;
    public string FullName => $"{Name} {Surname}".Trim();
    public string Email { get; } = string.Empty;
    public string Phone { get; } = string.Empty;
}
