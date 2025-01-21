/* eslint-disable @stylistic/max-len */
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import marushDetails from '@shared/models/marush-details.model';
import { SelectedService } from '@shared/models/services/treatments/types.model';
import { TreatmentSelectorComponent } from './treatment-selector/treatment-selector.component';
import { TypeSelectorComponent } from './type-selector/type-selector.component';

@Component({
  selector: 'marush-services-page',
  imports: [CommonModule, TypeSelectorComponent, TreatmentSelectorComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {
  @HostBinding('class') classAttribute: string = 'row center-content vertical-stack';
  selectedService: SelectedService = '';
  marushDetails = marushDetails;

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.services.description:Kozmetički salon Marush nudi usluge tretmana lica, sređivanja obrva i trepavica, kao i kombinacije tretmana. Pregled kože lica i konsultacije su besplatni.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.services.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,higijensko čišćenje lica,mezoterapija,dermapen,hijaluron pen,radiotalasni piling,Beograd,Višegradska` });
    this.title.setTitle($localize`:@@routes.services.title:Marush: Space of Care - usluge`);
  }
}
