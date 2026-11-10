import { Signal, computed } from '@angular/core';
import { CalendarDate } from './calendar-date';

const shortDateFormat: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

/** The Monday-to-Saturday week the salon operates on. */
export class WorkingWeek {
    static readonly totalDays = 7;
    static readonly workingDays = 6;

    static readonly containing = (date: Date): WorkingWeek => new WorkingWeek(CalendarDate.mondayOf(date));

    readonly lastDay: Signal<CalendarDate> = computed(() => this.start.addDays(WorkingWeek.workingDays - 1));

    readonly days: Signal<CalendarDate[]> = computed(() =>
        Array.from({ length: WorkingWeek.workingDays }, (_, dayIndex) => this.start.addDays(dayIndex)));

    readonly label: Signal<string> = computed(() =>
        `${this.start.format(shortDateFormat)} – ${this.lastDay().format(shortDateFormat)}`);

    constructor(readonly start: CalendarDate) { }

    readonly previous = (): WorkingWeek => this.shiftedBy(-WorkingWeek.totalDays);

    readonly next = (): WorkingWeek => this.shiftedBy(WorkingWeek.totalDays);

    private readonly shiftedBy = (days: number): WorkingWeek => new WorkingWeek(this.start.addDays(days));
}
