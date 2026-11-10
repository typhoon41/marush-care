import { Signal, computed } from '@angular/core';
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

    readonly hasEarnings: Signal<boolean> = computed(() => this.dailyTotal > 0);
    readonly earningsLabel: Signal<string> = computed(() => this.isPast ? pastEarningsLabel : expectedEarningsLabel);

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

    readonly nameFor = (isDesktop: boolean): string => {
        if (isDesktop) {
            return this.fullDayName;
        }

        return this.dayName;
    };
}
