import { CalendarDate } from '../calendar-date';
import { CalendarEntry } from '../calendar-entry';
import { CalendarSelection } from '../calendar-selection';

/** The values the entry form holds, in the shapes its controls use. */
export class EntryFormValue {
    static readonly for = (selection?: CalendarSelection, entry?: CalendarEntry): EntryFormValue => {
        const isoDate = selection?.date ?? entry?.date;
        return Object.assign(new EntryFormValue(), {
            date: isoDate ? CalendarDate.fromIso(isoDate).serbian() : '',
            startTime: selection?.interval.startTime ?? entry?.startTime ?? '',
            endTime: selection?.interval.endTime ?? entry?.endTime ?? '',
            appointmentId: entry?.appointmentId ?? '',
            notes: entry?.notes ?? '',
            money: entry?.money ?? null
        });
    };

    /** An entry needs either a chosen client or the public appointment it was created from. */
    static readonly lacksClient = (value: Partial<EntryFormValue>): boolean =>
        !value.customerId && !value.appointmentId;

    date = '';
    startTime = '';
    endTime = '';
    customerId = '';
    appointmentId = '';
    notes = '';
    money: number | null = null;
}
