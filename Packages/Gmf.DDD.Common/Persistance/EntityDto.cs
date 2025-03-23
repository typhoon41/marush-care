using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Gmf.DDD.Common.Contracts;

namespace Gmf.DDD.Common.Persistance;
public abstract record EntityDto
{
    [NotMapped]
    public IList<IDomainEvent> DomainEvents { get; } = [];
    public Guid Id { get; set; }

    [ExcludeFromCodeCoverage]
    public void AddDomainEvent(IDomainEvent @event) => DomainEvents.Add(@event);

    public void ClearDomainEvents() => DomainEvents.Clear();
}
