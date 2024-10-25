using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Appointments;

[ExcludeFromCodeCoverage]
public class AppointmentConfiguration : IEntityTypeConfiguration<AppointmentDto>
{
    private const string Appointments = "Appointments";

    public void Configure(EntityTypeBuilder<AppointmentDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(Appointments);
        _ = builder.HasOne(o => o.CustomerEmail)
            .WithMany(c => c.Appointments)
            .HasForeignKey(s => new { s.CustomerId, s.Email })
            .OnDelete(DeleteBehavior.NoAction);
        _ = builder.HasOne(o => o.CustomerPhone)
            .WithMany(c => c.Appointments)
            .HasForeignKey(s => new { s.CustomerId, s.Phone })
            .OnDelete(DeleteBehavior.NoAction);
        _ = builder.Property(x => x.Description);
        _ = builder.Property(x => x.ScheduledFor).IsRequired();
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(e => e.Status)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
