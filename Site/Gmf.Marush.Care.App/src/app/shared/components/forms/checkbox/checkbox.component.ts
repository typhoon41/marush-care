import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckBoxComponent {
  @Input({ required: true }) labelText = '';
  @Input() checked = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() onChange = (_$event: Event) => { };

  readonly onCheckedChange = ($event: Event) => {
    this.onChange($event);
  };
}
