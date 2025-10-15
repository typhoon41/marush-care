import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss'
})
export class CheckBoxComponent {
  readonly labelText = input.required<string>();
  readonly checked = input<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  readonly onChange = input<(_$event: Event) => void>(() => { });

  protected readonly onCheckedChange = ($event: Event) => {
    this.onChange()($event);
  };
}
