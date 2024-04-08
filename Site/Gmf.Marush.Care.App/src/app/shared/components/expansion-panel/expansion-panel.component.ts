import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

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
  collapsed = false;

  readonly toggle = (event: KeyboardEvent | null = null) => {
    if (!event || event.key === 'Enter' || event.key === ' ') {
      this.collapsed = !this.collapsed;
    }
  };
}
