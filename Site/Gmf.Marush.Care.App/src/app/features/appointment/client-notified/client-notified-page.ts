import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SimplePage } from '@shared/components/page/simple-page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-client-notified-page',
  imports: [SimplePage],
  templateUrl: './client-notified-page.html',
  styleUrl: './client-notified-page.scss'
})
export class ClientNotifiedPage {
}
