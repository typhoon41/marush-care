/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePicker } from './date-picker';

interface Cell { day: number; disabled: boolean }

const openPickerOn = async(today: Date, startDate?: Date) => {
    vi.setSystemTime(today);
    const form = new FormGroup({ date: new FormControl('') });
    const fixture = TestBed.createComponent(DatePicker);
    fixture.componentRef.setInput('form', form);
    fixture.componentRef.setInput('name', 'date');
    fixture.componentRef.setInput('startDate', startDate);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector('input')?.dispatchEvent(new Event('focus'));
    return { form, picker: document.querySelector<HTMLElement>('.air-datepicker') as HTMLElement };
};

const visibleCells = (picker: HTMLElement): Cell[] =>
    Array.from(picker.querySelectorAll<HTMLElement>('.air-datepicker-cell.-day-:not(.-other-month-)'))
        .map(cell => ({ day: Number(cell.dataset['date']), disabled: cell.classList.contains('-disabled-') }));

const enabledDays = (picker: HTMLElement) => visibleCells(picker)
    .filter(cell => !cell.disabled)
    .map(cell => cell.day);

// A real press; Air Datepicker selects on click but reports the selection through onSelect on a later macrotask.
const pressDay = (picker: HTMLElement, day: number, month: number) => {
    const cell = picker.querySelector<HTMLElement>(`.air-datepicker-cell.-day-[data-date="${day}"][data-month="${month}"]`);
    cell?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    cell?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    cell?.click();
};

const showNextMonth = (picker: HTMLElement) =>
    picker.querySelector<HTMLElement>('.air-datepicker-nav--action[data-action="next"]')?.click();

describe('DatePicker', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        document.querySelectorAll('.air-datepicker').forEach(picker => picker.remove());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('RULE-018 enables only weekdays from today to the end of the current month view', async() => {
        const { picker } = await openPickerOn(new Date(2026, 0, 14, 10, 0));

        expect(enabledDays(picker)).toEqual([14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30]);
    });

    it('RULE-018 stops at the same day next month', async() => {
        const { picker } = await openPickerOn(new Date(2026, 0, 14, 10, 0));
        showNextMonth(picker);

        expect(enabledDays(picker)).toEqual([2, 3, 4, 5, 6, 9, 10, 11, 12, 13]);
    });

    it('RULE-018 clamps the last day to the end of a shorter next month (Jan 31 to Feb 28)', async() => {
        const { picker } = await openPickerOn(new Date(2026, 0, 31, 10, 0));
        expect(enabledDays(picker)).toEqual([]);

        showNextMonth(picker);
        expect(enabledDays(picker)).toEqual([2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27]);
    });

    it('RULE-018 writes the clicked day to the control in the Serbian format', async() => {
        const { form, picker } = await openPickerOn(new Date(2026, 0, 14, 10, 0));

        pressDay(picker, 15, 0);

        await vi.waitFor(() => expect(form.controls.date.value).toBe('15.1.2026.'));
    });

    it('RULE-018 ignores a click on a disabled Saturday', async() => {
        const { form, picker } = await openPickerOn(new Date(2026, 0, 14, 10, 0));
        const written: (string | null)[] = [];
        form.controls.date.valueChanges.subscribe(value => written.push(value));

        pressDay(picker, 17, 0);
        pressDay(picker, 16, 0);

        await vi.waitFor(() => expect(form.controls.date.value).toBe('16.1.2026.'));
        expect(written).toEqual(['16.1.2026.']);
    });

    it('RULE-018 lifts every limit when a start date is given (admin use)', async() => {
        const { picker } = await openPickerOn(new Date(2026, 0, 14, 10, 0), new Date(2026, 0, 14));

        expect(visibleCells(picker).every(cell => !cell.disabled)).toBe(true);
        expect(visibleCells(picker).length).toBe(31);
    });
});
