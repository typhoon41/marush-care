import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, model, Output } from '@angular/core';
import { environment } from '@env';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments.model';
import { SelectedService } from '@shared/models/services/treatments/types.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-services-type-selector',
  imports: [CommonModule],
  templateUrl: './type-selector.component.html',
  styleUrl: './type-selector.component.scss'
})
export class TypeSelectorComponent {
  services = supportedTreatments;
  readonly servicesImageFor = (imageName: string) => `${environment.staticContentUrl}images/services/${imageName}.jpg`;
  readonly selectedService = model.required<SelectedService>();
  @Output() readonly selectedServiceChange = new EventEmitter<SelectedService>();

  readonly selectService = (service: SelectedService, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.setSelectedService(service);
    }
  };

  private readonly setSelectedService = (service: SelectedService) => {
    if (this.selectedService() === service) {
      this.selectedService.set('');
    }

    else {
      this.selectedService.set(service);
    }

    this.selectedServiceChange.emit(this.selectedService());
  };
}
