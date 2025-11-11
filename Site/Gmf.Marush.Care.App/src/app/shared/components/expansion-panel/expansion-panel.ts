import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, output, viewChild
} from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-expansion-panel',
  imports: [CommonModule],
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.scss',
  host: { class: 'row' }
})
export class ExpansionPanel {
  readonly panel = viewChild<ElementRef>('panel');
  readonly panelHeaderClass = input<string>('');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly index = input<number>(-1);
  readonly title = input.required<string>();

  readonly collapsedEvent = output<number>();
  readonly collapsed = model<boolean>(false);

  constructor() {
    effect(() => {
      if (this.collapsed()) {
        this.panel()?.nativeElement.scrollIntoView({ block: 'center' });
      }
    });
  }

  protected readonly toggle = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.collapsed.set(!this.collapsed());
      this.collapsedEvent.emit(this.index());
    }
  };
}
