import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { ScreenSize } from '../../../../shared/services/screen-size';
import { CalendarEntry } from '../calendar-entry';
import { CalendarNote } from '../calendar-note';
import { CalendarNoteType } from '../calendar-note-type';
import { CalendarSelection } from '../calendar-selection';
import { timeSlots } from '../calendar-time-slots';
import { DayInfo } from '../day-info';
import { formatMoney } from '../money-formatter';
import { PublicAppointment } from '../public-appointment';
import { TimeInterval } from '../time-interval';
import { SlotDrag } from './slot-drag';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'calendar-grid-container' },
    selector: 'marush-calendar-grid',
    imports: [],
    templateUrl: './calendar-grid.html',
    styleUrls: [
        './calendar-grid.scss', './calendar-grid-slots.scss', './calendar-grid-header.scss',
        './calendar-grid-day-actions.scss', './calendar-grid-entries.scss'
    ]
})
export class CalendarGrid {
    protected readonly screenSize = inject(ScreenSize);
    readonly days = input.required<DayInfo[]>();
    readonly entries = input<CalendarEntry[]>([]);
    readonly publicAppointments = input<PublicAppointment[]>([]);
    readonly notes = input<CalendarNote[]>([]);

    readonly entryClick = output<CalendarEntry>();
    readonly dragComplete = output<CalendarSelection>();
    readonly noteClick = output<{ date: string; type: CalendarNoteType }>();
    readonly nonWorkingDayToggle = output<{ date: string; existing: CalendarNote | undefined }>();

    private readonly gridElement = viewChild.required<ElementRef<HTMLElement>>('gridElement');
    protected readonly timeSlots = timeSlots;
    protected readonly formatMoney = formatMoney;
    protected readonly drag = new SlotDrag();

    protected readonly getDailyNote = (isoDate: string): CalendarNote | undefined =>
        this.notes().find(note => note.date === isoDate && note.noteType === 'Daily');

    protected readonly getNonWorkingDay = (isoDate: string): CalendarNote | undefined =>
        this.notes().find(note => note.date === isoDate && note.noteType === 'NonWorkingDay');

    protected readonly entriesForDay = (isoDate: string): CalendarEntry[] =>
        this.entries().filter(entry => entry.date === isoDate);

    protected readonly appointmentsForDay = (isoDate: string): PublicAppointment[] =>
        this.publicAppointments().filter(appointment => appointment.date === isoDate);

    protected readonly entryInterval = (startTime: string, endTime: string): TimeInterval =>
        new TimeInterval(startTime, endTime);

    protected readonly onPointerDown = (event: PointerEvent, date: string, slot: number) => {
        if (this.getNonWorkingDay(date)) {
            return;
        }

        event.preventDefault();
        this.gridElement().nativeElement.setPointerCapture(event.pointerId);
        this.drag.start(date, slot);
    };

    protected readonly onPointerMove = (event: PointerEvent) => {
        if (!this.drag.isActive()) {
            return;
        }

        const element = document.elementFromPoint(event.clientX, event.clientY);
        const slotIndex = element?.getAttribute('data-slot');
        if (slotIndex !== null && slotIndex !== undefined) {
            this.drag.moveTo(parseInt(slotIndex, 10));
        }
    };

    protected readonly onPointerUp = () => {
        const selection = this.drag.complete();
        if (selection) {
            this.dragComplete.emit(selection);
        }
    };
}
