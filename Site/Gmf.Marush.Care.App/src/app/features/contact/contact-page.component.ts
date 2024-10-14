/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';
import marushDetails from '@shared/models/marush-details.model';

@Component({
  selector: 'marush-contact-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss'
})
export class ContactPageComponent extends BaseRoutingComponent {
  @HostBinding('class') classAttribute: string = 'contact-container row';

  marushDetails = marushDetails;

  constructor(private readonly meta: Meta, private readonly title: Title) {
    super();
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.contact.description:Otkrijte oličenje lepote i opuštanja u Marush salonu. Smešten u srcu Beograda, naš salon nudi miran beg od užurbanog gradskog života.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.contact.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,kombinacije tretmana,lifting,anticelulit masaža,kontakt,centar,Beograd,Višegradska` });
    this.title.setTitle($localize`:@@routes.contact.title:Marush: Space of Care - kontakt`);
  }
}
