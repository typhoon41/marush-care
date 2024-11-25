using FluentValidation;
using FluentValidation.AspNetCore;
using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Initialization.Filters;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using System.Text.Json.Serialization;

namespace Gmf.Net.Core.Common.Initialization.Injection;

[ExcludeFromCodeCoverage]
public static class MvcExtensions
{
    private static readonly IEnumerable<IFilterMetadata> DefaultFilters = [
        new RollbackTransactionFilter<IUnitOfWork>(unitOfWork => unitOfWork.CancelSaving()),
        new TransactionFilter<IUnitOfWork>(async unitOfWork => await unitOfWork.SaveChangesAsync())
    ];

    public static IMvcBuilder AddMvc(this IServiceCollection services, IEnumerable<IFilterMetadata> filters,
        IEnumerable<JsonConverter> converters, params Assembly[] assemblies)
    {
        var result = services.AddControllers(options =>
        {
            foreach (var filter in filters.Union(DefaultFilters))
            {
                options.Filters.Add(filter);
            }
        })
        .AddJsonOptions(opt =>
        {
            foreach (var converter in converters)
            {
                opt.JsonSerializerOptions.Converters.Add(converter);
            }
        })
        .ConfigureApiBehaviorOptions(options => options.SuppressMapClientErrors = true);
        _ = services.AddFluentValidationAutoValidation()
            .AddFluentValidationClientsideAdapters()
            .AddValidatorsFromAssemblies(assemblies);
        return result;
    }
}
