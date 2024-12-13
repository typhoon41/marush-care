namespace Gmf.Net.Core.Common.Security;
public record ResponseAnalysis
{
    public double Score { get; set; }
    public IEnumerable<string> Reasons { get; set; } = [];
}
