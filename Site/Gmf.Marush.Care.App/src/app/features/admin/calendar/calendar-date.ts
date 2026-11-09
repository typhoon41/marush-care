import { Signal, computed } from '@angular/core';
import { TwoDigits } from './two-digits';

const daysInWeek = 7;
const mondayIndex = 1;
const sundayIndex = 0;
const serbianLocale = 'sr-Latn-RS';

/** A calendar day, and every conversion this feature needs between its ISO and Serbian forms. */
export class CalendarDate {
    static readonly fromIso = (iso: string): CalendarDate => new CalendarDate(iso);

    static readonly fromDate = (date: Date): CalendarDate =>
        CalendarDate.fromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());

    static readonly fromSerbian = (serbian: string): CalendarDate => {
        const [day, month, year] = serbian.split('.').map(Number);
        return CalendarDate.fromParts(year, month, day);
    };

    static readonly mondayOf = (date: Date): CalendarDate => {
        const monday = new Date(date);
        const dayOfWeek = monday.getDay();
        const daysFromMonday = dayOfWeek === sundayIndex ? daysInWeek - mondayIndex : dayOfWeek - mondayIndex;
        monday.setDate(monday.getDate() - daysFromMonday);
        return CalendarDate.fromDate(monday);
    };

    private static readonly fromParts = (year: number, month: number, day: number): CalendarDate =>
        new CalendarDate(`${year}-${TwoDigits.of(month)}-${TwoDigits.of(day)}`);

    private readonly parts: Signal<number[]> = computed(() => this.iso.split('-').map(Number));

    readonly serbian: Signal<string> = computed(() => {
        const [year, month, day] = this.parts();
        return `${day}.${month}.${year}.`;
    });

    private constructor(readonly iso: string) { }

    readonly toDate = (): Date => {
        const [year, month, day] = this.parts();
        return new Date(year, month - 1, day);
    };

    readonly addDays = (days: number): CalendarDate => {
        const shifted = this.toDate();
        shifted.setDate(shifted.getDate() + days);
        return CalendarDate.fromDate(shifted);
    };

    readonly format = (options: Intl.DateTimeFormatOptions): string =>
        this.toDate().toLocaleDateString(serbianLocale, options);

    readonly isBefore = (other: Date): boolean => this.toDate() < other;
}
