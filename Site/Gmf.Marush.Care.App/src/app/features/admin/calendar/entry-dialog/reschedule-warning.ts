import { Signal, computed } from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { CalendarEntry } from '../calendar-entry';
import { TimeInterval } from '../time-interval';
import { EntryFormValue } from './entry-form-value';

/** Whether the edited entry has moved far enough to notify the client. */
export class RescheduleWarning {
    readonly isVisible: Signal<boolean>;

    constructor(editingEntry: Signal<CalendarEntry | null>, formValues: Signal<Partial<EntryFormValue>>) {
        this.isVisible = computed(() => {
            const entry = editingEntry();
            if (!entry) {
                return false;
            }

            const values = formValues();
            const formInterval = new TimeInterval(values.startTime ?? '', values.endTime ?? '');
            return values.date !== CalendarDate.fromIso(entry.date).serbian
                || !formInterval.equals(new TimeInterval(entry.startTime, entry.endTime));
        });
    }
}
