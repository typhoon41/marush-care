import { Signal, computed } from '@angular/core';
import { TimeInterval } from '../time-interval';
import { EntryFormValue } from './entry-form-value';

/** The validation messages the entry dialog shows, derived from the live form values. */
export class EntryErrors {
    readonly timeOrder: Signal<boolean>;
    readonly timeDuration: Signal<boolean>;
    readonly client: Signal<boolean>;

    constructor(saveAttempted: Signal<boolean>, clientInteracted: Signal<boolean>,
        formValues: Signal<Partial<EntryFormValue>>) {
        const interval = computed(() => {
            const { startTime, endTime } = formValues();
            return new TimeInterval(startTime ?? '', endTime ?? '');
        });

        this.timeOrder = computed(() => interval().hasOrderViolation());
        this.timeDuration = computed(() => interval().hasDurationViolation());
        this.client = computed(() => {
            const { customerId, appointmentId } = formValues();
            return (saveAttempted() || clientInteracted()) && !customerId && !appointmentId;
        });
    }
}
