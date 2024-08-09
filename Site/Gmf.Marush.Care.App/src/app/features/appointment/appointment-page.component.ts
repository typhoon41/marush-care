/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;

  constructor(private readonly meta: Meta, private readonly title: Title, private readonly formBuilder: NonNullableFormBuilder) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,anticelulit masaža,zakazivanje,slobodan termin,centar,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje`);
    this.form = this.formBuilder.group({
      checkedServices: this.formBuilder.array<IDefineTreatment>([])
    });
  }

  get checkedServices() {
    return this.form.get('checkedServices') as FormArray<FormControl<IDefineTreatment>>;
  }

  readonly onToggleSelection = (item: IDefineTreatment, checked: boolean) => {
    if (checked) {
      this.checkedServices.push(this.formBuilder.control(item));
      return;
    }

    const index = this.checkedServices.controls.findIndex(control => control.value.title === item.title);
    this.checkedServices.removeAt(index);
  };

  readonly onRemoveSelection = (item: IDefineTreatment) => this.onToggleSelection(item, false);
}
