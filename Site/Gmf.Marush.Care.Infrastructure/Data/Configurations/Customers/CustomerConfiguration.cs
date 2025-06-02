using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

[ExcludeFromCodeCoverage]
public class CustomerConfiguration : IEntityTypeConfiguration<CustomerDto>
{
    private const string Customers = "Customers";
    public const int DefaultLength = 100;

    public void Configure(EntityTypeBuilder<CustomerDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(Customers);
        _ = builder.Navigation(e => e.Appointments)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(e => e.Phones)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(e => e.Emails)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(e => e.Properties)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Property(x => x.Name).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.Property(x => x.Surname).HasMaxLength(DefaultLength).IsRequired();
    }
}
