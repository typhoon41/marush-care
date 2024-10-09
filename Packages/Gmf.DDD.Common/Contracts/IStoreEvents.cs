namespace Gmf.DDD.Common.Contracts;
public interface IStoreEvents<in TDomainEvent>
{
    void Add(TDomainEvent domainEvent);
    Task Publish();
}
