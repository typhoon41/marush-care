/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { TimeInterval } from './time-interval';

describe('TimeInterval', () => {
    it('RULE-011 RULE-023 places 18:00-22:00 on slots 28..44 with a 16-slot span and no violation', () => {
        const interval = new TimeInterval('18:00', '22:00');

        expect(interval.range()).toBe('18:00-22:00');
        expect(interval.isComplete()).toBe(true);
        expect(interval.startSlot()).toBe(28);
        expect(interval.endSlot()).toBe(44);
        expect(interval.slotSpan()).toBe(16);
        expect(interval.positionClasses()).toBe('entry-top-28 entry-span-16');
        expect(interval.hasOrderViolation()).toBe(false);
        expect(interval.hasDurationViolation()).toBe(false);
    });

    it('RULE-023 flags 17:45-22:00 (17 slots) as longer than the 16-slot maximum', () => {
        const interval = new TimeInterval('17:45', '22:00');

        expect(interval.slotSpan()).toBe(17);
        expect(interval.hasDurationViolation()).toBe(true);
    });

    it('RULE-023 does not flag 18:00-22:15 because the end clamps to the grid edge', () => {
        const interval = new TimeInterval('18:00', '22:15');

        expect(interval.endSlot()).toBe(44);
        expect(interval.slotSpan()).toBe(16);
        expect(interval.hasDurationViolation()).toBe(false);
    });

    it('RULE-023 does not flag 14:10-15:10, an interval off the quarter-hour grid', () => {
        const interval = new TimeInterval('14:10', '15:10');

        expect(interval.startSlot()).toBe(12);
        expect(interval.endSlot()).toBe(16);
        expect(interval.hasOrderViolation()).toBe(false);
        expect(interval.hasDurationViolation()).toBe(false);
    });

    it('RULE-023 flags a zero-length or reversed interval as an order violation, drawn one slot high', () => {
        const zeroLength = new TimeInterval('12:00', '12:00');
        const reversed = new TimeInterval('13:00', '12:00');

        expect(zeroLength.hasOrderViolation()).toBe(true);
        expect(zeroLength.renderedSpan()).toBe(1);
        expect(zeroLength.positionClasses()).toBe('entry-top-4 entry-span-1');
        expect(reversed.slotSpan()).toBe(-4);
        expect(reversed.hasOrderViolation()).toBe(true);
        expect(reversed.renderedSpan()).toBe(1);
    });

    it('RULE-011 clamps an interval outside opening hours to the grid edges', () => {
        const interval = new TimeInterval('09:00', '23:30');

        expect(interval.startSlot()).toBe(0);
        expect(interval.endSlot()).toBe(44);
        expect(interval.slotSpan()).toBe(44);
        expect(interval.hasDurationViolation()).toBe(true);
    });

    it('RULE-023 treats a missing time as incomplete, with NaN slots and no violation', () => {
        const interval = TimeInterval.of({ startTime: '12:00' });

        expect(interval.startTime).toBe('12:00');
        expect(interval.endTime).toBe('');
        expect(interval.range()).toBe('12:00-');
        expect(interval.isComplete()).toBe(false);
        expect(interval.endSlot()).toBeNaN();
        expect(interval.positionClasses()).toBe('entry-top-4 entry-span-NaN');
        expect(interval.hasOrderViolation()).toBe(false);
        expect(interval.hasDurationViolation()).toBe(false);
    });

    it('RULE-011 builds an interval from slot indexes and compares by start and end time', () => {
        const interval = TimeInterval.fromSlots(4, 8);

        expect(interval.range()).toBe('12:00-13:00');
        expect(interval.equals(new TimeInterval('12:00', '13:00'))).toBe(true);
        expect(interval.equals(new TimeInterval('12:00', '13:15'))).toBe(false);
    });
});
