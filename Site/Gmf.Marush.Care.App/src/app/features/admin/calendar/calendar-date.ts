const padToTwoDigits = 2;
const daysInWeek = 7;
const mondayIndex = 1;
const sundayIndex = 0;
const serbianLocale = 'sr-Latn-RS';

/** A calendar day, and every conversion this feature needs between its ISO and Serbian forms. */
export class CalendarDate {
    private constructor(readonly iso: string) { }

    static fromIso = (iso: string): CalendarDate => new CalendarDate(iso);

    static fromDate = (date: Date): CalendarDate => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString()
            .padStart(padToTwoDigits, '0');
        const day = date.getDate().toString()
            .padStart(padToTwoDigits, '0');
        return new CalendarDate(`${year}-${month}-${day}`);
    };

    static fromSerbian = (serbian: string): CalendarDate => {
        const [day, month, year] = serbian.split('.');
        return new CalendarDate(`${year}-${month.padStart(padToTwoDigits, '0')}-${day.padStart(padToTwoDigits, '0')}`);
    };

    static mondayOf = (date: Date): CalendarDate => {
        const monday = new Date(date);
        const dayOfWeek = monday.getDay();
        const daysFromMonday = dayOfWeek === sundayIndex ? daysInWeek - mondayIndex : dayOfWeek - mondayIndex;
        monday.setDate(monday.getDate() - daysFromMonday);
        return CalendarDate.fromDate(monday);
    };

    get serbian(): string {
        const [year, month, day] = this.iso.split('-');
        return `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}.`;
    }

    addDays(days: number): CalendarDate {
        const shifted = this.toDate();
        shifted.setDate(shifted.getDate() + days);
        return CalendarDate.fromDate(shifted);
    }

    toDate(): Date {
        const [year, month, day] = this.iso.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    format(options: Intl.DateTimeFormatOptions): string {
        return this.toDate().toLocaleDateString(serbianLocale, options);
    }

    isBefore(other: Date): boolean {
        return this.toDate() < other;
    }
}
