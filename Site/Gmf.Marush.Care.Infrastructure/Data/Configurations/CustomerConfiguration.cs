using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations;

[ExcludeFromCodeCoverage]
public class CustomerConfiguration : IEntityTypeConfiguration<CustomerDto>
{
    private const string Customers = "Customers";
    public const int DefaultLength = 100;
    public const int PhoneLength = 16;

    public void Configure(EntityTypeBuilder<CustomerDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(Customers);
        _ = builder.Navigation(e => e.Appointments)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Property(x => x.Email).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.Property(x => x.Name).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.Property(x => x.Surname).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.Property(x => x.Phone).HasMaxLength(PhoneLength);
    }
}
