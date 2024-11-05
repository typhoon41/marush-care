using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.DDD.Common.Persistance;
public abstract record EntityDto<TDomainEvent>
{
    [NotMapped]
    public IList<TDomainEvent> DomainEvents { get; } = [];
    public Guid Id { get; set; }

    [ExcludeFromCodeCoverage]
    protected void AddDomainEvent(TDomainEvent @event) => DomainEvents.Add(@event);

    public void ClearDomainEvents() => DomainEvents.Clear();
}
