namespace Gmf.DDD.Common.Contracts;
public interface IPaginateRequest
{
    int PageNumber { get; set; }
    int PageSize { get; set; }
    string SortBy { get; set; }
    bool DescendingSort { get; set; }
}
