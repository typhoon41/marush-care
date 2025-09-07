import { signal } from '@angular/core';

export class PaginatedRequest {
    static readonly defaultPageSize = 1;
    readonly filter = signal<string>('');
    readonly pageNumber = signal<number>(1);
    readonly pageSize = signal<number>(PaginatedRequest.defaultPageSize);
    readonly sortBy = signal<string | undefined>(undefined);
    readonly descendingSort = signal<boolean>(false);
}
