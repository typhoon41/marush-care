using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Customers;

[ExcludeFromCodeCoverage]
public class CustomerPropertiesConfiguration : IEntityTypeConfiguration<CustomerPropertiesDto>
{
    private const string CustomerProperties = "CustomerProperties";
    public const int DefaultLength = 100;
    public const int IssuesLength = 1024;
    public const int AttachmentsLength = 4096;

    public void Configure(EntityTypeBuilder<CustomerPropertiesDto> builder)
    {
        _ = builder.HasKey(x => x.CustomerId);
        _ = builder.ToTable(CustomerProperties);
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Property(x => x.DateOfBirth).IsRequired(false);
        _ = builder.Property(x => x.PlaceOfResidence).HasMaxLength(DefaultLength);
        _ = builder.Property(x => x.Diagnosis).HasMaxLength(IssuesLength);
        _ = builder.Property(x => x.Allergies).HasMaxLength(IssuesLength);
        _ = builder.Property(x => x.Comments).HasMaxLength(AttachmentsLength);
        _ = builder.Property(x => x.Notes).HasMaxLength(AttachmentsLength);
        _ = builder.Property(x => x.LastEditedById);
        _ = builder.Property(x => x.LastEditAt);
        _ = builder.Navigation(e => e.LastEditedBy)
               .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
