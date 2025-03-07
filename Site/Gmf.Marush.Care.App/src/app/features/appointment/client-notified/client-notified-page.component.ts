import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SimplePageComponent } from '@shared/components/page/simple-page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-client-notified-page',
  imports: [SimplePageComponent],
  templateUrl: './client-notified-page.component.html',
  styleUrl: './client-notified-page.component.scss'
})
export class ClientNotifiedPageComponent {
}
