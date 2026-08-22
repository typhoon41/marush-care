import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CalendarEntry } from '../../../calendar-entry';
import { formatMoney } from '../../../money-formatter';
import { TimeInterval } from '../../../time-interval';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'entry-cell-container', '[class]': 'positionClasses()' },
    selector: 'marush-calendar-entry-cell',
    imports: [],
    templateUrl: './calendar-entry-cell.html',
    styleUrl: '../../calendar-grid-entries.scss'
})
export class CalendarEntryCell {
    readonly entry = input.required<CalendarEntry>();
    readonly entrySelected = output<CalendarEntry>();

    protected readonly timeRange = computed(() => `${this.entry().startTime}-${this.entry().endTime}`);
    protected readonly tooltip = computed(() => [this.entry().clientName, ...this.entry().treatmentTitles].join('\n'));
    protected readonly hasClientName = computed(() => this.entry().clientName.length > 0);
    protected readonly hasMoney = computed(() => this.entry().money !== undefined);
    protected readonly money = computed(() => `${formatMoney(this.entry().money ?? 0)} RSD`);
    protected readonly notes = computed(() => this.entry().notes ?? '');
    protected readonly hasNotes = computed(() => this.notes().length > 0);

    readonly positionClasses = computed(() =>
        `entry-cell-container ${new TimeInterval(this.entry().startTime, this.entry().endTime).positionClasses()}`);
}
