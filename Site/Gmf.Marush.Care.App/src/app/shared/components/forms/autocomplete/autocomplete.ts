import { ChangeDetectionStrategy, Component, ElementRef, computed, input, resource, signal, viewChild, viewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IComboBoxItem } from '../combobox/item';
import { Field } from '../field';
import { commitOrClear } from './suggestion-commitment';
import { SuggestionNavigation } from './suggestion-navigation';

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
  readonly onDismissed = input<(() => void) | undefined>(undefined);
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
    this.applySelection(item);
    this.inputElement()?.nativeElement.focus();
  };

  protected readonly navigation = new SuggestionNavigation(
    this.inputElement, this.suggestionElements, item => this.select(item), () => this.closeSuggestions());

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

  protected readonly onInputBlur = (event: FocusEvent) => {
    if (!this.navigation.isSuggestionElement(event.relatedTarget as HTMLElement)) {
      this.leaveField();
    }
  };

  protected readonly onSuggestionBlur = (event: FocusEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget !== this.inputElement()?.nativeElement && !this.navigation.isSuggestionElement(relatedTarget)) {
      this.leaveField();
    }
  };

  private readonly applySelection = (item: IComboBoxItem) => {
    clearTimeout(this.debounceTimeout);
    this.closeSuggestions();
    this.resolvedControl.setValue(item.label);
    this.resolvedControl.markAsPristine();
    this.onSelected()?.(item);
  };

  private readonly leaveField = () => {
    clearTimeout(this.debounceTimeout);
    this.closeSuggestions();
    commitOrClear(this.resolvedControl, this.suggestions(), this.applySelection);
    this.onDismissed()?.();
  };

  private readonly closeSuggestions = () => this.dismissed.set(true);
}
