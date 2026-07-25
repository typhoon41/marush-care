import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { CalendarEntry } from '../calendar-entry';
import { CalendarEntryRequest } from '../calendar-entry-request';
import { timeOptions } from '../calendar-time-slots';
import { toSerbianDate } from '../calendar-week-navigator';

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

export type ClientSearchForm = FormGroup<{ query: FormControl<string> }>;

export const buildEntryForm = (formBuilder: NonNullableFormBuilder): EntryForm => formBuilder.group({
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerId: new FormControl('', { nonNullable: true }),
    appointmentId: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
    money: new FormControl<number | null>(null)
}, { updateOn: 'blur' });

export const buildClientSearchForm = (formBuilder: NonNullableFormBuilder): ClientSearchForm =>
    formBuilder.group({
        query: new FormControl('', { nonNullable: true, updateOn: 'change' })
    });

export const findTimeOption = (value?: string): IComboBoxItem | undefined => {
    if (!value) {
        return undefined;
    }
    return timeOptions.find(option => option.value === value);
};

export const buildFormValue = (date?: string, startTime?: string, endTime?: string, entry?: CalendarEntry): EntryFormValue => ({
    date: date ?? entry?.date ?? '',
    startTime: startTime ?? entry?.startTime ?? '',
    endTime: endTime ?? entry?.endTime ?? '',
    customerId: '',
    appointmentId: entry?.appointmentId ?? '',
    notes: entry?.notes ?? '',
    money: entry?.money ?? null
});

export const buildEntryRequest = (formValue: EntryFormValue): CalendarEntryRequest => ({
    date: toSerbianDate(formValue.date),
    startTime: formValue.startTime,
    endTime: formValue.endTime,
    customerId: formValue.customerId || undefined,
    appointmentId: formValue.appointmentId || undefined,
    notes: formValue.notes || undefined,
    money: formValue.money ?? undefined
});
