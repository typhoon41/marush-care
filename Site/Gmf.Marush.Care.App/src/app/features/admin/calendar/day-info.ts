import { CalendarEntry } from './calendar-entry';

export class DayInfo {
    readonly isoDate: string;
    readonly dayName: string;
    readonly fullDayName: string;
    readonly dayDate: string;
    readonly dailyTotal: number;
    readonly isPast: boolean;

    constructor(isoDate: string, entries: CalendarEntry[]) {
        const date = new Date(`${isoDate}T12:00:00`);
        this.isoDate = isoDate;
        this.dayName = date.toLocaleDateString('sr-Latn-RS', { weekday: 'short' });
        this.fullDayName = date.toLocaleDateString('sr-Latn-RS', { weekday: 'long' });
        this.dayDate = date.toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'numeric' });
        this.dailyTotal = entries
            .filter(entry => entry.date === isoDate && entry.money !== undefined)
            .reduce((sum, entry) => sum + (entry.money ?? 0), 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.isPast = date < today;
    }
}
