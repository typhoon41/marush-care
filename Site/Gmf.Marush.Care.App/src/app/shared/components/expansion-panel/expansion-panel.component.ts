import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, EventEmitter,
  HostBinding, Inject, input, model, Output, PLATFORM_ID, viewChild } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-expansion-panel',
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent implements AfterViewChecked {
  @HostBinding('class') classAttribute: string = 'row';
  readonly panel = viewChild<ElementRef>('panel');
  readonly panelHeaderClass = input<string>('');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly index = input<number>(-1);
  readonly title = input.required<string>();

  @Output() readonly collapsedEvent = new EventEmitter<number>();

  readonly collapsed = model<boolean>(false);
  private toggled = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && this.collapsed() && this.toggled) {
      this.panel()?.nativeElement.scrollIntoView({ block: 'center' });
      this.toggled = false;
    }
  }

  readonly toggle = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.collapsed.set(!this.collapsed());
      this.collapsedEvent.emit(this.index());
      this.toggled = true;
    }
  };
}
