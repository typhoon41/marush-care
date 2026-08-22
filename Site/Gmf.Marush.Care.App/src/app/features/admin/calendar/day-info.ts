import { CalendarDate } from './calendar-date';
import { CalendarEntry } from './calendar-entry';

const pastEarningsLabel = 'Zarada';
const expectedEarningsLabel = 'Očekivana zarada';

/** One day column of the week grid, with everything the header needs to render. */
export class DayInfo {
    readonly isoDate: string;
    readonly dayName: string;
    readonly fullDayName: string;
    readonly dayDate: string;
    readonly dailyTotal: number;
    readonly isPast: boolean;

    constructor(date: CalendarDate, entries: CalendarEntry[]) {
        this.isoDate = date.iso;
        this.dayName = date.format({ weekday: 'short' });
        this.fullDayName = date.format({ weekday: 'long' });
        this.dayDate = date.format({ day: 'numeric', month: 'numeric' });
        this.dailyTotal = entries
            .filter(entry => entry.date === date.iso)
            .reduce((total, entry) => total + (entry.money ?? 0), 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.isPast = date.isBefore(today);
    }

    get hasEarnings(): boolean {
        return this.dailyTotal > 0;
    }

    get earningsLabel(): string {
        return this.isPast ? pastEarningsLabel : expectedEarningsLabel;
    }

    nameFor(isDesktop: boolean): string {
        return isDesktop ? this.fullDayName : this.dayName;
    }
}
