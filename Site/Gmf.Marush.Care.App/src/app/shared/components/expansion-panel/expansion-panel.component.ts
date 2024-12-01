import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, HostBinding, Inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
  selector: 'marush-expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent implements AfterViewChecked {
  @HostBinding('class') classAttribute: string = 'row';
  @ViewChild('panel') panel!: ElementRef;
  @Input() panelHeaderClass: string = '';
  @Input() title: string = '';
  @Input() index: number = -1;
  @Output() collapsedEvent = new EventEmitter<number>();
  @Input() collapsed = false;
  private toggled = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId) && this.collapsed && this.toggled) {
      this.panel?.nativeElement.scrollIntoView({ block: 'center' });
      this.toggled = false;
    }
  }

  readonly toggle = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.collapsed = !this.collapsed;
      this.collapsedEvent.emit(this.index);
      this.toggled = true;
    }
  };
}
