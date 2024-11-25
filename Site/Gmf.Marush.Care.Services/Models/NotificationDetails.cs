using Gmf.Mail.Common.Models;

namespace Gmf.Marush.Care.Services.Models;
public record NotificationDetails
{
    public required BaseEmailTemplate PrimaryTemplate { get; set; }
    public required string PrimaryTitle { get; set; }
    public required BaseEmailTemplate SecondaryTemplate { get; set; }
    public string SecondaryTitle { get; set; } = string.Empty;
}
