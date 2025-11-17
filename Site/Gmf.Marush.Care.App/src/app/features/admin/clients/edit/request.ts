/* eslint-disable @typescript-eslint/no-magic-numbers */
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { phonePattern } from '@features/appointment/request';

export const createAppointmentGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    date: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(2000)])
});

export const createEmailGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)])
});

export const createPhoneGroup = (formBuilder: NonNullableFormBuilder): FormGroup => formBuilder.group({
    phone: new FormControl('', [Validators.required, phonePattern])
});

export const requestFormWith = (formBuilder: NonNullableFormBuilder) => formBuilder.group({
    name: new FormControl('', [Validators.maxLength(25), Validators.required]),
    surname: new FormControl('', [Validators.maxLength(50), Validators.required]),
    phones: formBuilder.array([
        createPhoneGroup(formBuilder)
    ]),
    emails: formBuilder.array([
        createEmailGroup(formBuilder)
    ]),
    birthday: new FormControl('', []),
    city: new FormControl('', [Validators.maxLength(50)]),
    diagnosis: new FormControl('', [Validators.maxLength(500)]),
    allergies: new FormControl('', [Validators.maxLength(500)]),
    comments: new FormControl('', [Validators.maxLength(2000)]),
    remarks: new FormControl('', [Validators.maxLength(2000)]),
    appointments: formBuilder.array([
        createAppointmentGroup(formBuilder)
    ])

}, { updateOn: 'change' });
