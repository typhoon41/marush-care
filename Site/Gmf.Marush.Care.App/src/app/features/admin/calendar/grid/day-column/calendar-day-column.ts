import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CalendarEntry } from '../../calendar-entry';
import { CalendarTimeSlots } from '../../calendar-time-slots';
import { PublicAppointment } from '../../public-appointment';
import { CalendarAppointmentCell } from './appointment-cell/calendar-appointment-cell';
import { CalendarEntryCell } from './entry-cell/calendar-entry-cell';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'day-column', '[class.non-working]': 'nonWorking()' },
    selector: 'marush-calendar-day-column',
    imports: [CalendarAppointmentCell, CalendarEntryCell],
    templateUrl: './calendar-day-column.html',
    styleUrls: ['../calendar-grid-slots.scss', '../calendar-grid-entry-placement.scss']
})
export class CalendarDayColumn {
    readonly isoDate = input.required<string>();
    readonly entries = input<CalendarEntry[]>([]);
    readonly appointments = input<PublicAppointment[]>([]);
    readonly nonWorking = input(false);
    readonly isDragging = input(false);
    readonly selectedSlots = input<readonly number[]>([]);
    readonly anchorSlot = input(CalendarTimeSlots.unset);

    readonly slotPointerDown = output<{ event: PointerEvent; slot: number }>();
    readonly entryClick = output<CalendarEntry>();

    protected readonly timeSlots = CalendarTimeSlots.all;

    protected readonly isSelected = (slot: number): boolean => this.selectedSlots().includes(slot);
    protected readonly isAnchor = (slot: number): boolean => this.anchorSlot() === slot;
}
