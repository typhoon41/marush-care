
/* eslint-disable @stylistic/max-len, max-params */
import { afterNextRender, ChangeDetectionStrategy, Component, computed, HostBinding, Renderer2, Signal, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from '@features/appointment/appointment';
import { BasePage } from '@shared/components/page/base/base-page';
import marushDetails from '@shared/models/marush-details';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { RouteTranslator } from '@shared/pipes/routing-translator';
import { Captcha } from '@shared/services/captcha';
import { Stapler } from '@shared/services/metadata/stapler';
import { CustomerDetailsComponent } from './customer-details/customer-details';
import { AppointmentPageMetadata } from './page-metadata';
import { requestFormWith } from './request';
import { RequestUser } from './request-sent/user';
import { ServicesSelector } from './services-selector/services-selector';
import { AppointmentSummaryComponent } from './summary/summary';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-appointment-page',
  imports: [ReactiveFormsModule, CustomerDetailsComponent, AppointmentSummaryComponent, ServicesSelector],
  templateUrl: './appointment-page.html',
  styleUrl: './appointment-page.scss'
})
export class AppointmentPage extends BasePage {
  @HostBinding('class') classAttribute: string = 'row appointment-container';
  marushDetails = marushDetails;
  form: FormGroup;
  readonly globalError = signal('');
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;
  readonly checkedServices: WritableSignal<FormArray<FormControl<TreatmentDefinition>>>;
  readonly totalCost: Signal<number>;

  constructor(protected override readonly metadataService: Stapler, private readonly router: Router,
    private readonly routeTranslatorPipe: RouteTranslator,
    private readonly captchaService: Captcha,
    private readonly renderer: Renderer2,
    private readonly appointment: Appointment, private readonly formBuilder: NonNullableFormBuilder) {
    super(metadataService, new AppointmentPageMetadata());
    this.form = requestFormWith(this.formBuilder);

    this.checkedServices = signal(this.form.get('checkedServices') as FormArray<FormControl<TreatmentDefinition>>);
    this.totalCost = computed(() => this.checkedServices().value.reduce((sum, { price }) => sum + price, 0));

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captchaService.setup(script));
    });
  }

  protected readonly onRemoveSelection = (item: TreatmentDefinition) => this.onToggleSelection(item, false);
  private readonly getDuration = () => this.checkedServices().value.reduce((total, { duration }) => total + duration, 0) ?? 0;
  protected readonly onToggleSelection = (item: TreatmentDefinition, checked: boolean) => {
    if (checked) {
      this.checkedServices.update(items => {
        items.push(this.formBuilder.control(item));
        return new FormArray(items.controls);
      });
      return;
    }

    const index = this.checkedServices().controls.findIndex(control => control.value.titleWithDuration() === item.titleWithDuration());
    this.checkedServices.update(items => {
      items.removeAt(index);
      return new FormArray(items.controls);
    });
  };

  protected readonly onSubmit = async() => {
    this.globalError.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.form.get('sum')?.setValue(this.totalCost());
    this.form.get('time')?.setValue(`${this.form.get('timeGroup.time')?.value}:00`);
    this.form.get('duration')?.setValue(this.getDuration());
    this.form.get('treatments')?.setValue(this.checkedServices().value.map((service: TreatmentDefinition) => service.titleWithDuration()));
    this.form.get('serbianTreatments')?.setValue(this.checkedServices().value.map(({ name }) => name));

    try {
      await this.captchaService.executeProtectedAction('APPOINTMENT', (token, action) => this.appointment.makeRequest(this.form.value, token, action));
      await this.router.navigate([this.routeTranslatorPipe.transform('request-sent')], { state: RequestUser.from(this.form) });
    } catch {
      this.globalError.set($localize`:@@error.local.description:Došlo je do greške prilikom slanja zahteva. Molimo Vas, osvežite stranicu i pokušajte ponovo. Administratori sistema su obavešteni o problemu.`);
    }
  };
}
