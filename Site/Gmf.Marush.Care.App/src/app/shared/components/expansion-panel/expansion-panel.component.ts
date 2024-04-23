import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
  selector: 'marush-expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent {
  @HostBinding('class') classAttribute: string = 'row';
  @Input() title: string = '';
  @Input() index: number = -1;
  @Output() collapsedEvent = new EventEmitter<number>();
  collapsed = false;

  readonly toggle = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.collapsed = !this.collapsed;
      this.collapsedEvent.emit(this.index);
    }
  };
}
