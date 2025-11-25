/* eslint-disable @typescript-eslint/no-magic-numbers */
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { phonePattern } from '@features/appointment/request';

export const createAppointmentGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    date: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(6000)])
});

export const createEmailGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)])
});

export const createPhoneGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    phone: new FormControl('', [Validators.required, phonePattern])
});

export const requestFormWith = (formBuilder: NonNullableFormBuilder) => formBuilder.group({
    name: new FormControl('', [Validators.maxLength(100), Validators.required]),
    surname: new FormControl('', [Validators.maxLength(100), Validators.required]),
    phones: formBuilder.array([]),
    emails: formBuilder.array([]),
    birthday: new FormControl('', []),
    city: new FormControl('', [Validators.maxLength(100)]),
    diagnosis: new FormControl('', [Validators.maxLength(1024)]),
    allergies: new FormControl('', [Validators.maxLength(1024)]),
    comments: new FormControl('', [Validators.maxLength(6000)]),
    remarks: new FormControl('', [Validators.maxLength(6000)]),
    appointments: formBuilder.array([])
}, { updateOn: 'change' });
