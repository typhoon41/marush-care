using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Talks to the API the way the Angular app does: JSON, an Accept-Language header and, for staff, a bearer token.</summary>
public sealed class MarushApiClient : IDisposable
{
    private readonly HttpClient _client;

    public MarushApiClient(HttpClient client, string language)
    {
        _client = client ?? throw new ArgumentNullException(nameof(client));
        _client.DefaultRequestHeaders.Accept.ParseAdd("application/json, text/plain, */*");
        _client.DefaultRequestHeaders.AcceptLanguage.ParseAdd(language);
    }

    public void UseToken(string token) => _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    public async Task<HttpResponseMessage> Get(string route) =>
        await _client.GetAsync(Relative(route), TestContext.Current.CancellationToken);

    public async Task<HttpResponseMessage> Post<TBody>(string route, TBody body) =>
        await _client.PostAsJsonAsync(Relative(route), body, TestContext.Current.CancellationToken);

    public async Task<HttpResponseMessage> Put<TBody>(string route, TBody body) =>
        await _client.PutAsJsonAsync(Relative(route), body, TestContext.Current.CancellationToken);

    public async Task<HttpResponseMessage> Delete(string route) =>
        await _client.DeleteAsync(Relative(route), TestContext.Current.CancellationToken);

    public void Dispose() => _client.Dispose();

    private static Uri Relative(string route) => new(route, UriKind.RelativeOrAbsolute);
}
