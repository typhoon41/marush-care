import { Component } from '@angular/core';

@Component({
    selector: 'app-home-instagram',
    standalone: true,
    templateUrl: './instagram.component.html',
    styleUrl: './instagram.component.scss'
  })
  export class HomeInstagramComponent {
    readonly follow = () => {
      window.open('https://www.instagram.com/marush_care_space');
    };
  }
