import { Signal, computed } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { CalendarEntry } from '../calendar-entry';
import { CalendarEntryRequest } from '../calendar-entry-request';
import { CalendarSelection } from '../calendar-selection';
import { timeOptions } from '../calendar-time-slots';
import { parseIsoDate, toSerbianDate } from '../calendar-week-navigator';
import { TimeInterval } from '../time-interval';
import { validateClientSelection, validateTimeInterval } from './calendar-entry-validation';

export type { IComboBoxItem };

export interface EntryFormValue {
    date: string;
    startTime: string;
    endTime: string;
    customerId: string;
    appointmentId: string;
    notes: string;
    money: number | null;
}

export type EntryForm = FormGroup<{
    date: FormControl<string>;
    startTime: FormControl<string>;
    endTime: FormControl<string>;
    customerId: FormControl<string>;
    appointmentId: FormControl<string>;
    notes: FormControl<string>;
    money: FormControl<number | null>;
}>;

export type SearchForm = FormGroup<{ query: FormControl<string> }>;

export const buildEntryForm = (formBuilder: NonNullableFormBuilder): EntryForm => formBuilder.group({
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerId: new FormControl('', { nonNullable: true }),
    appointmentId: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
    money: new FormControl<number | null>(null, [Validators.min(0)])
}, { updateOn: 'blur', validators: [validateTimeInterval, validateClientSelection] });

export const buildSearchForm = (formBuilder: NonNullableFormBuilder): SearchForm =>
    formBuilder.group({
        query: new FormControl('', { nonNullable: true, updateOn: 'change' })
    });

export const toPickerDate = (isoDate?: string): Date => {
    if (!isoDate) {
        return new Date();
    }
    return parseIsoDate(isoDate);
};

export const findTimeOption = (value?: string): IComboBoxItem | undefined => {
    if (!value) {
        return undefined;
    }
    return timeOptions.find(option => option.value === value);
};

export const buildFormValue = (selection?: CalendarSelection, entry?: CalendarEntry): EntryFormValue => {
    const isoDate = selection?.date ?? entry?.date;
    return {
        date: isoDate ? toSerbianDate(isoDate) : '',
        startTime: selection?.interval.startTime ?? entry?.startTime ?? '',
        endTime: selection?.interval.endTime ?? entry?.endTime ?? '',
        customerId: '',
        appointmentId: entry?.appointmentId ?? '',
        notes: entry?.notes ?? '',
        money: entry?.money ?? null
    };
};

export const buildEntryRequest = (formValue: EntryFormValue, treatments: string[]): CalendarEntryRequest => ({
    date: formValue.date,
    startTime: formValue.startTime,
    endTime: formValue.endTime,
    customerId: formValue.customerId || undefined,
    appointmentId: formValue.appointmentId || undefined,
    notes: formValue.notes || undefined,
    money: formValue.money ?? undefined,
    treatments
});

export const buildRescheduleWarning = (
    editingEntry: Signal<CalendarEntry | null>,
    formValues: Signal<Partial<EntryFormValue>>): Signal<boolean> =>
    computed(() => {
        const entry = editingEntry();
        if (!entry) {
            return false;
        }
        const values = formValues();
        const formInterval = new TimeInterval(values.startTime ?? '', values.endTime ?? '');
        return values.date !== toSerbianDate(entry.date) || !formInterval.equals(new TimeInterval(entry.startTime, entry.endTime));
    });
