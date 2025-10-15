import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-space',
  templateUrl: './space.html',
  styleUrl: './space.scss'
})
export class HomeSpace {
  protected readonly spaceImageUrl = (position: string) =>
    `${environment.staticContentUrl}images/home/space-${position}.png`;
}

