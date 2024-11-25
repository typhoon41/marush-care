namespace Gmf.Mail.Common.Models;
public record SmtpSettings
{
    public string Server { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool UsePickupDirectory { get; set; }
    public string PickupDirectoryLocation { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string FromDescription { get; set; } = string.Empty;
}
