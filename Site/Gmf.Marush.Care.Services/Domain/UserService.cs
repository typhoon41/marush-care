using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Domain.Events.User;
using Gmf.Marush.Care.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Gmf.Marush.Care.Services.Domain;
public class UserService(IStoreEvents integrationEvents, IUserRepository userRepository, JwtSettings jwtSettings, ILogger<UserService> logger) : IUserService
{
    private readonly PasswordHasher<ExistingUser> _passwordHasher = new();

    public async Task<bool> CreateAsync(User user)
    {
        try
        {
            var hashedPassword = _passwordHasher.HashPassword(null!, user.Password);
            var newUser = user.CloneWith(hashedPassword);
            await userRepository.Create(newUser);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> ValidateAsync(User given)
    {
        var existingUser = await userRepository.FindUserBy(given.Username);
        var validCredentials = existingUser != null &&
            _passwordHasher.VerifyHashedPassword(existingUser, existingUser.Password, given.Password) == PasswordVerificationResult.Success;

        if (validCredentials)
        {
            await userRepository.AuditAuthenticationOf(existingUser!, given.RequestDetails);
            return true;
        }

        integrationEvents.Add(new UserAuthenticationFailure(given));
        return false;
    }

    public string GenerateJwtToken(string username)
    {
        var claims = new List<Claim> { new(ClaimTypes.Name, username) };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(jwtSettings.TokenExpiryTime),
            signingCredentials: credentials
        );

        var result = new JwtSecurityTokenHandler().WriteToken(token);
        logger.LogInformation("Issuing token for user {Username}...", username);

        return result;
    }
}
