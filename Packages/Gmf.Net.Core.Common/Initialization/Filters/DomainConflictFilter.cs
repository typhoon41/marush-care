using Gmf.DDD.Common.Concepts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Gmf.Net.Core.Common.Initialization.Filters;

/// <summary>
/// Answers 409 when the domain refuses a request that conflicts with its current state. Handling it
/// here keeps an expected refusal from being logged and reported as an unhandled server error.
/// </summary>
public class DomainConflictFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        if (context.Exception is not DomainConflictException)
        {
            return;
        }

        context.Result = new ConflictResult();
        context.ExceptionHandled = true;
    }
}
