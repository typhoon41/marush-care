
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import marushDetails from '@shared/models/marush-details.model';
import { SelectedService } from '@shared/models/services/treatments/types.model';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { ServicesPageMetadata } from './page-metadata.model';
import { TreatmentSelectorComponent } from './treatment-selector/treatment-selector.component';
import { TypeSelectorComponent } from './type-selector/type-selector.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-services-page',
  imports: [CommonModule, TypeSelectorComponent, TreatmentSelectorComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent extends BasePageComponent {
  @HostBinding('class') classAttribute: string = 'row center-content vertical-stack';
  selectedService: SelectedService = '';
  marushDetails = marushDetails;

  constructor(protected override readonly metadataService: PageMetadataService) {
    super(metadataService, new ServicesPageMetadata());
  }
}
