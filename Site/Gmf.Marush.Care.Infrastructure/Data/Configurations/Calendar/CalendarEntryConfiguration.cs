using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;

[ExcludeFromCodeCoverage]
public class CalendarEntryConfiguration : IEntityTypeConfiguration<CalendarEntryDto>
{
    public const int WorkingDaysInWeek = 6;

    public void Configure(EntityTypeBuilder<CalendarEntryDto> builder)
    {
        _ = builder.ToTable("CalendarEntries");
        _ = builder.Property(x => x.Id).ValueGeneratedOnAdd();
        _ = builder.Property(x => x.Notes).HasMaxLength(1000);
        _ = builder.Property(x => x.Money).HasPrecision(10, 2);
        _ = builder.HasOne<AppointmentDto>(x => x.Appointment)
            .WithOne()
            .HasForeignKey<CalendarEntryDto>(x => x.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
        _ = builder.Navigation(x => x.Appointment)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(x => x.Treatments)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
