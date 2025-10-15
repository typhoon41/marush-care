import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-instagram',
  templateUrl: './instagram.html',
  styleUrl: './instagram.scss'
})
export class HomeInstagram {
  protected readonly follow = () => {
    window.open('https://www.instagram.com/marush_care_space');
  };

  protected readonly instagramImageUrl = (index: number) =>
    `${environment.staticContentUrl}images/instagram/post${index}.jpg`;
}
