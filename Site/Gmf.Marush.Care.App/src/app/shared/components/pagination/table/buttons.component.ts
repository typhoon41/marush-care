import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PaginatedRequest } from '../request.model';
import { PaginatedResponse, TableMetadata } from './table-metadata.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-pagination-buttons',
    imports: [CommonModule],
    templateUrl: './buttons.component.html',
    styleUrl: './buttons.component.scss'
})
export class MarushPaginationButtonsComponent {
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

    readonly setCurrentPage = (pageNumber: number) => {
        this.tableMetadata().state().pageNumber.set(pageNumber);
    };
}
