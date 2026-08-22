import { EntryFormValue } from './entry-dialog/entry-form-value';

export class CalendarEntryRequest {
    date: string = '';
    startTime: string = '';
    endTime: string = '';
    customerId?: string;
    appointmentId?: string;
    notes?: string;
    money?: number;
    treatments: string[] = [];

    static from = (formValue: EntryFormValue, treatments: string[]): CalendarEntryRequest => Object.assign(new CalendarEntryRequest(), {
            date: formValue.date,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            customerId: formValue.customerId || undefined,
            appointmentId: formValue.appointmentId || undefined,
            notes: formValue.notes || undefined,
            money: formValue.money ?? undefined,
            treatments
        });
}
