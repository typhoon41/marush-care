/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import marushDetails from '@shared/models/marush-details.model';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ProFormaInvoiceComponent } from './pro-forma-invoice/pro-forma-invoice.component';
import { ServicesSelectorComponent } from './services-selector/services-selector.component';

@Component({
  selector: 'marush-appointment-page',
  standalone: true,
  imports: [CustomerDetailsComponent, ProFormaInvoiceComponent, ServicesSelectorComponent],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.scss'
})
export class AppointmentPageComponent {
  @HostBinding('class') classAttribute: string = 'row center-content vertical-stack appointment-container';
  marushDetails = marushDetails;
  disclaimer = `* ${$localize`:@@appointment.disclaimer:U slučaju otkazivanja, molimo Vas da nas na vreme (najkasnije 24h pre zakazanog termina) obavestite porukom ili pozivom na broj`} `;

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,anticelulit masaža,zakazivanje,slobodan termin,centar,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje`);
  }
}
