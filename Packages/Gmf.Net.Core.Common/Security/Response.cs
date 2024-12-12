using System.Text.Json.Serialization;

namespace Gmf.Net.Core.Common.Security;

public class Response
{
    public bool Success { get; set; } // Has to be public property due to (de)serialization.

    [JsonPropertyName("challenge_ts")]
    public string Challenge { get; set; } = string.Empty;

    public double Score { get; set; }
    public string Action { get; set; } = string.Empty;

    [JsonPropertyName("error-codes")]
    public IEnumerable<string> ErrorCodes { get; set; } = [];
}
