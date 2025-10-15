import { Component, HostBinding, ChangeDetectionStrategy, input } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-simple-page',
  templateUrl: './simple-page.html',
  styleUrl: './simple-page.scss'
})
export class SimplePage {
  @HostBinding('class') classAttribute: string = 'resolution-page aligned-centrally stretch-equally';
  readonly text = input.required<string>();

  protected readonly decorationUrl = `${environment.staticContentUrl}images/mail/decoration.png`;
}
