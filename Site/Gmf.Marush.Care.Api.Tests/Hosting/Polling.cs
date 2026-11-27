namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Waits for work the API finishes in the background (events and emails sent after the commit).</summary>
public static class Polling
{
    private static readonly TimeSpan Timeout = TimeSpan.FromSeconds(10);
    private static readonly TimeSpan Interval = TimeSpan.FromMilliseconds(25);

    public static async Task<T> Until<T>(Func<T?> probe, string description) where T : class
    {
        ArgumentNullException.ThrowIfNull(probe);
        var deadline = DateTimeOffset.UtcNow + Timeout;
        while (DateTimeOffset.UtcNow < deadline)
        {
            if (probe() is { } found)
            {
                return found;
            }

            await Task.Delay(Interval, TestContext.Current.CancellationToken);
        }

        throw new TimeoutException($"Gave up after {Timeout.TotalSeconds} s waiting for {description}.");
    }
}
