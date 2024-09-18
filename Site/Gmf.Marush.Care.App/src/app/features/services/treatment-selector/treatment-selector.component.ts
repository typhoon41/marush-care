import { CommonModule, isPlatformBrowser } from '@angular/common';
// eslint-disable-next-line @stylistic/max-len
import { AfterViewChecked, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import marushDetails from '@shared/models/marush-details.model';
import supportedTreatments from '../models/supported-treatments.model';
import { IDefineTreatment, SelectedService } from '../models/types.model';

@Component({
  selector: 'marush-services-treatment-selector',
  standalone: true,
  imports: [CommonModule, ExpansionPanelComponent],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent implements OnChanges, AfterViewChecked {
  @Input() selectedService: SelectedService = '';
  @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;
  @ViewChild('treatmentsContainer') treatmentsContainer: ElementRef | undefined;
  marushDetails = marushDetails;
  treatments: IDefineTreatment[] = [];
  selectedServiceChanging = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnChanges(changes: SimpleChanges) {
    const selectedServiceChanges = changes['selectedService'];

    if (selectedServiceChanges) {
      this.selectedServiceChanging = true;
      this.handleSelectedService(selectedServiceChanges.currentValue);
    }
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && this.selectedServiceChanging) {
      this.treatmentsContainer?.nativeElement.scrollIntoView({ block: 'start' });
      this.selectedServiceChanging = false;
    }
  }

  readonly collapseOpenedPanel = (indexToSkip: number) => {
    this.panels?.filter(panel => panel.index !== indexToSkip && panel.collapsed).forEach(panel => {
      panel.collapsed = false;
    });
  };

  private readonly handleSelectedService = (selectedService: SelectedService) => {
    if (selectedService === '') {
      this.treatments = [];
      return;
    }

    this.treatments = supportedTreatments.find(treatment => treatment.key === selectedService)?.treatments
      ?.filter(treatment => !treatment.clone) ?? [];
  };

  readonly format = (treatment: IDefineTreatment) =>
    `${treatment.description || ''}${treatment.description ? '<br><br>' : ''}` +
    `${$localize`:@@services.treatments.price:Cena osnovne usluge: ${treatment.rangedPrice ? treatment.rangedPrice : treatment.price}`}`;
}
