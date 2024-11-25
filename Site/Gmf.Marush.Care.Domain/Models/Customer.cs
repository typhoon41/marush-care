using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;
public class Customer : Entity<Guid>
{
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
        Email = email;
        Phone = phone;
    }

    public string Name { get; } = string.Empty;
    public string Surname { get; } = string.Empty;
    public string Email { get; } = string.Empty;
    public string Phone { get; } = string.Empty;
}
