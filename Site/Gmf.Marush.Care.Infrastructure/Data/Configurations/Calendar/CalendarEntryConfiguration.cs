using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;

[ExcludeFromCodeCoverage]
public class CalendarEntryConfiguration : IEntityTypeConfiguration<CalendarEntryDto>
{
    public void Configure(EntityTypeBuilder<CalendarEntryDto> builder)
    {
        _ = builder.ToTable("CalendarEntries");
        _ = builder.Property(x => x.Id).ValueGeneratedOnAdd();
        _ = builder.Property(x => x.Date).IsRequired();
        _ = builder.Property(x => x.StartTime).IsRequired();
        _ = builder.Property(x => x.EndTime).IsRequired();
        _ = builder.Property(x => x.ClientName).HasMaxLength(200);
        _ = builder.Property(x => x.ClientPhone).HasMaxLength(20);
        _ = builder.Property(x => x.ClientEmail).HasMaxLength(200);
        _ = builder.Property(x => x.Notes).HasMaxLength(1000);
        _ = builder.Property(x => x.Money).HasPrecision(10, 2);
        _ = builder.HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
        _ = builder.Navigation(x => x.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
