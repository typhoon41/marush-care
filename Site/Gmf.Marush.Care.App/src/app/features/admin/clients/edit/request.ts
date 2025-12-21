/* eslint-disable @typescript-eslint/no-magic-numbers */
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { phonePattern } from '@features/appointment/request';
import { Appointment } from './appointment';

export class Client {
    id: string = '';
    name: string = '';
    surname: string = '';
    emails: string[] = [];
    phones: string[] = [];
    birthday: string = '';
    city: string = '';
    diagnosis: string = '';
    allergies: string = '';
    comments: string = '';
    remarks: string = '';
    appointments: Appointment[] = [];
}

export const createAppointmentGroup = (formBuilder: NonNullableFormBuilder, value: Appointment): FormGroup => formBuilder.group({
    date: new FormControl(value.date, [Validators.required]),
    description: new FormControl(value.description, [Validators.required, Validators.maxLength(6000)])
});

export const createEmailControl = (formBuilder: NonNullableFormBuilder, value: string): FormControl<string> =>
    formBuilder.control(value, [Validators.required, Validators.email, Validators.maxLength(100)]
);

export const createPhoneControl = (formBuilder: NonNullableFormBuilder, value: string): FormControl<string> =>
    formBuilder.control(value, { validators: [Validators.required, phonePattern] }
);

export const requestFormWith = (formBuilder: NonNullableFormBuilder, values: Client) => formBuilder.group({
    name: new FormControl(values.name, [Validators.maxLength(100), Validators.required]),
    surname: new FormControl(values.surname, [Validators.maxLength(100), Validators.required]),
    phones: formBuilder.array(values.phones.map(phone => createPhoneControl(formBuilder, phone))),
    emails: formBuilder.array(values.emails.map(email => createEmailControl(formBuilder, email))),
    birthday: new FormControl(values.birthday, []),
    city: new FormControl(values.city, [Validators.maxLength(100)]),
    diagnosis: new FormControl(values.diagnosis, [Validators.maxLength(1024)]),
    allergies: new FormControl(values.allergies, [Validators.maxLength(1024)]),
    comments: new FormControl(values.comments, [Validators.maxLength(6000)]),
    remarks: new FormControl(values.remarks, [Validators.maxLength(6000)]),
    appointments: formBuilder.array(values.appointments.map(appointment => createAppointmentGroup(formBuilder, appointment)))
}, { updateOn: 'change' });
