/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
  @HostBinding('class') classAttribute: string = 'row';

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,anticelulit masaža,zakazivanje,slobodan termin,centar,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje`);
  }
}
