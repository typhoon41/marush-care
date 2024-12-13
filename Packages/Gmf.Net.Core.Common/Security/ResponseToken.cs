namespace Gmf.Net.Core.Common.Security;
public record ResponseToken
{
    public bool Valid { get; set; }
    public string InvalidReason { get; set; } = string.Empty;
}
