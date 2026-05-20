import { inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { CalendarEntry } from '../calendar-entry';
import { CalendarEntryRequest } from '../calendar-entry-request';
import { generateTimeOptions } from '../calendar-time-slots';

export type { IComboBoxItem };

export const timeOptions = generateTimeOptions();

export const buildEntryForm = (): FormGroup => {
    const fb = inject(FormBuilder);
    return fb.nonNullable.group({
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        customerId: [''],
        appointmentId: [''],
        notes: [''],
        money: [null as number | null]
    }, { updateOn: 'blur' });
};

export const buildClientSearchForm = (): FormGroup => {
    const fb = inject(FormBuilder);
    return fb.nonNullable.group({ query: fb.nonNullable.control('', { updateOn: 'change' }) });
};

export const findTimeOption = (value?: string): IComboBoxItem | undefined => {
    if (!value) {
        return undefined;
    }
    return timeOptions.find(option => option.value === value);
};

export const maxSearchResults = 8;
export const minSearchLength = 2;

const emptyEntry: Partial<CalendarEntry> = {};

export const buildFormValue = (date?: string, startTime?: string, endTime?: string, entry: Partial<CalendarEntry> = emptyEntry) => ({
    date: date ?? entry.date ?? '',
    startTime: startTime ?? entry.startTime ?? '',
    endTime: endTime ?? entry.endTime ?? '',
    customerId: '',
    appointmentId: entry.appointmentId ?? '',
    notes: entry.notes ?? '',
    money: entry.money ?? null
});

export const buildEntryRequest = (formValue: Record<string, unknown>): CalendarEntryRequest => ({
    date: formValue['date'] as string,
    startTime: formValue['startTime'] as string,
    endTime: formValue['endTime'] as string,
    customerId: (formValue['customerId'] as string) || undefined,
    appointmentId: (formValue['appointmentId'] as string) || undefined,
    notes: (formValue['notes'] as string) || undefined,
    money: (formValue['money'] as number | null) ?? undefined
});

export const filterClientResults = (
    items: { id: string; fullName: string }[],
    query: string
) => items
    .filter(client => client.fullName.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSearchResults)
    .map(client => ({ id: client.id, label: client.fullName }));
