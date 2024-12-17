/* eslint-disable max-lines */
/* eslint-disable @stylistic/max-len, max-params */
import { afterNextRender, Component, HostBinding, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';
import marushDetails from '@shared/models/marush-details.model';
import { IDefineTreatment } from '@shared/models/services/types.model';
import { AppointmentService } from '@shared/services/appointment-service';
import { CaptchaService } from '@shared/services/captcha-service';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ServicesSelectorComponent } from './services-selector/services-selector.component';
import { AppointmentSummaryComponent } from './summary/summary.component';

@Component({
  selector: 'marush-appointment-page',
  imports: [ReactiveFormsModule, CustomerDetailsComponent, AppointmentSummaryComponent, ServicesSelectorComponent],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.scss'
})
export class AppointmentPageComponent extends BaseRoutingComponent {
  @HostBinding('class') classAttribute: string = 'row appointment-container';
  marushDetails = marushDetails;
  form: FormGroup;
  defaultFieldLength = 100;
  globalError = '';
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;

  constructor(private readonly meta: Meta, private readonly title: Title, private readonly router: Router,
    private readonly captchaService: CaptchaService,
    private readonly renderer: Renderer2,
    private readonly appointmentService: AppointmentService, private readonly formBuilder: NonNullableFormBuilder) {
    super();
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,anticelulit masaža,zakazivanje,slobodan termin,centar,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje`);
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
      checkedServices: this.formBuilder.array<IDefineTreatment>([]),
      sum: new FormControl(0)
    }, { updateOn: 'blur' });

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captchaService.setup(script));
    });
  }

  get checkedServices() {
    return this.form?.get('checkedServices') as FormArray<FormControl<IDefineTreatment>>;
  }

  get totalCost() {
    return this.checkedServices?.value.reduce((sum, { price }) => sum + price, 0) ?? 0;
  }

  readonly onRemoveSelection = (item: IDefineTreatment) => this.onToggleSelection(item, false);
  private readonly getDuration = () => this.checkedServices?.value.reduce((total, { duration }) => total + duration, 0) ?? 0;
  readonly onToggleSelection = (item: IDefineTreatment, checked: boolean) => {
    if (checked) {
      this.checkedServices.push(this.formBuilder.control(item));
      return;
    }

    const index = this.checkedServices.controls.findIndex(control => control.value.title === item.title);
    this.checkedServices.removeAt(index);
  };

  readonly onSubmit = async() => {
    this.globalError = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.form.get('sum')?.setValue(this.totalCost);
    this.form.get('time')?.setValue(`${this.form.get('timeGroup.time')?.value}:00`);
    this.form.get('duration')?.setValue(this.getDuration());
    this.form.get('treatments')?.setValue(this.checkedServices?.value.map(({ title }) => title));
    this.form.get('serbianTreatments')?.setValue(this.checkedServices?.value.map(({ name }) => name));

    try {
      await this.captchaService.executeProtectedAction('APPOINTMENT', (token, action) => this.appointmentService.makeRequest(this.form.value, token, action));
      await this.router.navigate([this.translateRoute('request-sent')]);
    } catch (error) {
      this.globalError = $localize`:@@error.local.description:Došlo je do greške prilikom slanja zahteva. Molimo Vas, osvežite stranicu i pokušajte ponovo. Administratori sistema su obavešteni o problemu.`;
    }
  };
}
