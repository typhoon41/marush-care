using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations.Appointments;

[ExcludeFromCodeCoverage]
public class AppointmentConfiguration : IEntityTypeConfiguration<AppointmentDto>
{
    private const string Appointments = "Appointments";
    private const int MoneyPrecision = 10;
    private const int MoneyScale = 2;

    // The largest amount the Money column holds: decimal(10,2).
    public const decimal MaximumMoney = 99_999_999.99m;

    public void Configure(EntityTypeBuilder<AppointmentDto> builder)
    {
        _ = builder.Property(x => x.Id).ValueGeneratedOnAdd();
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
        _ = builder.Property(x => x.Money).HasPrecision(MoneyPrecision, MoneyScale);
        _ = builder.Navigation(x => x.Treatments)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Property(x => x.Language).HasMaxLength(2);
        _ = builder.Property(x => x.ScheduledFor).IsRequired();
        _ = builder.Navigation(e => e.Customer)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
        _ = builder.Navigation(e => e.Status)
            .UsePropertyAccessMode(PropertyAccessMode.Property);
    }
}
