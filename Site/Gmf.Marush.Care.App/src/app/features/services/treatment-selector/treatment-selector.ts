import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, Inject, input, PLATFORM_ID, viewChild, viewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExpansionPanel } from '@shared/components/expansion-panel/expansion-panel';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { SelectedService } from '@shared/models/services/treatments/types';
import { RouteTranslator } from '@shared/pipes/routing-translator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-services-treatment-selector',
  imports: [CommonModule, RouterModule, ExpansionPanel],
  templateUrl: './treatment-selector.html',
  styleUrl: './treatment-selector.scss'
})
export class TreatmentSelector {
  readonly selectedService = input.required<SelectedService>();
  readonly panels = viewChildren<ExpansionPanel>('panels');
  readonly treatmentsContainer = viewChild<ElementRef>('treatmentsContainer');

  protected treatments: TreatmentDefinition[] = [];

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly router: Router, private readonly routeTranslator: RouteTranslator) {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.handleSelectedService(this.selectedService());
        this.treatmentsContainer()?.nativeElement?.scrollIntoView({ block: 'start' });
      }
    });
  }

  protected readonly redirectToAppointment = async() => {
    await this.router.navigate([this.routeTranslator.transform('appointment')]);
  };

  protected readonly collapseOpenedPanel = (indexToSkip: number) => {
    this.panels().filter(panel => panel.index() !== indexToSkip && panel.collapsed)
      .forEach(panel => {
        panel.collapsed.set(false);
      });
  };

  private readonly handleSelectedService = (selectedService: SelectedService) => {
    this.treatments = supportedTreatments.find(treatment => treatment.key === selectedService)?.treatments
      ?.filter(treatment => !treatment.clone) ?? [];
  };
}
