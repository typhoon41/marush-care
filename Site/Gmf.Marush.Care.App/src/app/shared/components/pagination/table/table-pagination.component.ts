/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-table-pagination',
    imports: [CommonModule],
    templateUrl: './table-pagination.component.html',
    styleUrl: './table-pagination.component.css'
})
export class MarushTablePaginationComponent {
    private readonly defaultPageSize = 20;
    private readonly visiblePagesCount = 3;
    readonly pageSize = input<number>(this.defaultPageSize);
    readonly tableContent = input.required<any[]>();
    readonly currentPage = signal<number>(1);
    readonly collectionSize = computed(() => this.tableContent()?.length || 0);
    readonly pageCount = computed(() => Math.ceil(this.collectionSize() / this.pageSize()));
    readonly allPages = computed(() => {
        const total = this.pageCount();
        const start = Math.max(1, Math.min(this.currentPage() - Math.floor(this.visiblePagesCount / 2), total - this.visiblePagesCount + 1));

        return Array.from({ length: this.visiblePagesCount }, (_, index) => start + index);
    });

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
