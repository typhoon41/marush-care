using System.Text;
using Gmf.Marush.Care.Infrastructure.Injection.Modules;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Gmf.Marush.Care.Api.Initialization;

internal static class AuthenticationExtensions
{
    private const string Bearer = "Bearer";

    internal static void AddAuthentication(this WebApplicationBuilder builder)
    {
        var jwtSettings = ConfigurationModule.GetJwtSettings(builder.Configuration);
        _ = builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
        });
    }

    internal static void SetupSwaggerSecurity(this SwaggerGenOptions options)
    {
        options.AddSecurityDefinition(Bearer, new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = Bearer,
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter 'Bearer <token>' (without quotes)."
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = Bearer
                    }
                },
                new List<string>()
            }
        });
    }
}
