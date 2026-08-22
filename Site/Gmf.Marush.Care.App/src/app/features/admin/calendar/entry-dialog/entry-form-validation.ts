import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TimeInterval } from '../time-interval';

/** Cross-field rules the entry form enforces before a save is attempted. */
export class EntryFormValidation {
    static readonly timeInterval = (group: AbstractControl): ValidationErrors | null => {
        const interval = new TimeInterval(group.get('startTime')?.value ?? '', group.get('endTime')?.value ?? '');
        if (interval.hasOrderViolation()) {
            return { timeIntervalOrder: true };
        }

        if (interval.hasDurationViolation()) {
            return { timeIntervalDuration: true };
        }

        return null;
    };

    static readonly clientSelection = (group: AbstractControl): ValidationErrors | null => {
        const customerId = group.get('customerId')?.value;
        const appointmentId = group.get('appointmentId')?.value;
        return !customerId && !appointmentId ? { clientRequired: true } : null;
    };
}
