import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef,
  ElementRef, inject, input, model, viewChild, viewChildren
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isAction, isCancel } from '@shared/functions/keyboard-event';
import { ComboBoxDropdown } from './combobox-dropdown';
import { IComboBoxItem } from './item';

@Component({
  selector: 'marush-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './combobox.html',
  styleUrl: './combobox.scss'
})
export class ComboBox {
  readonly formGroup = input<FormGroup>(new FormGroup({}));
  readonly items = input.required<IComboBoxItem[]>();
  readonly selectedItem = model<IComboBoxItem | undefined>();
  readonly name = input<string>('combo-box');
  readonly id = input<string>('combo-box');
  readonly placeholder = input<string>('');
  readonly autoComplete = input<boolean>(false);
  readonly combo = viewChild<ElementRef<HTMLElement>>('combo');
  readonly options = viewChildren<ElementRef<HTMLLIElement>>('option');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  readonly onValueChanged = input<(item: IComboBoxItem) => void>(() => { });

  protected readonly dropdown = new ComboBoxDropdown(
    inject(ElementRef<HTMLElement>).nativeElement, this.options, () => this.cdr.detectChanges());

  constructor(private readonly cdr: ChangeDetectorRef) {
    inject(DestroyRef).onDestroy(this.dropdown.release);
  }

  protected readonly containerId = () => `${this.id()}-container`;
  protected readonly buttonId = () => `${this.id()}-button`;

  get invalid() {
    const control = this.formGroup().get(this.name());
    return control?.invalid && (control?.touched || control?.dirty);
  }

  protected readonly select = (item: IComboBoxItem) => {
    this.selectedItem.set(item);
    this.formGroup().get(this.name())
      ?.setValue(item.value);
    this.hideDropdown();
    this.onValueChanged()(item);
  };

  protected readonly toggleDropdown = () => {
    if (this.dropdown.expanded) {
      this.hideDropdown();
      return;
    }

    this.dropdown.expand();
    this.cdr.detectChanges();
    this.dropdown.focusSelected(this.selectedItem()?.value);
  };

  protected readonly hideDropdown = () => {
    this.dropdown.collapse();
    this.combo()?.nativeElement.focus();
  };

  protected readonly onBlur = (event: FocusEvent) => {
    const newTarget = event.relatedTarget as HTMLElement;
    // Touch browsers report no related target right after focus moves into the dropdown,
    // Which used to collapse it before the tap landed. Taps outside close it instead.
    if (newTarget && !this.dropdown.holdsFocusOn(newTarget, [this.id(), this.buttonId(), this.containerId()])) {
      this.hideDropdown();
    }
  };

  protected readonly onKey = (event: KeyboardEvent) => {
    if (isAction(event)) {
      event.preventDefault();
      this.toggleDropdown();
    } else if (isCancel(event)) {
      this.dismissDropdown(event);
    }
  };

  protected readonly onOptionsKey = (event: KeyboardEvent) => {
    if (isCancel(event)) {
      this.dismissDropdown(event);
    }
  };

  protected readonly onOptionKey = (item: IComboBoxItem, event: KeyboardEvent, index: number) => {
    event.preventDefault();
    if (isAction(event)) {
      event.stopImmediatePropagation();
      this.select(item);
    } else if (event.key === 'ArrowUp') {
      this.dropdown.focusPrevious(index);
    } else if (event.key === 'ArrowDown') {
      this.dropdown.focusNext(index);
    }
  };

  private readonly dismissDropdown = (event: KeyboardEvent) => {
    if (!this.dropdown.expanded) {
      return;
    }

    event.preventDefault();
    this.hideDropdown();
  };
}
