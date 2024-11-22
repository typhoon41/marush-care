/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import marushDetails from '@shared/models/marush-details.model';
import { IDefineTreatment } from '@shared/models/services/types.model';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ServicesSelectorComponent } from './services-selector/services-selector.component';
import { AppointmentSummaryComponent } from './summary/summary.component';

@Component({
  selector: 'marush-appointment-page',
  standalone: true,
  imports: [ReactiveFormsModule, CustomerDetailsComponent, AppointmentSummaryComponent, ServicesSelectorComponent],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.scss'
})
export class AppointmentPageComponent {
  @HostBinding('class') classAttribute: string = 'row appointment-container';
  marushDetails = marushDetails;
  form: FormGroup;
  defaultFieldLength = 100;
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;

  constructor(private readonly meta: Meta, private readonly title: Title, private readonly formBuilder: NonNullableFormBuilder) {
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
  }

  get checkedServices() {
    return this.form?.get('checkedServices') as FormArray<FormControl<IDefineTreatment>>;
  }

  get totalCost() {
    return this.checkedServices?.value.reduce((sum, { price }) => sum + price, 0) ?? 0;
  }

  private readonly getDuration = () => this.checkedServices?.value.reduce((total, { duration }) => total + duration, 0) ?? 0;

  readonly onToggleSelection = (item: IDefineTreatment, checked: boolean) => {
    if (checked) {
      this.checkedServices.push(this.formBuilder.control(item));
      return;
    }

    const index = this.checkedServices.controls.findIndex(control => control.value.title === item.title);
    this.checkedServices.removeAt(index);
  };

  readonly onRemoveSelection = (item: IDefineTreatment) => this.onToggleSelection(item, false);

  readonly onSubmit = () => {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.form.get('sum')?.setValue(this.totalCost);
    this.form.get('time')?.setValue(`${this.form.get('timeGroup.time')?.value}:00`);
    this.form.get('duration')?.setValue(this.getDuration());
    this.form.get('treatments')?.setValue(this.checkedServices?.value.map(({ title }) => title));
    this.form.get('serbianTreatments')?.setValue(this.checkedServices?.value.map(({ name }) => name));

    // eslint-disable-next-line no-alert
    alert(JSON.stringify(this.form.value, null, '\t'));
  };
}
