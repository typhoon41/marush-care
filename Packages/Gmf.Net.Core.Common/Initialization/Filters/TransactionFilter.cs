using Gmf.Net.Core.Common.Initialization.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Gmf.Net.Core.Common.Initialization.Filters;

internal class TransactionFilter<T>(Func<T, Task> onTransactionCommit) : IAsyncActionFilter where T : class
{
    private readonly Func<T, Task> _onTransactionCommit = onTransactionCommit ?? throw new ArgumentNullException(nameof(onTransactionCommit));

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        var resultContext = await next();

        var unitOfWork = context.HttpContext.Resolve<T>();
        var statusCode = context.HttpContext.Response.StatusCode;
        var okStatusCode = statusCode is >= 200 and < 300;

        if (resultContext.Exception == null && okStatusCode && context.ModelState.IsValid)
        {
            await _onTransactionCommit(unitOfWork);
        }
    }
}
