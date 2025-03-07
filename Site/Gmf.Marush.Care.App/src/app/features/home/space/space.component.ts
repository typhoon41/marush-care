import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-space',
  templateUrl: './space.component.html',
  styleUrl: './space.component.scss'
})
export class HomeSpaceComponent {
  readonly spaceImageUrl = (position: string) => `${environment.staticContentUrl}images/home/space-${position}.png`;
}

