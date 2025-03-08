import { Component, HostBinding, ChangeDetectionStrategy, input } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-simple-page',
  templateUrl: './simple-page.component.html',
  styleUrl: './simple-page.component.scss'
})
export class SimplePageComponent {
  @HostBinding('class') classAttribute: string = 'resolution-page aligned-centrally stretch-equally';
  readonly text = input.required<string>();

  decorationUrl = `${environment.staticContentUrl}images/mail/decoration.png`;
}
