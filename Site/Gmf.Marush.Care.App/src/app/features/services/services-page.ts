
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasePage } from '@shared/components/page/base/base-page';
import marushDetails from '@shared/models/marush-details';
import { SelectedService } from '@shared/models/services/treatments/types';
import { ServicesPageMetadata } from './page-metadata.model';
import { TreatmentSelector } from './treatment-selector/treatment-selector';
import { TypeSelector } from './type-selector/type-selector';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-services-page',
  imports: [CommonModule, TypeSelector, TreatmentSelector],
  templateUrl: './services-page.html',
  styleUrl: './services-page.scss',
  host: { class: 'row center-content vertical-stack' }
})
export class ServicesPage extends BasePage {
  protected readonly selectedService = signal<SelectedService>('');
  protected readonly marushDetails = marushDetails;

  constructor() {
    super(new ServicesPageMetadata());
  }
}
