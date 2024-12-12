namespace Gmf.Net.Core.Common.Security;
internal record Request
{
    public RequestBody Event { get; set; } = new();
}
