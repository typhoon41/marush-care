/* eslint-disable max-lines */
/* eslint-disable @stylistic/max-len, max-params */
import { afterNextRender, ChangeDetectionStrategy, Component, computed, HostBinding, Renderer2, Signal, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '@features/appointment/appointment-service';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import marushDetails from '@shared/models/marush-details.model';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { RouteTranslatorPipe } from '@shared/pipes/routing-translator-pipe';
import { CaptchaService } from '@shared/services/captcha-service';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AppointmentPageMetadata } from './page-metadata.model';
import { RequestUser } from './request-sent/request-user.model';
import { ServicesSelectorComponent } from './services-selector/services-selector.component';
import { AppointmentSummaryComponent } from './summary/summary.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-appointment-page',
  imports: [ReactiveFormsModule, CustomerDetailsComponent, AppointmentSummaryComponent, ServicesSelectorComponent],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.scss'
})
export class AppointmentPageComponent extends BasePageComponent {
  @HostBinding('class') classAttribute: string = 'row appointment-container';
  marushDetails = marushDetails;
  form: FormGroup;
  readonly defaultFieldLength = 100;
  readonly globalError = signal('');
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;
  readonly checkedServices: WritableSignal<FormArray<FormControl<TreatmentDefinition>>>;
  readonly totalCost: Signal<number>;

  constructor(protected override readonly metadataService: PageMetadataService, private readonly router: Router,
    private readonly routeTranslatorPipe: RouteTranslatorPipe,
    private readonly captchaService: CaptchaService,
    private readonly renderer: Renderer2,
    private readonly appointmentService: AppointmentService, private readonly formBuilder: NonNullableFormBuilder) {
    super(metadataService, new AppointmentPageMetadata());
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.defaultFieldLength)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(this.defaultFieldLength)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(this.defaultFieldLength), Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/(06\d{7,8})|(\+\d{10,13})/u)]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl(''),
      treatments: new FormControl([]),
      serbianTreatments: new FormControl([]),
      timeGroup: this.formBuilder.group({
        time: new FormControl('', [Validators.required])
      }),
      duration: new FormControl(0, []),
      checkedServices: this.formBuilder.array<TreatmentDefinition>([]),
      sum: new FormControl(0)
    }, { updateOn: 'blur' });

    this.checkedServices = signal(this.form.get('checkedServices') as FormArray<FormControl<TreatmentDefinition>>);
    this.totalCost = computed(() => this.checkedServices().value.reduce((sum, { price }) => sum + price, 0));

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captchaService.setup(script));
    });
  }

  readonly onRemoveSelection = (item: TreatmentDefinition) => this.onToggleSelection(item, false);
  private readonly getDuration = () => this.checkedServices().value.reduce((total, { duration }) => total + duration, 0) ?? 0;
  readonly onToggleSelection = (item: TreatmentDefinition, checked: boolean) => {
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

  readonly onSubmit = async() => {
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
      await this.captchaService.executeProtectedAction('APPOINTMENT', (token, action) => this.appointmentService.makeRequest(this.form.value, token, action));
      await this.router.navigate([this.routeTranslatorPipe.transform('request-sent')], { state: RequestUser.from(this.form) });
    } catch {
      this.globalError.set($localize`:@@error.local.description:Došlo je do greške prilikom slanja zahteva. Molimo Vas, osvežite stranicu i pokušajte ponovo. Administratori sistema su obavešteni o problemu.`);
    }
  };
}
