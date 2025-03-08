/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, input, model, viewChild, viewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isAction } from '@shared/functions/keyboard-event';
import { IComboBoxItem } from './combobox.model';

@Component({
  selector: 'marush-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss'
})
export class ComboBoxComponent {
  readonly formGroup = input<FormGroup>(new FormGroup({}));
  readonly items = input.required<IComboBoxItem[]>();
  readonly selectedItem = model<IComboBoxItem | undefined>();
  readonly name = input<string>('combo-box');
  readonly id = input<string>('combo-box');
  readonly placeholder = input<string>('');
  readonly autoComplete = input<boolean>(false);
  readonly combo = viewChild<ElementRef>('combo');
  readonly options = viewChildren<ElementRef<HTMLLIElement>>('option');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  readonly onValueChanged = input<(item: IComboBoxItem) => void>(() => { });
  collapsed = false;

  constructor(private readonly cdr: ChangeDetectorRef) { }

  readonly containerId = () => `${this.id}-container`;
  readonly buttonId = () => `${this.id}-button`;
  get invalid() {
    const control = this.formGroup().get(this.name());
    return control?.invalid && (control?.touched || control?.dirty);
  }

  readonly select = (item: IComboBoxItem) => {
    this.selectedItem.set(item);
    this.formGroup().get(this.name())
      ?.setValue(item.value);
    this.hideDropdown();
    this.onValueChanged()(item);
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
    this.giveFocusTo(this.combo());
  };

  readonly onBlur = (event: FocusEvent) => {
    const newTarget = event.relatedTarget as HTMLElement;
    const newTargetParent = newTarget?.parentElement;
    if (newTargetParent?.id !== this.containerId() && newTargetParent?.parentElement?.id !== this.containerId()
      && newTarget?.id !== this.id() && newTarget?.id !== this.buttonId() && newTarget?.id !== this.containerId()) {
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

  readonly onOptionKey = (item: IComboBoxItem, event: KeyboardEvent, index: number) => {
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

  private readonly giveFocusTo = (element: ElementRef | undefined) => (element?.nativeElement as HTMLElement)?.focus();
  private readonly mainActionTriggeredBy = (event: KeyboardEvent) => isAction(event);
  private readonly cancelActionTriggeredBy = (event: KeyboardEvent) => event.key === 'Escape';
  private readonly previousElementFrom = (index: number) => this.options()[(index - 1 + this.options().length) % this.options().length];
  private readonly nextElementFrom = (index: number) => this.options()[(index + 1) % this.options().length];
  private readonly getSelectedOption = () => this.options().filter(option =>
    (option.nativeElement.lastChild as HTMLElement).getAttribute('value') === this.selectedItem()?.value)[0] ?? this.options()[0];
}
