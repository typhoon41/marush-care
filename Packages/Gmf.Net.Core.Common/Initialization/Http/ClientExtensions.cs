﻿using System.Net.Http.Json;
using System.Text.Json;

namespace Gmf.Net.Core.Common.Initialization.Http;
public static class ClientExtensions
{
    private static JsonSerializerOptions JsonSettings => new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static async Task<TOutput> PostBodylessResponseAsync<TOutput>(this HttpClient httpClient, string action)
    {
        var result = await httpClient.PostAsync(new Uri(action), null);
        _ = result.EnsureSuccessStatusCode();
        return await ResponseAsync<TOutput>(result);
    }

    public static async Task<TOutput> PostWithResponseAsync<TInput, TOutput>(this HttpClient httpClient, string action, TInput data)
    {
        httpClient.DefaultRequestHeaders.Referrer = new Uri("https://marushcare.com");
        var result = await httpClient.PostAsJsonAsync(new Uri(action), data);
        _ = result.EnsureSuccessStatusCode();
        return await ResponseAsync<TOutput>(result);
    }

    private static async Task<T> ResponseAsync<T>(HttpResponseMessage result)
    {
        var content = await result.Content.ReadAsStringAsync();
        var rawResult = JsonSerializer.Deserialize<T>(content, JsonSettings);

        return rawResult != null ? rawResult : throw new InvalidOperationException("Unexpected parsing result!");
    }
}
