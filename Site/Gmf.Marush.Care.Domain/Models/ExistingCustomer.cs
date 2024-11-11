namespace Gmf.Marush.Care.Domain.Models;
public class ExistingCustomer(Customer customer, string givenMail, string givenPhone) :
    Customer(customer.Id, customer.Name, customer.Surname, customer.Email, customer.Phone)
{
    public string GivenMail { get; } = givenMail;
    public string GivenPhone { get; } = givenPhone;
}
