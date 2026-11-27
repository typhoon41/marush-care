/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { CalendarTimeSlots } from './calendar-time-slots';

describe('CalendarTimeSlots', () => {
    it('RULE-011 counts 44 quarter-hour slots between 11:00 and 22:00', () => {
        expect(CalendarTimeSlots.count).toBe(44);
        expect(CalendarTimeSlots.all.length).toBe(44);
        expect(CalendarTimeSlots.unset).toBe(-1);
    });

    it('RULE-011 maps slot indexes to the time each slot starts', () => {
        expect(CalendarTimeSlots.toTime(0)).toBe('11:00');
        expect(CalendarTimeSlots.toTime(10)).toBe('13:30');
        expect(CalendarTimeSlots.toTime(43)).toBe('21:45');
        expect(CalendarTimeSlots.toTime(44)).toBe('22:00');
        expect(CalendarTimeSlots.toTime(-1)).toBe('10:45');
    });

    it('RULE-011 maps a time to the slot containing it, flooring to the quarter hour', () => {
        expect(CalendarTimeSlots.toSlotIndex('11:00')).toBe(0);
        expect(CalendarTimeSlots.toSlotIndex('13:40')).toBe(10);
        expect(CalendarTimeSlots.toSlotIndex('22:00')).toBe(44);
        expect(CalendarTimeSlots.toSlotIndex('23:00')).toBe(48);
        expect(CalendarTimeSlots.toSlotIndex('10:00')).toBe(-4);
        expect(CalendarTimeSlots.toSlotIndex('')).toBeNaN();
    });

    it('RULE-011 clamps slot indexes to 0..44, letting NaN through', () => {
        expect(CalendarTimeSlots.clampToGrid(48)).toBe(44);
        expect(CalendarTimeSlots.clampToGrid(-4)).toBe(0);
        expect(CalendarTimeSlots.clampToGrid(10)).toBe(10);
        expect(CalendarTimeSlots.clampToGrid(Number.NaN)).toBeNaN();
    });

    it('RULE-011 labels only full hours and marks the slot that ends each hour', () => {
        expect(CalendarTimeSlots.all[0]).toEqual({ index: 0, time: '11:00', label: '11:00', endsHour: false });
        expect(CalendarTimeSlots.all[1]).toEqual({ index: 1, time: '11:15', label: '', endsHour: false });
        expect(CalendarTimeSlots.all[3]).toEqual({ index: 3, time: '11:45', label: '', endsHour: true });
        expect(CalendarTimeSlots.all[43]).toEqual({ index: 43, time: '21:45', label: '', endsHour: true });
        expect(CalendarTimeSlots.all.filter(slot => slot.label).length).toBe(11);
    });

    it('RULE-011 offers 11:00..21:45 as starts and 11:15..22:00 as ends', () => {
        expect(CalendarTimeSlots.startOptions.length).toBe(44);
        expect(CalendarTimeSlots.startOptions[0]).toEqual({ value: '11:00', label: '11:00' });
        expect(CalendarTimeSlots.startOptions[43]).toEqual({ value: '21:45', label: '21:45' });
        expect(CalendarTimeSlots.endOptions.length).toBe(44);
        expect(CalendarTimeSlots.endOptions[0]).toEqual({ value: '11:15', label: '11:15' });
        expect(CalendarTimeSlots.endOptions[43]).toEqual({ value: '22:00', label: '22:00' });
    });

    it('RULE-011 finds a grid option only for an exact quarter-hour boundary', () => {
        expect(CalendarTimeSlots.findOption('22:00')).toEqual({ value: '22:00', label: '22:00' });
        expect(CalendarTimeSlots.findOption('11:00')).toEqual({ value: '11:00', label: '11:00' });
        expect(CalendarTimeSlots.findOption('22:15')).toBeUndefined();
        expect(CalendarTimeSlots.findOption('14:10')).toBeUndefined();
        expect(CalendarTimeSlots.findOption()).toBeUndefined();
    });
});
