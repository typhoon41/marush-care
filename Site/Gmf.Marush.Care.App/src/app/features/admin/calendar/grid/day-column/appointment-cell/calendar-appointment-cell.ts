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

    protected readonly timeRange = computed(() => `${this.appointment().startTime}-${this.appointment().endTime}`);

    readonly positionClasses = computed(() =>
        `public-appointment-cell ${new TimeInterval(this.appointment().startTime, this.appointment().endTime).positionClasses()}`);
}
