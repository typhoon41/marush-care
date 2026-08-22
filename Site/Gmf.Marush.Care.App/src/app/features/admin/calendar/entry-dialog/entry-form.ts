import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { EntryFormValidation } from './entry-form-validation';

export type EntryForm = FormGroup<{
    date: FormControl<string>;
    startTime: FormControl<string>;
    endTime: FormControl<string>;
    customerId: FormControl<string>;
    appointmentId: FormControl<string>;
    notes: FormControl<string>;
    money: FormControl<number | null>;
}>;

export const buildEntryForm = (formBuilder: NonNullableFormBuilder): EntryForm => formBuilder.group({
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerId: new FormControl('', { nonNullable: true }),
    appointmentId: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
    money: new FormControl<number | null>(null, [Validators.min(0)])
}, {
    updateOn: 'blur',
    validators: [EntryFormValidation.timeInterval, EntryFormValidation.clientSelection]
});
