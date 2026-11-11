using Gmf.DDD.Common.Contracts;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Gmf.Net.Core.Common.Initialization.Filters;

public class TransactionFilter(Func<IUnitOfWork> unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        var resultContext = await next();

        // The result has not run yet, so the response still reports 200: the status the action chose
        // is on the result itself.
        var statusCode = (resultContext.Result as IStatusCodeActionResult)?.StatusCode
            ?? context.HttpContext.Response.StatusCode;
        var okStatusCode = statusCode is >= 200 and < 300;

        if (resultContext.Exception == null && okStatusCode && context.ModelState.IsValid)
        {
            _ = await unitOfWork().SaveChangesAsync();
        }
    }
}
