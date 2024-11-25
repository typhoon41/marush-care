using Gmf.Net.Core.Common.Initialization.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Gmf.Net.Core.Common.Initialization.Filters;
internal class RollbackTransactionFilter<T>(Action<T> onTransactionRollback) : IActionFilter where T : class
{
    private readonly Action<T> _onTransactionRollback = onTransactionRollback ?? throw new ArgumentNullException(nameof(onTransactionRollback));

    public void OnActionExecuting(ActionExecutingContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        AbortInvalidSaving(context);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        AbortInvalidSaving(context);
    }

    private void AbortInvalidSaving(FilterContext context)
    {
        if (context.ModelState.IsValid)
        {
            return;
        }

        var unitOfWork = context.HttpContext.Resolve<T>();
        _onTransactionRollback(unitOfWork);
    }
}
