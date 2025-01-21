import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '@env';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments.model';
import { SelectedService } from '@shared/models/services/treatments/types.model';

@Component({
  selector: 'marush-services-type-selector',
  imports: [CommonModule],
  templateUrl: './type-selector.component.html',
  styleUrl: './type-selector.component.scss'
})
export class TypeSelectorComponent {
  services = supportedTreatments;
  readonly servicesImageFor = (imageName: string) => `${environment.staticContentUrl}images/services/${imageName}.jpg`;
  @Input({ required: true }) selectedService: SelectedService = '';
  @Output() selectedServiceChange = new EventEmitter<SelectedService>();

  readonly selectService = (service: SelectedService, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.setSelectedService(service);
    }
  };

  private readonly setSelectedService = (service: SelectedService) => {
    if (this.selectedService === service) {
      this.selectedService = '';
    }

    else {
      this.selectedService = service;
    }

    this.selectedServiceChange.emit(this.selectedService);
  };
}
