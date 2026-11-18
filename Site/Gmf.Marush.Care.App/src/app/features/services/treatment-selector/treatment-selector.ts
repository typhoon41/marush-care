import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, effect, ElementRef,
  inject, Injector, input, runInInjectionContext, signal, viewChild, viewChildren } from '@angular/core';
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
  protected readonly treatments = signal<TreatmentDefinition[]>([]);
  private readonly panels = viewChildren<ExpansionPanel>('panels');
  private readonly treatmentsContainer = viewChild<ElementRef>('treatmentsContainer');
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly routeTranslator = inject(RouteTranslator);

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          this.handleSelectedService(this.selectedService());
          this.treatmentsContainer()?.nativeElement?.scrollIntoView({ block: 'start' });
        });
      });
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
    this.treatments.set(supportedTreatments.find(treatment => treatment.key === selectedService)?.treatments
      ?.filter(treatment => !treatment.clone) ?? []);
  };
}
