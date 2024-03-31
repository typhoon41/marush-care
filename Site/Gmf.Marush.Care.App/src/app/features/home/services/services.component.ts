import { Component } from '@angular/core';
import marushDetails from '@shared/models/marush-details.model';

@Component({
    selector: 'marush-home-services',
    standalone: true,
    imports: [],
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
  })
  export class HomeServicesComponent {
    marushDetails = marushDetails;
  }

