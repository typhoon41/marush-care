namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>The client card the admin posts to api/customer (create, Id null) and puts there (save, Id set).</summary>
public sealed record CustomerCardBody
{
    public Guid? Id { get; init; }

    public string Name { get; init; } = "Jana";

    public string Surname { get; init; } = "Ilić";

    public IReadOnlyList<string> Emails { get; init; } = [$"card-{Guid.NewGuid():N}@marush.test"];

    public IReadOnlyList<string> Phones { get; init; } = ["0651234567"];

    public IReadOnlyList<CustomerCardVisit> Appointments { get; init; } = [];

    public string? City { get; init; } = "Beograd";

    public string? Diagnosis { get; init; } = "Rosacea";

    public string? Allergies { get; init; } = "Latex";

    public string? Comments { get; init; } = string.Empty;

    public string? Remarks { get; init; } = string.Empty;

    public string Email => Emails[0];
}
