/* eslint-disable @typescript-eslint/no-magic-numbers -- Characterization specs pin literal legacy values. */
import { WorkingWeek } from './working-week';

describe('WorkingWeek', () => {
    it('RULE-007 starts the week containing Sunday 2026-11-29 on Monday 2026-11-23', () => {
        const week = WorkingWeek.containing(new Date(2026, 10, 29));

        expect(week.start.iso).toBe('2026-11-23');
        expect(week.lastDay().iso).toBe('2026-11-28');
    });

    it('RULE-007 lists six working days, Monday to Saturday', () => {
        const week = WorkingWeek.containing(new Date(2026, 10, 25));

        expect(WorkingWeek.workingDays).toBe(6);
        expect(WorkingWeek.totalDays).toBe(7);
        expect(week.days().map(day => day.iso)).toEqual([
            '2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28'
        ]);
    });

    it('RULE-007 moves seven days for the previous and next week', () => {
        const week = WorkingWeek.containing(new Date(2026, 10, 25));

        expect(week.next().start.iso).toBe('2026-11-30');
        expect(week.previous().start.iso).toBe('2026-11-16');
        expect(week.next().next().start.iso).toBe('2026-12-07');
    });

    it('RULE-007 labels the week from Monday to Saturday in sr-Latn-RS short dates', () => {
        expect(WorkingWeek.containing(new Date(2026, 10, 25)).label()).toBe('23. nov – 28. nov');
        expect(WorkingWeek.containing(new Date(2026, 11, 30)).label()).toBe('28. dec – 2. jan');
    });
});
