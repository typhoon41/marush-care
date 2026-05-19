import { ChangeDetectionStrategy, Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CalendarEntry } from '../calendar-entry';
import { CalendarNote } from '../calendar-note';
import { CalendarNoteType } from '../calendar-note-type';
import { slotIndexToTime, timeSlots, timeToSlotIndex } from '../calendar-time-slots';
import { formatMoney } from '../money-formatter';
import { DayInfo } from '../day-info';
import { PublicAppointment } from '../public-appointment';

const unsetSlot = -1;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'calendar-grid-container' },
    selector: 'marush-calendar-grid',
    imports: [],
    templateUrl: './calendar-grid.html',
    styleUrl: './calendar-grid.scss'
})
export class CalendarGrid {
    readonly days = input.required<DayInfo[]>();
    readonly entries = input<CalendarEntry[]>([]);
    readonly publicAppointments = input<PublicAppointment[]>([]);
    readonly notes = input<CalendarNote[]>([]);

    readonly entryClick = output<CalendarEntry>();
    readonly dragComplete = output<{ date: string; startTime: string; endTime: string }>();
    readonly noteClick = output<{ date: string; type: CalendarNoteType }>();

    private readonly gridEl = viewChild.required<ElementRef<HTMLElement>>('gridEl');

    protected readonly timeSlots = timeSlots;
    protected readonly formatMoney = formatMoney;

    private readonly dragAnchorDate = signal<string | null>(null);
    private readonly dragAnchorSlot = signal(unsetSlot);
    private readonly dragCurrentSlot = signal(unsetSlot);

    protected readonly isDragging = computed(() => this.dragAnchorDate() !== null);

    protected readonly dragRange = computed(() => {
        const date = this.dragAnchorDate();
        const anchor = this.dragAnchorSlot();
        const current = this.dragCurrentSlot();
        if (!date || anchor < 0 || current < 0) {
            return null;
        }
        return { date, minSlot: Math.min(anchor, current), maxSlot: Math.max(anchor, current) };
    });

    protected readonly isSlotDragSelected = (date: string, slot: number): boolean => {
        const range = this.dragRange();
        if (range?.date !== date) {
            return false;
        }
        return slot >= range.minSlot && slot <= range.maxSlot;
    };

    protected readonly getDailyNote = (isoDate: string): CalendarNote | undefined =>
        this.notes().find(note => note.date === isoDate && note.noteType === 'Daily');

    protected readonly entriesForDay = (isoDate: string): CalendarEntry[] =>
        this.entries().filter(entry => entry.date === isoDate);

    protected readonly appointmentsForDay = (isoDate: string): PublicAppointment[] =>
        this.publicAppointments().filter(appointment => appointment.date === isoDate);

    protected readonly getEntryTopSlot = (startTime: string): number =>
        timeToSlotIndex(startTime);

    protected readonly getEntrySpan = (startTime: string, endTime: string): number =>
        timeToSlotIndex(endTime) - timeToSlotIndex(startTime);

    protected readonly onPointerDown = (event: PointerEvent, date: string, slot: number) => {
        event.preventDefault();
        this.gridEl().nativeElement.setPointerCapture(event.pointerId);
        this.dragAnchorDate.set(date);
        this.dragAnchorSlot.set(slot);
        this.dragCurrentSlot.set(slot);
    };

    protected readonly onPointerMove = (event: PointerEvent) => {
        if (!this.dragAnchorDate()) {
            return;
        }
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const slotIndexString = element?.getAttribute('data-slot');
        if (slotIndexString !== null && slotIndexString !== undefined) {
            this.dragCurrentSlot.set(parseInt(slotIndexString, 10));
        }
    };

    protected readonly onPointerUp = () => {
        const range = this.dragRange();
        if (!range) {
            return;
        }
        const date = range.date;
        const startTime = slotIndexToTime(range.minSlot);
        const endTime = slotIndexToTime(range.maxSlot + 1);
        this.cancelDrag();
        this.dragComplete.emit({ date, startTime, endTime });
    };

    protected readonly cancelDrag = () => {
        this.dragAnchorDate.set(null);
        this.dragAnchorSlot.set(unsetSlot);
        this.dragCurrentSlot.set(unsetSlot);
    };
}
