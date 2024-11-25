namespace Gmf.Net.Core.Common.Initialization.Documentation;

public record OpenApiSettings
{
    public string Email { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ApiDetails ApiDetails { get; set; } = new ApiDetails();
    public Action OnSwaggerConfigured { get; set; } = () => { };
}
