import { CalendarDate } from '../calendar-date';
import { CalendarEntry } from '../calendar-entry';
import { CalendarSelection } from '../calendar-selection';

/** The values the entry form holds, in the shapes its controls use. */
export class EntryFormValue {
    date = '';
    startTime = '';
    endTime = '';
    customerId = '';
    appointmentId = '';
    notes = '';
    money: number | null = null;

    static for = (selection?: CalendarSelection, entry?: CalendarEntry): EntryFormValue => {
        const isoDate = selection?.date ?? entry?.date;
        return Object.assign(new EntryFormValue(), {
            date: isoDate ? CalendarDate.fromIso(isoDate).serbian : '',
            startTime: selection?.interval.startTime ?? entry?.startTime ?? '',
            endTime: selection?.interval.endTime ?? entry?.endTime ?? '',
            appointmentId: entry?.appointmentId ?? '',
            notes: entry?.notes ?? '',
            money: entry?.money ?? null
        });
    };
}
