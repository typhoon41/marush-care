using Gmf.DDD.Common.Persistance;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities;

public record UserDto : EntityDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
