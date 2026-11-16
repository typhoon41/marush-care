using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Appointments;

[ExcludeFromCodeCoverage]
public class AppointmentTreatmentConfiguration : IEntityTypeConfiguration<AppointmentTreatmentDto>
{
    private const string AppointmentTreatments = "AppointmentTreatments";
    public const int NameLength = 200;

    public void Configure(EntityTypeBuilder<AppointmentTreatmentDto> builder)
    {
        _ = builder.ToTable(AppointmentTreatments);
        _ = builder.HasOne(treatment => treatment.Appointment)
            .WithMany(appointment => appointment.Treatments)
            .HasForeignKey(treatment => treatment.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);
        _ = builder.Navigation(treatment => treatment.Appointment)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.HasKey(treatment => new { treatment.AppointmentId, treatment.Name });
        _ = builder.Property(treatment => treatment.Name).HasMaxLength(NameLength).IsRequired();
    }
}
