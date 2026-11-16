import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CalendarCellSummary } from '../../../calendar-cell-summary';
import { CalendarEntry } from '../../../calendar-entry';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class]': 'positionClasses()' },
    selector: 'marush-calendar-entry-cell',
    imports: [],
    templateUrl: '../calendar-booking-cell.html',
    styleUrl: '../../calendar-grid-entries.scss'
})
export class CalendarEntryCell {
    readonly entry = input.required<CalendarEntry>();
    readonly entrySelected = output<CalendarEntry>();

    protected readonly cellClass = 'entry-cell clickable stretch';
    protected readonly summary = computed(() => CalendarCellSummary.ofEntry(this.entry()));
    protected readonly tooltip = computed(() => this.summary().tooltip());

    readonly positionClasses = computed(() => this.summary().positionClasses());

    protected readonly select = () => this.entrySelected.emit(this.entry());
}
