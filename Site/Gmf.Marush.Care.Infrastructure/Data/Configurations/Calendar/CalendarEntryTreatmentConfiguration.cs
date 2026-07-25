using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;

[ExcludeFromCodeCoverage]
public class CalendarEntryTreatmentConfiguration : IEntityTypeConfiguration<CalendarEntryTreatmentDto>
{
    private const string CalendarEntryTreatments = "CalendarEntryTreatments";
    public const int NameLength = 200;

    public void Configure(EntityTypeBuilder<CalendarEntryTreatmentDto> builder)
    {
        _ = builder.ToTable(CalendarEntryTreatments);
        _ = builder.Navigation(e => e.CalendarEntry)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.HasKey(et => new { et.CalendarEntryId, et.Name });
        _ = builder.Property(x => x.Name).HasMaxLength(NameLength).IsRequired();
    }
}
