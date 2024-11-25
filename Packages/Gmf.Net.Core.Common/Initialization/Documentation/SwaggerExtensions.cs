﻿using MicroElements.Swashbuckle.FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace Gmf.Net.Core.Common.Initialization.Documentation;

public static class SwaggerExtensions
{
    public static void AddSwaggerIn(this IServiceCollection services, IWebHostEnvironment environment, OpenApiSettings settings)
    {
        if (!environment.IsProduction())
        {
            _ = services.AddEndpointsApiExplorer();
            _ = services.AddSwaggerGen(options =>
            {
                var apiDetails = settings.ApiDetails;
                options.SwaggerDoc(apiDetails.Version, new OpenApiInfo
                {
                    Version = apiDetails.Version,
                    Title = settings.Title,
                    Description = settings.Description,
                    Contact = new OpenApiContact
                    {
                        Name = apiDetails.Description,
                        Url = new Uri(settings.Location),
                        Email = settings.Email
                    }
                });

                var xmlFile = $"{Assembly.GetEntryAssembly()?.GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);

                settings.OnSwaggerConfigured();
            });
            _ = services.AddFluentValidationRulesToSwagger();
        }
    }

    public static void UseSwaggerIn(this IApplicationBuilder app, IWebHostEnvironment environment, params ApiDetails[] apiDetails)
    {
        if (!environment.IsProduction())
        {
            _ = app.UseSwagger();
            _ = app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = string.Empty;
                foreach (var apiDetail in apiDetails)
                {
                    c.SwaggerEndpoint($"/swagger/{apiDetail.Version}/swagger.json", apiDetail.Description);
                }
            });
        }
    }
}
