import { CalendarDate } from './calendar-date';

const shortDateFormat: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

/** The Monday-to-Saturday week the salon operates on. */
export class WorkingWeek {
    static readonly totalDays = 7;
    static readonly workingDays = 6;

    constructor(readonly start: CalendarDate) { }

    static containing = (date: Date): WorkingWeek => new WorkingWeek(CalendarDate.mondayOf(date));

    get lastDay(): CalendarDate {
        return this.start.addDays(WorkingWeek.workingDays - 1);
    }

    get days(): CalendarDate[] {
        return Array.from({ length: WorkingWeek.workingDays }, (_, dayIndex) => this.start.addDays(dayIndex));
    }

    get label(): string {
        return `${this.start.format(shortDateFormat)} – ${this.lastDay.format(shortDateFormat)}`;
    }

    previous(): WorkingWeek {
        return new WorkingWeek(this.start.addDays(-WorkingWeek.totalDays));
    }

    next(): WorkingWeek {
        return new WorkingWeek(this.start.addDays(WorkingWeek.totalDays));
    }
}
