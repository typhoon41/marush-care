import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TimeInterval } from '../time-interval';
import { EntryFormValue } from './entry-form-value';

/** Cross-field rules the entry form enforces before a save is attempted. */
export class EntryFormValidation {
    static readonly timeInterval = (group: AbstractControl): ValidationErrors | null => {
        const interval = TimeInterval.of(EntryFormValidation.valueOf(group));
        if (interval.hasOrderViolation()) {
            return { timeIntervalOrder: true };
        }

        if (interval.hasDurationViolation()) {
            return { timeIntervalDuration: true };
        }

        return null;
    };

    static readonly clientSelection = (group: AbstractControl): ValidationErrors | null => {
        if (EntryFormValue.lacksClient(EntryFormValidation.valueOf(group))) {
            return { clientRequired: true };
        }

        return null;
    };

    private static readonly valueOf = (group: AbstractControl): Partial<EntryFormValue> =>
        group.getRawValue() as Partial<EntryFormValue>;
}
