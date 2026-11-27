/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { CalendarDate } from './calendar-date';

describe('CalendarDate', () => {
    it('RULE-007 moves a Sunday back to the Monday of the week before it', () => {
        expect(CalendarDate.mondayOf(new Date(2026, 10, 29)).iso).toBe('2026-11-23');
    });

    it('RULE-007 keeps a Monday and moves Tuesday..Saturday back to that Monday', () => {
        expect(CalendarDate.mondayOf(new Date(2026, 10, 23)).iso).toBe('2026-11-23');
        expect(CalendarDate.mondayOf(new Date(2026, 10, 24)).iso).toBe('2026-11-23');
        expect(CalendarDate.mondayOf(new Date(2026, 10, 28, 23, 59)).iso).toBe('2026-11-23');
    });

    it('RULE-007 crosses month and year boundaries when finding the Monday', () => {
        expect(CalendarDate.mondayOf(new Date(2026, 11, 1)).iso).toBe('2026-11-30');
        expect(CalendarDate.mondayOf(new Date(2027, 0, 1)).iso).toBe('2026-12-28');
    });

    it('converts between ISO and the Serbian form without zero padding', () => {
        const date = CalendarDate.fromIso('2026-03-05');

        expect(date.serbian()).toBe('5.3.2026.');
        expect(CalendarDate.fromSerbian('5.3.2026.').iso).toBe('2026-03-05');
        expect(CalendarDate.fromSerbian('25.12.2026').iso).toBe('2026-12-25');
    });

    it('builds from a local Date and back to local midnight', () => {
        const date = CalendarDate.fromDate(new Date(2026, 0, 9, 18, 30));

        expect(date.iso).toBe('2026-01-09');
        expect(date.toDate()).toEqual(new Date(2026, 0, 9));
    });

    it('adds days across month ends, including negative shifts', () => {
        expect(CalendarDate.fromIso('2026-11-30').addDays(1).iso).toBe('2026-12-01');
        expect(CalendarDate.fromIso('2026-03-01').addDays(-1).iso).toBe('2026-02-28');
        expect(CalendarDate.fromIso('2028-02-28').addDays(1).iso).toBe('2028-02-29');
    });

    it('compares against a moment by its local midnight', () => {
        const date = CalendarDate.fromIso('2026-11-27');

        expect(date.isBefore(new Date(2026, 10, 27, 0, 0, 1))).toBe(true);
        expect(date.isBefore(new Date(2026, 10, 27))).toBe(false);
        expect(date.isBefore(new Date(2026, 10, 26, 23, 59))).toBe(false);
    });

    it('formats with the sr-Latn-RS locale', () => {
        expect(CalendarDate.fromIso('2026-11-23').format({ day: 'numeric', month: 'short' })).toBe('23. nov');
    });
});
