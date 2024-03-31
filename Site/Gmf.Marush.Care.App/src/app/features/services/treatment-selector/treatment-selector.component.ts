import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import marushDetails from '@shared/models/marush-details.model';
import { SelectedService } from '../models/types.model';

@Component({
  selector: 'marush-services-treatment-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treatment-selector.component.html',
  styleUrl: './treatment-selector.component.scss'
})
export class TreatmentSelectorComponent {
  @Input() selectedService: SelectedService = '';

  marushDetails = marushDetails;
}
