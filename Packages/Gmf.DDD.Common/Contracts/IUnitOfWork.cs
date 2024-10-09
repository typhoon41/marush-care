namespace Gmf.DDD.Common.Contracts;
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    void CancelSaving();
}
