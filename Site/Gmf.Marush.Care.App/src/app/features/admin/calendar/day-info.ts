import { CalendarEntry } from './calendar-entry';

export class DayInfo {
    readonly isoDate: string;
    readonly label: string;
    readonly fullLabel: string;
    readonly dailyTotal: number;
    readonly isPast: boolean;

    constructor(isoDate: string, entries: CalendarEntry[]) {
        const date = new Date(`${isoDate}T12:00:00`);
        const dayName = date.toLocaleDateString('sr-Latn-RS', { weekday: 'short' });
        const fullDayName = date.toLocaleDateString('sr-Latn-RS', { weekday: 'long' });
        const dayDate = date.toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'numeric' });
        this.isoDate = isoDate;
        this.label = `${dayName} ${dayDate}`;
        this.fullLabel = `${fullDayName} ${dayDate}`;
        this.dailyTotal = entries
            .filter(entry => entry.date === isoDate && entry.money !== undefined)
            .reduce((sum, entry) => sum + (entry.money ?? 0), 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.isPast = date < today;
    }
}
