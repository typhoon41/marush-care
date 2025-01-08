import { Component, HostBinding, Input } from '@angular/core';
import { environment } from '@env';

@Component({
    selector: 'marush-simple-page',
    templateUrl: './simple-page.component.html',
    styleUrl: './simple-page.component.scss'
  })
  export class SimplePageComponent {
    @HostBinding('class') classAttribute: string = 'resolution-page aligned-centrally stretch-equally';

    @Input({ required: true }) text: string = '';
    decorationUrl = `${environment.staticContentUrl}images/mail/decoration.png`;
  }
