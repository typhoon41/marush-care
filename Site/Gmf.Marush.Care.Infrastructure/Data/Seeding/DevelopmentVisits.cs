namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>The visits a fresh development database starts with, grouped by the state they are seeded in.</summary>
public static class DevelopmentVisits
{
    private const string ClassicHygiene = "Klasičan higijenski tretman";
    private const string PremiumHygiene = "Premium higijenski tretman";
    private const string Mesotherapy = "Neinvazivna mezoterapija";
    private const string PrxPeel = "PRX T33 piling";
    private const string LashLift = "Lash lift";
    private const string BrowLift = "Brow lift";
    private const string BrowTint = "Farbanje obrva";
    private const string CelluliteMassage = "Anticelulit masaža nogu i gluteusa";

    public static IReadOnlyCollection<DevelopmentVisit> Performed { get; } =
    [
        new(0, -21, new TimeOnly(11, 0), 60, [ClassicHygiene], 3500, "Prvi dolazak."),
        new(1, -20, new TimeOnly(13, 0), 60, [Mesotherapy], 4500),
        new(2, -18, new TimeOnly(17, 30), 90, [PremiumHygiene], 5000),
        new(0, -14, new TimeOnly(12, 0), 60, [PrxPeel], 6000),
        new(4, -13, new TimeOnly(15, 0), 60, [LashLift, BrowTint], 5500),
        new(6, -11, new TimeOnly(18, 0), 60, [CelluliteMassage], 3000),
        new(3, -7, new TimeOnly(11, 30), 60, [ClassicHygiene], 3500),
        new(5, -6, new TimeOnly(16, 0), 45, [BrowLift], 3500),
        new(1, -4, new TimeOnly(14, 0), 60, [Mesotherapy], 4500, "Koža smirenija nego prošli put.")
    ];

    public static IReadOnlyCollection<DevelopmentVisit> Approved { get; } =
    [
        new(2, 0, new TimeOnly(11, 0), 60, [PrxPeel], 6000),
        new(7, 0, new TimeOnly(14, 30), 90, [PremiumHygiene], 5000),
        new(0, 1, new TimeOnly(12, 0), 60, [ClassicHygiene], 3500),
        new(4, 2, new TimeOnly(17, 0), 60, [LashLift], 4000),
        new(6, 3, new TimeOnly(15, 0), 45, [BrowLift, BrowTint], 5000),
        new(3, 4, new TimeOnly(11, 30), 60, [Mesotherapy], 4500),
        new(5, 5, new TimeOnly(13, 0), 60, [CelluliteMassage], 3000),
        new(1, 8, new TimeOnly(16, 0), 60, [Mesotherapy], 4500),
        new(2, 10, new TimeOnly(12, 30), 90, [PremiumHygiene], 5000)
    ];

    public static IReadOnlyCollection<DevelopmentVisit> Requested { get; } =
    [
        new(5, 2, new TimeOnly(12, 0), 60, [ClassicHygiene], 3500),
        new(7, 4, new TimeOnly(18, 0), 60, [LashLift], 4000),
        new(0, 9, new TimeOnly(14, 0), 60, [PrxPeel], 6000)
    ];

    public static IReadOnlyCollection<DevelopmentVisit> Rejected { get; } =
    [
        new(6, 1, new TimeOnly(19, 0), 60, [Mesotherapy], 4500)
    ];
}
