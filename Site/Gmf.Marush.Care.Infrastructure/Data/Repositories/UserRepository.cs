using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Events.User;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class UserRepository(DbContext context) : IUserRepository
{
    public async Task Create(User user)
    {
        var newUser = new UserDto { Username = user.Username, Password = user.Password };
        newUser.AddDomainEvent(new UserCreated(user));
        _ = await context.Set<UserDto>().AddAsync(newUser);
    }

    public async Task<ExistingUser?> FindUserBy(string username)
    {
        var userFound = await context.Set<UserDto>().SingleOrDefaultAsync(user => user.Username == username);
        return userFound != null ? new ExistingUser(userFound.Id, userFound.Username, userFound.Password) : null;
    }

    public async Task AuditAuthenticationOf(ExistingUser user, UserRequestDetails userDetails)
    {
        var dbUser = await context.Set<UserDto>().FindAsync(user.Id) ?? throw new InvalidOperationException("User was deleted while trying to authenticate");
        dbUser.AddDomainEvent(new UserAuthenticated(user, userDetails));
    }
}
