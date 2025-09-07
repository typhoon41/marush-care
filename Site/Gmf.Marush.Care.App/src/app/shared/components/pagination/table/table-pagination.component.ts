import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { TableMetadata } from './table-metadata.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-table-pagination',
    imports: [CommonModule],
    templateUrl: './table-pagination.component.html',
    styleUrl: './table-pagination.component.scss'
})
export class MarushTablePaginationComponent {
    private readonly defaultPageSize = 20;
    private readonly visiblePagesCount = 3;
    readonly pageSize = input<number>(this.defaultPageSize);
    readonly tableMetadata = input.required<TableMetadata>();
    readonly onSort = input<(column: string, direction: 'asc' | 'desc') => void>();
    readonly tableContent = input.required<Record<string, string>[]>();
    readonly currentPage = signal<number>(1);
    readonly collectionSize = computed(() => this.tableContent()?.length || 0);
    readonly pageCount = computed(() => Math.ceil(this.collectionSize() / this.pageSize()));
    readonly allPages = computed(() => {
        const total = this.pageCount();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const start = Math.max(1, Math.min(this.currentPage() - Math.floor(this.visiblePagesCount / 2), total - this.visiblePagesCount + 1));

        return Array.from({ length: this.visiblePagesCount }, (_, index) => start + index);
    });

    readonly isSorted = (column: string, direction: 'asc' | 'desc') =>
        this.tableMetadata().sortedBy === column && this.tableMetadata().sortedDirection === direction;

    readonly sortBy = (column: string) => {
        this.tableMetadata().sortedBy = column;
        this.tableMetadata().sortedDirection =
            this.tableMetadata().sortedDirection === 'asc' ? 'desc' : 'asc';
        this.onSort()?.(column, this.tableMetadata().sortedDirection);
    };

    readonly setCurrentPage = (pageNumber: number) => {
        this.currentPage.set(pageNumber);
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
