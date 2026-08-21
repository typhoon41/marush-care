import { Signal, computed } from '@angular/core';
import { TimeInterval } from '../time-interval';
import { EntryFormValue } from './calendar-entry-form';

export const buildEntryErrors = (
    saveAttempted: Signal<boolean>,
    clientInteracted: Signal<boolean>,
    formValues: Signal<Partial<EntryFormValue>>): {
        timeOrder: Signal<boolean>;
        timeDuration: Signal<boolean>;
        client: Signal<boolean>;
    } => {
    const interval = computed(() => {
        const { startTime, endTime } = formValues();
        return new TimeInterval(startTime ?? '', endTime ?? '');
    });
    return {
        timeOrder: computed(() => interval().hasOrderViolation()),
        timeDuration: computed(() => interval().hasDurationViolation()),
        client: computed(() => {
            const { customerId, appointmentId } = formValues();
            return (saveAttempted() || clientInteracted()) && !customerId && !appointmentId;
        })
    };
};
