import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MarushPaginationButtonsComponent } from './buttons.component';
import { PaginatedResponse, TableMetadata } from './table-metadata.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-table-pagination',
    imports: [CommonModule, MarushPaginationButtonsComponent],
    templateUrl: './table-pagination.component.html',
    styleUrl: './table-pagination.component.scss'
})
export class MarushTablePaginationComponent {
    readonly tableMetadata = input.required<TableMetadata>();
    readonly tableContent = input.required<PaginatedResponse>();

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
}
