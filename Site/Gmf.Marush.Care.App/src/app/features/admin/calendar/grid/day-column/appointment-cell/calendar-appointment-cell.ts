import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
    readonly appointmentSelected = output<PublicAppointment>();

    private readonly interval = computed(() => TimeInterval.of(this.appointment()));

    protected readonly timeRange = computed(() => this.interval().range());
    protected readonly tooltip = computed(() => `Onlajn zahtev: ${this.appointment().clientName}`);

    readonly positionClasses = computed(() => `grid-entry-placeholder ${this.interval().positionClasses()}`);
}
