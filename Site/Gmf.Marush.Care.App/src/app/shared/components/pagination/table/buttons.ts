import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PaginatedRequest } from '../paginated-request';
import { PaginatedResponse, TableMetadata } from './table-metadata';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-pagination-buttons',
    imports: [CommonModule],
    templateUrl: './buttons.html',
    styleUrl: './buttons.scss'
})
export class PaginationButtons {
    private readonly visiblePagesCount = 3;
    readonly pageSize = input<number>(PaginatedRequest.defaultPageSize);
    readonly tableMetadata = input.required<TableMetadata>();
    readonly tableContent = input.required<PaginatedResponse>();
    // eslint-disable-next-line @stylistic/newline-per-chained-call
    protected readonly currentPage = computed(() => this.tableMetadata().state().pageNumber());
    protected readonly cantGoBack = computed(() => this.currentPage() <= 1);
    protected readonly cantGoForward = computed(() => this.currentPage() >= this.pageCount());
    protected readonly collectionSize = computed(() => this.tableContent()?.totalCount || 0);
    protected readonly pageCount = computed(() => Math.ceil(this.collectionSize() / this.pageSize()));
    protected readonly allPages = computed(() => {
        const total = this.pageCount();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const start = Math.max(1, Math.min(this.currentPage() - Math.floor(this.visiblePagesCount / 2),
            total - this.visiblePagesCount + 1));

        return Array.from({ length: total < this.visiblePagesCount ? total : this.visiblePagesCount },
            (_, index) => start + index);
    });

    protected readonly nextPage = () => {
        const newPage = this.currentPage() + 1;

        if (newPage <= this.pageCount()) {
            this.setCurrentPage(newPage);
        }
    };

    protected readonly previousPage = () => {
        const newPage = this.currentPage() - 1;
        if (newPage >= 1) {
            this.setCurrentPage(newPage);
        }
    };

    protected readonly setCurrentPage = (pageNumber: number) => {
        this.tableMetadata().state().pageNumber.set(pageNumber);
    };
}
