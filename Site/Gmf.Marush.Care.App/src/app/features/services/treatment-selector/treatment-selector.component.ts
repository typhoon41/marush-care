import { CommonModule, isPlatformBrowser } from '@angular/common';
// eslint-disable-next-line @stylistic/max-len
import { AfterViewChecked, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';
import supportedTreatments from '@shared/models/services/supported-treatments.model';
import { IDefineTreatment, SelectedService } from '@shared/models/services/types.model';

@Component({
  selector: 'marush-services-treatment-selector',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpansionPanelComponent],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent extends BaseRoutingComponent implements OnChanges, AfterViewChecked {
  @Input() selectedService: SelectedService = '';
  @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;
  @ViewChild('treatmentsContainer') treatmentsContainer: ElementRef | undefined;
  treatments: IDefineTreatment[] = [];
  selectedServiceChanging = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object, private readonly router: Router) {
    super();
  }

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

  readonly redirectToAppointment = () => {
    this.router.navigate([this.translateRoute('appointment')]);
  };

  readonly format = (treatment: IDefineTreatment) =>
    `${treatment.description || ''}${treatment.description ? '<br><br>' : ''}` +
    `${$localize`:@@services.treatments.price:Cena osnovne usluge: ${treatment.rangedPrice ? treatment.rangedPrice : treatment.price}`}`
    + '<br><br>' +
    `${$localize`:@@services.treatments.duration:Okvirno vreme trajanja usluge: ${treatment.duration}`}` +
    `${$localize`:@@minutes: minuta`}`;
}
