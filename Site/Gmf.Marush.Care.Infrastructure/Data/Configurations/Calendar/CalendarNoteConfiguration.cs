using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;

[ExcludeFromCodeCoverage]
public class CalendarNoteConfiguration : IEntityTypeConfiguration<CalendarNoteDto>
{
    public void Configure(EntityTypeBuilder<CalendarNoteDto> builder)
    {
        _ = builder.ToTable("CalendarNotes");
        _ = builder.Property(x => x.Id).ValueGeneratedOnAdd();
        _ = builder.Property(x => x.Date).IsRequired();
        _ = builder.Property(x => x.NoteType).IsRequired();
        _ = builder.Property(x => x.Content).HasMaxLength(2000).IsRequired();
        _ = builder.HasIndex(x => new { x.Date, x.NoteType }).IsUnique();
    }
}
