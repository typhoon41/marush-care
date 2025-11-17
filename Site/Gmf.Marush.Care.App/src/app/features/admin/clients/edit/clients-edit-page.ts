
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DatePicker } from '@shared/components/forms/date-picker/date-picker';
import { Input } from '@shared/components/forms/input/input';
import { createAppointmentGroup, createEmailGroup, createPhoneGroup, requestFormWith } from './request';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-clients-edit-page',
    imports: [Input, DatePicker, ReactiveFormsModule],
    templateUrl: './clients-edit-page.html',
    styleUrl: './clients-edit-page.scss'
})
export class ClientsEditPage {
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    protected readonly form: FormGroup;

    constructor() {
        this.form = requestFormWith(this.formBuilder);
        this.title.setTitle('Marush: Space of Care - izmena klijenta');
    }

    protected readonly onSubmit = () => {
        if (this.form.invalid) {
            return;
        }

        const name = this.form.get('name')?.value as string;
        // eslint-disable-next-line no-console
        console.log('Submitted name:', name);
        // This.clients.data().filter.set(name ?? '');
    };

    protected readonly onCancel = async() => {
        await this.router.navigate(['/admin/klijenti']);
    };

    protected get appointments(): FormArray<FormGroup> {
        return this.form.get('appointments') as FormArray<FormGroup>;
    }

    protected get phones(): FormArray<FormGroup> {
        return this.form.get('phones') as FormArray<FormGroup>;
    }

    protected get emails(): FormArray<FormGroup> {
        return this.form.get('emails') as FormArray<FormGroup>;
    }

    protected readonly addEmail = (): void => {
        this.emails.push(createEmailGroup(this.formBuilder));
    };

    protected readonly addPhone = (): void => {
        this.phones.push(createPhoneGroup(this.formBuilder));
    };

    protected readonly addAppointment = (): void => {
        this.appointments.push(createAppointmentGroup(this.formBuilder));
    };

    protected removeAppointment(index: number): void {
        this.appointments.removeAt(index);
    }

    protected removePhone(index: number): void {
        this.phones.removeAt(index);
    }

    protected removeEmail(index: number): void {
        this.emails.removeAt(index);
    }
}
