import { Component } from '@angular/core';
import { environment } from '@env';

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

    readonly downloadPriceList = () => {
      const fileName = $localize`:@@pricelist:cenovnik`;
      window.open(`${environment.staticContentUrl}${fileName}.pdf`);
    };
  }

