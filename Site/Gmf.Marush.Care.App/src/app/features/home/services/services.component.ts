import { Component } from '@angular/core';

@Component({
    selector: 'marush-home-services',
    standalone: true,
    imports: [],
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
  })
  export class HomeServicesComponent {
    readonly contact = () => {
      window.open('tel:+381605229593', '_self');
    };
  }

