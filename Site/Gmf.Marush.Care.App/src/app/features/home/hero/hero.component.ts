import { Component } from '@angular/core';
import marushDetails from '@shared/models/marush-details.model';

@Component({
    selector: 'marush-home-hero',
    standalone: true,
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
  })
  export class HomeHeroComponent {
    marushDetails = marushDetails;
  }
