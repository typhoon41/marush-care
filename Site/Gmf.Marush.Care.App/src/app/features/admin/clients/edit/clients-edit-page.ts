/* eslint-disable max-lines */
import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, Renderer2, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DatePicker } from '@shared/components/forms/date-picker/date-picker';
import { FieldGroup } from '@shared/components/forms/group/field-group';
import { Input } from '@shared/components/forms/input/input';
import { Captcha } from '@shared/services/captcha';
import { Clients } from '../clients';
import { Appointment } from './appointment';
import { Client, createAppointmentGroup, createEmailControl, createPhoneControl, requestFormWith } from './request';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-clients-edit-page',
    imports: [Input, DatePicker, FieldGroup, ReactiveFormsModule],
    templateUrl: './clients-edit-page.html',
    styleUrl: './clients-edit-page.scss'
})
export class ClientsEditPage {
    readonly id = input<string | undefined>();
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);
    private readonly renderer = inject(Renderer2);
    private readonly captcha = inject(Captcha);
    private readonly title = inject(Title);
    private readonly clients = inject(Clients);
    protected readonly form = signal<FormGroup | undefined>(undefined);
    protected readonly globalError = signal('');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly averageClientAge = new Date(2000, 0, 1);
    protected readonly today = new Date();

    private readonly clientFetch = this.clients.getById(this.id);

    constructor() {
        effect(() => {
            if (!this.id()) {
                this.form.set(requestFormWith(this.formBuilder, new Client()));
                return;
            }

            if (this.clientFetch.hasValue()) {
                this.form.set(requestFormWith(this.formBuilder, this.clientFetch.value()));
                return;
            }

            this.form.set(undefined);
        });

        afterNextRender(() => {
            const script = this.renderer.createElement('script') as HTMLScriptElement;
            this.renderer.appendChild(document.body, this.captcha.setup(script));
        });

        this.title.setTitle('Marush: Space of Care - izmena klijenta');
    }

    protected readonly onSubmit = async() => {
        const form = this.form();
        if (!form) {
            return;
        }

        this.globalError.set('');
        form.markAllAsTouched();
        if (form.invalid) {
            return;
        }

        try {
            await this.captcha.executeProtectedAction('CLIENT_EDIT', (token, action) =>
                this.clients.storeChanges(form.value, this.id(), token, action));
            await this.goBack();
        } catch {
            // eslint-disable-next-line @stylistic/max-len
            this.globalError.set($localize`:@@error.local.description:Došlo je do greške prilikom slanja zahteva. Molimo Vas, osvežite stranicu i pokušajte ponovo. Administratori sistema su obavešteni o problemu.`);
        }
    };

    protected readonly goBack = async() => {
        await this.router.navigate(['/admin/klijenti']);
    };

    protected get appointments(): FormArray<FormGroup> {
        return this.form()?.get('appointments') as FormArray<FormGroup>;
    }

    protected get phones(): FormArray<FormControl> {
        return this.form()?.get('phones') as FormArray<FormControl>;
    }

    protected get emails(): FormArray<FormControl> {
        return this.form()?.get('emails') as FormArray<FormControl>;
    }

    protected readonly addEmail = (): void => {
        this.emails.push(createEmailControl(this.formBuilder, ''));
    };

    protected readonly addPhone = (): void => {
        this.phones.push(createPhoneControl(this.formBuilder, ''));
    };

    protected readonly addAppointment = (): void => {
        this.appointments.push(createAppointmentGroup(this.formBuilder, new Appointment()));
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
