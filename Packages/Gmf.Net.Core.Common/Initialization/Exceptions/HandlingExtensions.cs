using FluentValidation;
using Gmf.Net.Core.Common.Initialization.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Initialization.Exceptions;
internal static class HandlingExtensions
{
    internal static void UseExceptionsHandler(this IApplicationBuilder builder) => builder.UseExceptionHandler(new ExceptionHandlerOptions
    {
        AllowStatusCode404Response = true,
        ExceptionHandler = HandleExceptionFrom
    });

    private static async Task HandleExceptionFrom(HttpContext context)
    {
        var logger = context.Resolve<ILogger<Exception>>();
        var exception = context.Features.Get<IExceptionHandlerPathFeature>()!.Error;
        switch (exception)
        {
            case ValidationException validationException:
                logger.LogDebug(exception, "Validation exception");
                await HandleValidationExceptionFrom(context, validationException);
                return;
            default:
                logger.LogError(exception, "Unexpected error");
                await HandleUnexpectedErrorFrom(context, exception);
                break;
        }
    }

    private static async Task HandleValidationExceptionFrom(HttpContext context,
        ValidationException validationException)
    {
        var validationResult = context.InvalidResponseFrom(validationException);
        var jsonResult = new JsonResult(validationResult)
        {
            ContentType = "application/problem+json",
            StatusCode = StatusCodes.Status400BadRequest
        };
        await ExecuteResult(context, jsonResult);
    }

    [SuppressMessage("ReSharper", "ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract")]
    private static async Task HandleUnexpectedErrorFrom(HttpContext context, Exception exception)
    {
        var accept = context.Request.GetTypedHeaders().Accept;
        if (accept != null && accept.All(header => header.MediaType != "application/json"))
        {
            // server does not accept Json, leaving to default MVC error page handler.
            return;
        }

        var problemDetails = GetProblemDetails(context, exception);
        var jsonResult = new JsonResult(problemDetails)
        {
            ContentType = "application/problem+json",
            StatusCode = 500
        };
        await ExecuteResult(context, jsonResult);
    }

    private static async Task ExecuteResult(HttpContext context, IActionResult actionResult)
    {
        var routeData = context.GetRouteData();
        var actionDescriptor = new ActionDescriptor();
        var actionContext = new ActionContext(context, routeData, actionDescriptor);
        await actionResult.ExecuteResultAsync(actionContext);
    }

    private static ProblemDetails GetProblemDetails(HttpContext context, Exception exception)
    {
        var problemDetails = new ProblemDetails
        {
            Title = "An unexpected error occurred!",
            Instance = context.Request.Path,
            Status = StatusCodes.Status500InternalServerError,
            Detail = string.Empty
        };

        return problemDetails;
    }
}
