namespace Gmf.DDD.Common.Contracts;
public interface IStoreEvents
{
    void Add(IDomainEvent domainEvent);
    Task Publish();
}
