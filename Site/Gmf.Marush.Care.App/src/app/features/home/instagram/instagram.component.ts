import { Component } from '@angular/core';
import { environment } from '@env';

@Component({
    selector: 'marush-home-instagram',
    standalone: true,
    templateUrl: './instagram.component.html',
    styleUrl: './instagram.component.scss'
  })
  export class HomeInstagramComponent {
    readonly follow = () => {
      window.open('https://www.instagram.com/marush_care_space');
    };

    readonly instagramImageUrl = (index: number) => `${environment.staticContentUrl}images/instagram/post${index}.jpg`;
  }
