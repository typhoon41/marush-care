import { CalendarEntry } from '../calendar-entry';
import { CalendarEntryRequest } from '../calendar-entry-request';
import { generateTimeOptions } from '../calendar-time-slots';

export const timeOptions = generateTimeOptions();

export const maxSearchResults = 8;
export const minSearchLength = 2;

const emptyEntry: Partial<CalendarEntry> = {};

export const buildFormValue = (date?: string, start?: string, end?: string, entry: Partial<CalendarEntry> = emptyEntry) => ({
    date: date ?? entry.date ?? '',
    startTime: start ?? entry.startTime ?? '',
    endTime: end ?? entry.endTime ?? '',
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
