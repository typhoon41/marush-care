import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CalendarCellSummary } from '../../../calendar-cell-summary';
import { CalendarEntry } from '../../../calendar-entry';

const entryClass = 'entry-cell clickable stretch';
const bookedOnlineClass = `${entryClass} booked-online`;
const bookedOnlineLine = 'Onlajn zakazano';

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

    // An entry that started as an online request keeps saying so, on its stripe and in its tooltip.
    protected readonly cellClass = computed(() => this.entry().bookedOnline ? bookedOnlineClass : entryClass);
    protected readonly summary = computed(() => CalendarCellSummary.ofEntry(this.entry()));
    protected readonly tooltip = computed(() => this.entry().bookedOnline
        ? `${bookedOnlineLine}: ${this.summary().tooltip()}`
        : this.summary().tooltip());

    readonly positionClasses = computed(() => this.summary().positionClasses());

    protected readonly select = () => this.entrySelected.emit(this.entry());
}
