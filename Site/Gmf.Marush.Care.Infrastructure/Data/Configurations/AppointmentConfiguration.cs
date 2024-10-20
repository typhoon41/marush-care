using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations;

[ExcludeFromCodeCoverage]
public class AppointmentConfiguration : IEntityTypeConfiguration<AppointmentDto>
{
    private const string Appointments = "Appointments";

    public void Configure(EntityTypeBuilder<AppointmentDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(Appointments);
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property).IsRequired();
        _ = builder.Property(x => x.Description);
        _ = builder.Property(x => x.ScheduledFor).IsRequired();
        _ = builder.Property(x => x.TreatmentsDuration).IsRequired();
    }
}
