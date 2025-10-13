import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, Inject, input, PLATFORM_ID, viewChild, viewChildren } from '@angular/core';
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
export class TreatmentSelectorComponent {
  readonly selectedService = input.required<SelectedService>();
  readonly panels = viewChildren<ExpansionPanelComponent>('panels');
  readonly treatmentsContainer = viewChild<ElementRef>('treatmentsContainer');

  treatments: TreatmentDefinition[] = [];

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslatorPipe) {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.handleSelectedService(this.selectedService());
        this.treatmentsContainer()?.nativeElement?.scrollIntoView({ block: 'start' });
      }
    });
  }

  readonly redirectToAppointment = async() => {
    await this.router.navigate([this.routeTranslatorPipe.transform('appointment')]);
  };

  readonly collapseOpenedPanel = (indexToSkip: number) => {
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
