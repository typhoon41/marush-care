import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TimeInterval } from '../time-interval';

export const validateTimeInterval = (group: AbstractControl): ValidationErrors | null => {
    const interval = new TimeInterval(group.get('startTime')?.value ?? '', group.get('endTime')?.value ?? '');
    if (interval.hasOrderViolation()) {
        return { timeIntervalOrder: true };
    }
    if (interval.hasDurationViolation()) {
        return { timeIntervalDuration: true };
    }
    return null;
};

export const validateClientSelection = (group: AbstractControl): ValidationErrors | null => {
    const customerId = group.get('customerId')?.value;
    const appointmentId = group.get('appointmentId')?.value;
    return !customerId && !appointmentId ? { clientRequired: true } : null;
};
