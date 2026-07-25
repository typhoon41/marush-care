import { ChangeDetectionStrategy, Component, ElementRef, computed, input, resource, signal, viewChild, viewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isAction } from '@shared/functions/keyboard-event';
import { IComboBoxItem } from '../combobox/item';
import { Field } from '../field';

@Component({
  selector: 'marush-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'autocomplete' },
  imports: [ReactiveFormsModule],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss'
})
export class Autocomplete extends Field {
  private static readonly debounceMilliseconds = 300;
  private static readonly defaultMinimumQueryLength = 2;
  readonly form = input.required<FormGroup>();
  readonly control = input<FormControl | undefined>(undefined);
  readonly name = input<string | number>('');
  readonly validation = input<string[]>([]);
  readonly id = input<string>('autocomplete');
  readonly placeholder = input<string>('');
  readonly search = input.required<(query: string) => Promise<IComboBoxItem[]>>();
  readonly minimumQueryLength = input<number>(Autocomplete.defaultMinimumQueryLength);
  readonly onSelected = input<((item: IComboBoxItem) => void) | undefined>(undefined);
  readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');
  readonly suggestionElements = viewChildren<ElementRef<HTMLLIElement>>('suggestion');
  private readonly query = signal('');
  private readonly dismissed = signal(false);
  private debounceTimeout?: ReturnType<typeof setTimeout>;

  private readonly searchResource = resource({
    params: () => {
      const query = this.query();
      return query.length < this.minimumQueryLength() ? undefined : query;
    },
    loader: ({ params }) => this.search()(params)
  });

  protected readonly suggestions = computed(() => this.searchResource.hasValue() ? this.searchResource.value() : []);
  protected readonly isOpen = computed(() => !this.dismissed() && this.suggestions().length > 0);

  get maxLength() {
    return this.getFormState('maxlength');
  }

  protected readonly containerId = () => `${this.id()}-suggestions`;

  protected readonly select = (item: IComboBoxItem) => {
    clearTimeout(this.debounceTimeout);
    this.closeSuggestions();
    this.resolvedControl.setValue(item.label);
    this.onSelected()?.(item);
    this.inputElement()?.nativeElement.focus();
  };

  protected readonly onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.dismissed.set(false);
      this.query.set(value);
    }, Autocomplete.debounceMilliseconds);
  };

  protected readonly onInputKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' && this.isOpen()) {
      event.preventDefault();
      this.suggestionElements()[0]?.nativeElement.focus();
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  };

  protected readonly onSuggestionKey = (item: IComboBoxItem, event: KeyboardEvent, index: number) => {
    event.preventDefault();
    if (isAction(event)) {
      event.stopImmediatePropagation();
      this.select(item);
    } else if (event.key === 'ArrowUp') {
      if (index === 0) {
        this.inputElement()?.nativeElement.focus();
      } else {
        this.suggestionElements()[index - 1]?.nativeElement.focus();
      }
    } else if (event.key === 'ArrowDown') {
      this.suggestionElements()[(index + 1) % this.suggestionElements().length]?.nativeElement.focus();
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
      this.inputElement()?.nativeElement.focus();
    }
  };

  protected readonly onInputBlur = (event: FocusEvent) => {
    if (!this.isSuggestionElement(event.relatedTarget as HTMLElement)) {
      this.closeSuggestions();
    }
  };

  protected readonly onSuggestionBlur = (event: FocusEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget !== this.inputElement()?.nativeElement && !this.isSuggestionElement(relatedTarget)) {
      this.closeSuggestions();
    }
  };

  private readonly isSuggestionElement = (element: HTMLElement | null) =>
    this.suggestionElements().some(ref => ref.nativeElement === element);

  private readonly closeSuggestions = () => this.dismissed.set(true);
}
