/* eslint-disable @stylistic/max-len */
import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import marushDetails from '@shared/models/marush-details.model';
import { RouteTranslatorPipe } from '@shared/pipes/routing-translator-pipe';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { ContactPageMetadata } from './page-metadata.model';

@Component({
  selector: 'marush-contact-page',
  imports: [RouterModule, RouteTranslatorPipe],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss'
})
export class ContactPageComponent extends BasePageComponent {
  @HostBinding('class') classAttribute: string = 'contact-container row';

  marushDetails = marushDetails;

  constructor(protected override readonly metadataService: PageMetadataService) {
    super(metadataService, new ContactPageMetadata());
  }
}
