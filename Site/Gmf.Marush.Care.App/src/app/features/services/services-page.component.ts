/* eslint-disable @stylistic/max-len */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SelectedService } from './models/types.model';
import { TypeSelectorComponent } from './type-selector/type-selector.component';

@Component({
  selector: 'marush-services-page',
  standalone: true,
  imports: [CommonModule, TypeSelectorComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {
  selectedService: SelectedService = '';

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.services.description:Kozmetički salon Marush nudi usluge tretmana lica, sređivanja obrva i trepavica, kao i kombinacije tretmana. Pregled kože lica i konsultacije su besplatni.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.services.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,higijensko čišćenje lica,mikrodermoabrazija,mezoterapija,dermapen,hijaluron pen,vitamin C tretman,kolagen tretman,radiotalasni piling,Beograd,Vlajkovićeva` });
    this.title.setTitle($localize`:@@routes.services.title:Marush: Space of Care - usluge`);
  }
}
