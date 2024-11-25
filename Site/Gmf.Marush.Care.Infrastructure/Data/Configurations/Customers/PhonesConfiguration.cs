using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

[ExcludeFromCodeCoverage]
public class PhonesConfiguration : IEntityTypeConfiguration<CustomerPhoneDto>
{
    private const string CustomerPhones = "CustomerPhones";
    public const int PhoneLength = 16;

    public void Configure(EntityTypeBuilder<CustomerPhoneDto> builder)
    {
        _ = builder.ToTable(CustomerPhones);
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.HasKey(ec => new { ec.CustomerId, ec.PhoneNumber });
        _ = builder.Property(x => x.PhoneNumber).HasMaxLength(PhoneLength).IsRequired();
    }
}
