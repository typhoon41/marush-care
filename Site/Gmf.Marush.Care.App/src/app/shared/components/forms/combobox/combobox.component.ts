import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  Input, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { isAction } from '@shared/functions/keyboard-event';

@Component({
  selector: 'marush-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss'
})
export class ComboBoxComponent {
  @Input() items: string[] = [];
  @Input() id: string = 'combo-box';
  selectedItem: string | undefined;
  collapsed = false;

  @ViewChild('combo') combo: ElementRef | undefined;
  @ViewChildren('option') options: QueryList<ElementRef<HTMLLIElement>> | undefined;

  constructor(private readonly cdr: ChangeDetectorRef) { }

  readonly containerId = () => `${this.id}-container`;
  readonly buttonId = () => `${this.id}-button`;
  readonly select = (item: string) => {
    this.selectedItem = item;
    this.hideDropdown();
  };

  readonly toggleDropdown = () => {
    const shouldCollapse = !this.collapsed;
    if (shouldCollapse) {
      this.collapsed = shouldCollapse;
      this.cdr.detectChanges();
      this.giveFocusTo(this.getSelectedOption());
      return;
    }

    this.hideDropdown();
  };

  readonly hideDropdown = () => {
    this.collapsed = false;
    this.giveFocusTo(this.combo);
  };

  readonly onBlur = (event: FocusEvent) => {
    const newTarget = event.relatedTarget as HTMLElement;
    const newTargetParent = newTarget?.parentElement;

    if (newTargetParent?.id !== this.containerId() && newTargetParent?.parentElement?.id !== this.containerId()
      && newTarget?.id !== this.id && newTarget?.id !== this.buttonId() && newTarget?.id !== this.containerId()) {
      this.hideDropdown();
    }
  };

  readonly onKey = (event: KeyboardEvent) => {
    if (this.mainActionTriggeredBy(event)) {
      event.preventDefault();
      this.toggleDropdown();
    } else if (this.cancelActionTriggeredBy(event)) {
      this.hideDropdown();
    }
  };

  readonly onOptionsKey = (event: KeyboardEvent) => {
    if (this.cancelActionTriggeredBy(event)) {
      this.hideDropdown();
    }
  };

  readonly onOptionKey = (item: string, event: KeyboardEvent, index: number) => {
    event.preventDefault();
    if (this.mainActionTriggeredBy(event)) {
      event.stopImmediatePropagation();
      this.select(item);
    } else if (event.key === 'ArrowUp') {
      this.giveFocusTo(this.previousElementFrom(index));
    } else if (event.key === 'ArrowDown') {
      this.giveFocusTo(this.nextElementFrom(index));
    }
  };

  private readonly mainActionTriggeredBy = (event: KeyboardEvent) => isAction(event);
  private readonly cancelActionTriggeredBy = (event: KeyboardEvent) => event.key === 'Escape';
  private readonly previousElementFrom = (index: number) => this.options?.get((index - 1 + this.options.length) % this.options.length);
  private readonly nextElementFrom = (index: number) => this.options?.get((index + 1) % this.options.length);
  private readonly getSelectedOption = () => this.options?.filter(option =>
    option.nativeElement.lastChild?.textContent === this.selectedItem)[0] ?? this.options?.get(0);

  private readonly giveFocusTo = (element: ElementRef | undefined) => (element?.nativeElement as HTMLElement)?.focus();
}