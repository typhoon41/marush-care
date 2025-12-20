/* eslint-disable @typescript-eslint/no-magic-numbers */
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { phonePattern } from '@features/appointment/request';

export class Client {
    name: string = '';
    surname: string = '';
    emails: string[] = [];
    phones: string[] = [];
    birthday: string | undefined = '';
    city: string | undefined = '';
    diagnosis: string | undefined = '';
    allergies: string | undefined = '';
    comments: string | undefined = '';
    remarks: string | undefined = '';
    appointments: { date: string; description: string }[] = [];
}

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

export const requestFormWith = (formBuilder: NonNullableFormBuilder, values: Client) => formBuilder.group({
    name: new FormControl(values.name, [Validators.maxLength(100), Validators.required]),
    surname: new FormControl(values.surname, [Validators.maxLength(100), Validators.required]),
    phones: formBuilder.array(values.phones.map(() => createPhoneGroup(formBuilder))),
    emails: formBuilder.array(values.emails.map(() => createEmailGroup(formBuilder))),
    birthday: new FormControl(values.birthday, []),
    city: new FormControl(values.city, [Validators.maxLength(100)]),
    diagnosis: new FormControl(values.diagnosis, [Validators.maxLength(1024)]),
    allergies: new FormControl(values.allergies, [Validators.maxLength(1024)]),
    comments: new FormControl(values.comments, [Validators.maxLength(6000)]),
    remarks: new FormControl(values.remarks, [Validators.maxLength(6000)]),
    appointments: formBuilder.array(values.appointments.map(() => createAppointmentGroup(formBuilder)))
}, { updateOn: 'change' });
