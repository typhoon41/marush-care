import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CalendarCellSummary } from '../../../calendar-cell-summary';
import { PublicAppointment } from '../../../public-appointment';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class]': 'positionClasses()' },
    selector: 'marush-calendar-appointment-cell',
    imports: [],
    templateUrl: '../calendar-booking-cell.html',
    styleUrl: '../../calendar-grid-entries.scss'
})
export class CalendarAppointmentCell {
    readonly appointment = input.required<PublicAppointment>();
    readonly appointmentSelected = output<PublicAppointment>();

    protected readonly cellClass = computed(() => 'public-appointment-cell clickable stretch');
    protected readonly summary = computed(() => CalendarCellSummary.ofRequest(this.appointment()));
    protected readonly tooltip = computed(() => `Onlajn zahtev: ${this.summary().tooltip()}`);

    readonly positionClasses = computed(() => this.summary().positionClasses());

    protected readonly select = () => this.appointmentSelected.emit(this.appointment());
}
