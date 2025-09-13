import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { PaginatedRequest } from '../request.model';
import { PaginatedResponse, TableMetadata } from './table-metadata.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-table-pagination',
    imports: [CommonModule],
    templateUrl: './table-pagination.component.html',
    styleUrl: './table-pagination.component.scss'
})
export class MarushTablePaginationComponent {
    private readonly visiblePagesCount = 3;
    readonly pageSize = input<number>(PaginatedRequest.defaultPageSize);
    readonly tableMetadata = input.required<TableMetadata>();
    readonly tableContent = input.required<PaginatedResponse>();
    // eslint-disable-next-line @stylistic/newline-per-chained-call
    readonly currentPage = computed(() => this.tableMetadata().state().pageNumber());
    readonly cantGoBack = computed(() => this.currentPage() <= 1);
    readonly cantGoForward = computed(() => this.currentPage() >= this.pageCount());
    readonly collectionSize = computed(() => this.tableContent()?.totalCount || 0);
    readonly pageCount = computed(() => Math.ceil(this.collectionSize() / this.pageSize()));
    readonly allPages = computed(() => {
        const total = this.pageCount();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const start = Math.max(1, Math.min(this.currentPage() - Math.floor(this.visiblePagesCount / 2), total - this.visiblePagesCount + 1));

        return Array.from({ length: total < this.visiblePagesCount ? total : this.visiblePagesCount }, (_, index) => start + index);
    });

    readonly isSorted = (column: string, descendingSort: boolean) => {
        const state = this.tableMetadata().state();
        return state.sortBy() === column && state.descendingSort() === descendingSort;
    };

    readonly sortBy = (column: string) => {
        if (!this.tableMetadata().columns.find(columnDefinition => columnDefinition.name === column)?.sortable) {
            return;
        }

        const state = this.tableMetadata().state();
        state.sortBy.set(column);
        state.descendingSort.set(!state.descendingSort());
        state.pageNumber.set(1);
    };

    readonly setCurrentPage = (pageNumber: number) => {
        this.tableMetadata().state().pageNumber.set(pageNumber);
    };

    readonly nextPage = () => {
        const newPage = this.currentPage() + 1;

        if (newPage <= this.pageCount()) {
            this.setCurrentPage(newPage);
        }
    };

    readonly previousPage = () => {
        const newPage = this.currentPage() - 1;
        if (newPage >= 1) {
            this.setCurrentPage(newPage);
        }
    };
}
