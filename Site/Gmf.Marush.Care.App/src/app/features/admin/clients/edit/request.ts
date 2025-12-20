/* eslint-disable @typescript-eslint/no-magic-numbers */
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { phonePattern } from '@features/appointment/request';
import { Appointment } from './appointment';

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
    appointments: Appointment[] = [];
}

export const createAppointmentGroup = (formBuilder: NonNullableFormBuilder, value: Appointment): FormGroup => formBuilder.group({
    date: new FormControl(value.date, [Validators.required]),
    description: new FormControl(value.description, [Validators.required, Validators.maxLength(6000)])
});

export const createEmailGroup = (formBuilder: NonNullableFormBuilder, value: string): FormControl<string> =>
    formBuilder.control(value, [Validators.required, Validators.email, Validators.maxLength(100)]
);

export const createPhoneGroup = (formBuilder: NonNullableFormBuilder, value: string): FormControl<string> =>
    formBuilder.control(value, { validators: [Validators.required, phonePattern] }
);

export const requestFormWith = (formBuilder: NonNullableFormBuilder, values: Client) => formBuilder.group({
    name: new FormControl(values.name, [Validators.maxLength(100), Validators.required]),
    surname: new FormControl(values.surname, [Validators.maxLength(100), Validators.required]),
    phones: formBuilder.array(values.phones.map(phone => formBuilder.control(phone, { validators: [Validators.required, phonePattern] }))),
    emails: formBuilder.array(values.emails.map(email => formBuilder.control(email,
        { validators: [Validators.required, Validators.email, Validators.maxLength(100)] }))),
    birthday: new FormControl(values.birthday, []),
    city: new FormControl(values.city, [Validators.maxLength(100)]),
    diagnosis: new FormControl(values.diagnosis, [Validators.maxLength(1024)]),
    allergies: new FormControl(values.allergies, [Validators.maxLength(1024)]),
    comments: new FormControl(values.comments, [Validators.maxLength(6000)]),
    remarks: new FormControl(values.remarks, [Validators.maxLength(6000)]),
    appointments: formBuilder.array(values.appointments.map(appointment => createAppointmentGroup(formBuilder, appointment)))
}, { updateOn: 'change' });
