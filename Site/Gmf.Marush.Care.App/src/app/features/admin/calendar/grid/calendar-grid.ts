import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { CalendarEntry } from '../calendar-entry';
import { CalendarNote } from '../calendar-note';
import { CalendarNoteType } from '../calendar-note-type';
import { CalendarSelection } from '../calendar-selection';
import { CalendarTimeSlots } from '../calendar-time-slots';
import { DayInfo } from '../day-info';
import { PublicAppointment } from '../public-appointment';
import { CalendarDayColumn } from './day-column/calendar-day-column';
import { CalendarDayHeader } from './day-header/calendar-day-header';
import { SlotDrag } from './slot-drag';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'calendar-grid-container' },
    selector: 'marush-calendar-grid',
    imports: [CalendarDayColumn, CalendarDayHeader],
    templateUrl: './calendar-grid.html',
    styleUrl: './calendar-grid.scss'
})
export class CalendarGrid {
    readonly days = input.required<DayInfo[]>();
    readonly entries = input<CalendarEntry[]>([]);
    readonly publicAppointments = input<PublicAppointment[]>([]);
    readonly notes = input<CalendarNote[]>([]);

    readonly entryClick = output<CalendarEntry>();
    readonly dragComplete = output<CalendarSelection>();
    readonly noteClick = output<{ date: string; type: CalendarNoteType }>();
    readonly nonWorkingDayToggle = output<{ date: string; existing: CalendarNote | undefined }>();

    private readonly gridElement = viewChild.required<ElementRef<HTMLElement>>('gridElement');
    protected readonly timeSlots = CalendarTimeSlots.all;
    protected readonly drag = new SlotDrag();

    protected readonly dailyNoteOn = (isoDate: string): CalendarNote | undefined =>
        this.noteOn(isoDate, 'Daily');

    protected readonly nonWorkingDayOn = (isoDate: string): CalendarNote | undefined =>
        this.noteOn(isoDate, 'NonWorkingDay');

    protected readonly isNonWorkingDay = (isoDate: string): boolean => this.nonWorkingDayOn(isoDate) !== undefined;

    protected readonly entriesOn = (isoDate: string): CalendarEntry[] =>
        this.entries().filter(entry => entry.date === isoDate);

    protected readonly appointmentsOn = (isoDate: string): PublicAppointment[] =>
        this.publicAppointments().filter(appointment => appointment.date === isoDate);

    protected readonly onDailyNoteClick = (isoDate: string) => this.noteClick.emit({ date: isoDate, type: 'Daily' });

    protected readonly onNonWorkingDayToggle = (isoDate: string, existing: CalendarNote | undefined) =>
        this.nonWorkingDayToggle.emit({ date: isoDate, existing });

    protected readonly onSlotPointerDown = (isoDate: string, request: { event: PointerEvent; slot: number }) => {
        if (this.isNonWorkingDay(isoDate)) {
            return;
        }

        request.event.preventDefault();
        this.gridElement().nativeElement.setPointerCapture(request.event.pointerId);
        this.drag.start(isoDate, request.slot);
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

    private readonly noteOn = (isoDate: string, type: CalendarNoteType): CalendarNote | undefined =>
        this.notes().find(note => note.date === isoDate && note.noteType === type);
}
