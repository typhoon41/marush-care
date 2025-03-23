using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Events.User;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class UserRepository(MarushCareContext context) : IUserRepository
{
    public async Task Create(User user)
    {
        var newUser = new UserDto { Username = user.Username, Password = user.Password };
        newUser.AddDomainEvent(new UserCreated(user));
        _ = context.Set<UserDto>().Add(newUser);
        _ = await context.SaveChangesAsync();
    }

    public async Task<ExistingUser?> FindUserBy(string username)
    {
        var userFound = await context.Set<UserDto>().SingleOrDefaultAsync(user => user.Username == username);
        return userFound != null ? new ExistingUser(userFound.Id, userFound.Username, userFound.Password) : null;
    }

    public async Task<ExistingUser?> Audit(string username, UserRequestDetails userDetails)
    {
        var existingUser = await FindUserBy(username) ?? throw new InvalidOperationException("Authenticated user was deleted during execution of this request");

        var dbUser = new UserDto { Id = existingUser.Id, Username = existingUser.Username, Password = existingUser.Password };
        dbUser.AddDomainEvent(new UserAuthenticated(existingUser, userDetails));
        return existingUser;
    }
}
