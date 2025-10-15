import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { PaginationButtons } from './buttons';
import { PaginatedResponse, TableMetadata } from './table-metadata';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-table-pagination',
    imports: [CommonModule, PaginationButtons],
    templateUrl: './table-pagination.html',
    styleUrl: './table-pagination.scss'
})
export class TablePagination {
    readonly tableMetadata = input.required<TableMetadata>();
    readonly tableContent = input.required<PaginatedResponse>();

    protected readonly isSorted = (column: string, descendingSort: boolean) => {
        const state = this.tableMetadata().state();
        return state.sortBy() === column && state.descendingSort() === descendingSort;
    };

    protected readonly sortBy = (column: string) => {
        if (!this.tableMetadata().columns.find(columnDefinition => columnDefinition.name === column)?.sortable) {
            return;
        }

        const state = this.tableMetadata().state();
        state.sortBy.set(column);
        state.descendingSort.set(!state.descendingSort());
        state.pageNumber.set(1);
    };
}
