import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PublicAppointment } from '../../../public-appointment';
import { TimeInterval } from '../../../time-interval';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class]': 'positionClasses()' },
    selector: 'marush-calendar-appointment-cell',
    imports: [],
    templateUrl: './calendar-appointment-cell.html',
    styleUrl: '../../calendar-grid-entries.scss'
})
export class CalendarAppointmentCell {
    readonly appointment = input.required<PublicAppointment>();

    private readonly interval = computed(() => TimeInterval.of(this.appointment()));

    protected readonly timeRange = computed(() => this.interval().range());

    readonly positionClasses = computed(() => `public-appointment-cell ${this.interval().positionClasses()}`);
}
