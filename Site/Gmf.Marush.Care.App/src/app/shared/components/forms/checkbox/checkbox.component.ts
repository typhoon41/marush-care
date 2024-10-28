import { Component, Input } from '@angular/core';

@Component({
    selector: 'marush-checkbox',
    standalone: true,
    imports: [],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss'
  })
  export class CheckBoxComponent {
    @Input() labelText = '';
    @Input() checked = false;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    @Input() onChange = (_$event: Event) => {};

    readonly onCheckedChange = ($event: Event) => {
      this.onChange($event);
    };
  }