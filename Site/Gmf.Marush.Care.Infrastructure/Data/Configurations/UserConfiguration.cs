using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gmf.Marush.Care.Infrastructure.Data.Configurations;

[ExcludeFromCodeCoverage]
public class UserConfiguration : IEntityTypeConfiguration<UserDto>
{
    private const string Users = "Users";
    public const int DefaultLength = 64;

    public void Configure(EntityTypeBuilder<UserDto> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder.ToTable(Users);
        _ = builder.Property(x => x.Username).HasMaxLength(DefaultLength).IsRequired();
        _ = builder.HasIndex(u => u.Username).IsUnique();
        _ = builder.Property(x => x.Password).HasMaxLength(512).IsRequired();
    }
}
