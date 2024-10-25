using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

[ExcludeFromCodeCoverage]
public class EmailsConfiguration : IEntityTypeConfiguration<CustomerEmailDto>
{
    private const string CustomerEmails = "CustomerEmails";
    public const int DefaultLength = 100;

    public void Configure(EntityTypeBuilder<CustomerEmailDto> builder)
    {
        _ = builder.ToTable(CustomerEmails);
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.HasKey(ec => new { ec.CustomerId, ec.Email });
        _ = builder.Property(x => x.Email).HasMaxLength(DefaultLength).IsRequired();
    }
}
