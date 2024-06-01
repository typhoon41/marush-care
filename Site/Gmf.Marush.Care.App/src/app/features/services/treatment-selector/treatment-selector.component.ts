import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';
import supportedTreatments from '../models/supported-treatments.model';
import { IDefineTreatment, SelectedService } from '../models/types.model';

@Component({
  selector: 'marush-services-treatment-selector',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpansionPanelComponent],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent extends BaseRoutingComponent implements OnChanges {
  @Input() selectedService: SelectedService = '';
  @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;
  treatments: IDefineTreatment[] = [];

  constructor(private readonly router: Router) {
    super();
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnChanges(changes: SimpleChanges) {
    const selectedServiceChanges = changes['selectedService'];

    if (selectedServiceChanges) {
      this.handleSelectedService(selectedServiceChanges.currentValue);
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

    this.treatments = supportedTreatments[selectedService];
    document.getElementById('schedule-action')?.scrollIntoView({ block: 'end' });
  };

  readonly redirectToAppointment = () => {
    this.router.navigate([this.translateRoute('appointment')]);
  };

  readonly format = (treatment: IDefineTreatment) =>
    `${treatment.description}${treatment.description ? '<br><br>' : ''}` +
    `${$localize`:@@services.treatments.price:Cena osnovne usluge: ${treatment.price}`}`;
}
