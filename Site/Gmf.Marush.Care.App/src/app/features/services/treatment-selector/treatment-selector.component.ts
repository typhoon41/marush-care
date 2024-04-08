import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import marushDetails from '@shared/models/marush-details.model';
import supportedTreatments from '../models/supported-treatments.model';
import { SelectedService } from '../models/types.model';

@Component({
  selector: 'marush-services-treatment-selector',
  standalone: true,
  imports: [CommonModule, ExpansionPanelComponent],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent implements OnChanges {
  @Input() selectedService: SelectedService = '';
  marushDetails = marushDetails;
  treatments: [string, string][] = [];

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnChanges(changes: SimpleChanges) {
    const selectedServiceChanges = changes['selectedService'];

    if (selectedServiceChanges) {
      this.handleSelectedService(selectedServiceChanges.currentValue);
    }
  }

  private readonly handleSelectedService = (selectedService: SelectedService) => {
    if (selectedService === '') {
      this.treatments = [];
      return;
    }

    this.treatments = Object.entries(supportedTreatments[selectedService]);
    document.getElementById('treatments-section')?.scrollIntoView();
  };
}
