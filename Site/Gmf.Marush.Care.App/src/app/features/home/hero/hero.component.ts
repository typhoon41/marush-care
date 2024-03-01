import { Component } from '@angular/core';

@Component({
    selector: 'marush-home-hero',
    standalone: true,
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
  })
  export class HomeHeroComponent {
    readonly contact = () => {
      window.open('tel:+381605229593', '_self');
    };
  }
