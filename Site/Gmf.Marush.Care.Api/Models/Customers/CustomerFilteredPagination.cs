using Gmf.Net.Core.Common.Requests;

namespace Gmf.Marush.Care.Api.Models.Customers;

public class CustomerFilteredPagination : PaginatedRequest
{
    public string Filter { get; set; } = string.Empty;
}
