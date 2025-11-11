import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { environment } from '@env';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-simple-page',
  templateUrl: './simple-page.html',
  styleUrl: './simple-page.scss',
  host: {
    class: 'resolution-page aligned-centrally stretch-equally'
  }
})
export class SimplePage {
  readonly text = input.required<string>();

  protected readonly decorationUrl = `${environment.staticContentUrl}images/mail/decoration.png`;
}
