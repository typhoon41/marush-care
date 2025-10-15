import { signal } from '@angular/core';

export class PaginatedRequest {
    static readonly defaultPageSize = 20;
    readonly filter = signal<string>('');
    readonly pageNumber = signal<number>(1);
    readonly pageSize = signal<number>(PaginatedRequest.defaultPageSize);
    readonly sortBy = signal<string | undefined>(undefined);
    readonly descendingSort = signal<boolean>(false);

    constructor(private readonly initialSort: string) {
        this.sortBy.set(this.initialSort);
    }

    readonly toJson = () => ({
        filter: this.capitalize(this.filter()),
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        sortBy: this.capitalize(this.sortBy()),
        descendingSort: this.descendingSort()
    });

    private readonly capitalize = (word: string | null | undefined) => {
        if (!word) {
            return '';
        }

        return word.charAt(0).toUpperCase() + word.slice(1);
    };
}
