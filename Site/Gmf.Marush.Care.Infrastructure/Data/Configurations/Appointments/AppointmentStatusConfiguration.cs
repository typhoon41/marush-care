using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Appointments;

[ExcludeFromCodeCoverage]
public class AppointmentStatusConfiguration : IEntityTypeConfiguration<AppointmentStatusDto>
{
    private const string AppointmentStatusTable = "AppointmentStatus";
    private const int DefaultLength = 100;

    public void Configure(EntityTypeBuilder<AppointmentStatusDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(AppointmentStatusTable);
        _ = builder.Property(x => x.Name).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.Navigation(e => e.Appointments)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.HasData(new List<AppointmentStatus>() { AppointmentStatus.Requested, AppointmentStatus.Rejected, AppointmentStatus.Approved }
            .Select(s => new AppointmentStatusDto { Id = s.Value, Name = s.DisplayName }));
    }
}
