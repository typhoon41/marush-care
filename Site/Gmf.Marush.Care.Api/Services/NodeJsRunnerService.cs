
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Marush.Care.Api.Services;

[SuppressMessage("Maintainability", "CA1515:Consider making public types internal",
    Justification = "Has to be public due to reachability through DI")]
public class NodeJsRunnerService : BackgroundService
{
    private Process? _nodeProcess;

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        StartNodeJsServer();
        return Task.CompletedTask;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        StopNodeJsServer();
        return base.StopAsync(cancellationToken);
    }

    public override void Dispose()
    {
        _nodeProcess?.Dispose();
        GC.SuppressFinalize(this);
        base.Dispose();
    }

    private void StartNodeJsServer()
    {
        var processStartInfo = new ProcessStartInfo
        {
            FileName = "node",
            Arguments = "dist/server/server.mjs",
            WorkingDirectory = AppContext.BaseDirectory,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        _nodeProcess = new Process { StartInfo = processStartInfo };

        _nodeProcess.OutputDataReceived += (sender, args) => Console.WriteLine($"Node Output: {args.Data}");
        _nodeProcess.ErrorDataReceived += (sender, args) => Console.Error.WriteLine($"Node Error: {args.Data}");

        _ = _nodeProcess.Start();
        _nodeProcess.BeginOutputReadLine();
        _nodeProcess.BeginErrorReadLine();
    }

    private void StopNodeJsServer()
    {
        if (_nodeProcess != null && !_nodeProcess.HasExited)
        {
            try
            {
                _nodeProcess.Kill();
                _ = _nodeProcess.WaitForExit(5000);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to stop Node.js process: {ex.Message}");
            }
        }
    }
}
