/* eslint-disable @stylistic/max-len */
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'marush-appointment-page',
  standalone: true,
  imports: [],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.scss'
})
export class AppointmentPageComponent {
  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,anticelulit masaža,zakazivanje,slobodan termin,centar,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje`);
  }
}
