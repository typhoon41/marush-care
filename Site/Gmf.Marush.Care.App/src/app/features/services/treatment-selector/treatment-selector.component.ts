import { CommonModule, isPlatformBrowser } from '@angular/common';
// eslint-disable-next-line @stylistic/max-len
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments.model';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { SelectedService } from '@shared/models/services/treatments/types.model';
import { RouteTranslatorPipe } from '@shared/pipes/routing-translator-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-services-treatment-selector',
  imports: [CommonModule, RouterModule, ExpansionPanelComponent],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent implements OnChanges, AfterViewChecked {
  @Input({ required: true }) selectedService: SelectedService = '';
  @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;
  @ViewChild('treatmentsContainer') treatmentsContainer: ElementRef | undefined;
  treatments: TreatmentDefinition[] = [];
  selectedServiceChanging = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object, private readonly router: Router,
    private readonly routeTranslatorPipe: RouteTranslatorPipe) { }

  ngOnChanges(changes: SimpleChanges) {
    const selectedServiceChanges = changes['selectedService'];

    if (selectedServiceChanges) {
      this.selectedServiceChanging = true;
      this.handleSelectedService(selectedServiceChanges.currentValue);
    }
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && this.selectedServiceChanging) {
      this.treatmentsContainer?.nativeElement.scrollIntoView({ block: 'start' });
      this.selectedServiceChanging = false;
    }
  }

  readonly collapseOpenedPanel = (indexToSkip: number) => {
    this.panels?.filter(panel => panel.index !== indexToSkip && panel.collapsed).forEach(panel => {
      panel.collapsed.set(false);
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

  readonly redirectToAppointment = async() => {
    await this.router.navigate([this.routeTranslatorPipe.transform('appointment')]);
  };
}
