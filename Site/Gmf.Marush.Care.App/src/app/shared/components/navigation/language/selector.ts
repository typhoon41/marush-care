import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { isAction, OptionalKeyboardEvent } from '@shared/functions/keyboard-event';
import Language, { ILanguage } from '@shared/models/language';
import { ComboBox } from '../../forms/combobox/combobox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-language-selector',
  imports: [CommonModule, ComboBox],
  templateUrl: './selector.html',
  styleUrl: './selector.scss'
})
export class LanguageSelector {
  readonly horizontal = input<boolean>(false);
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  protected readonly index = computed(() => this.visible() ? 0 : -1);
  protected readonly language = new Language();
  protected readonly supportedLanguages: IComboBoxItem[];

  private readonly toItem = (language: ILanguage) => ({
    value: language.value,
    label: language.description
  } as IComboBoxItem);

  protected selectedLanguage: IComboBoxItem = this.toItem(this.language.default);

  constructor() {
    this.supportedLanguages = this.language.supportedLanguages.map(language => this.toItem(language));

    afterNextRender(() => {
      this.selectedLanguage = this.toItem(this.language.predefined());
    });
  }

  protected readonly select = (language: IComboBoxItem, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      const selectedLanguage = this.language.findByValue(language.value);
      this.language.changeTo(selectedLanguage);
    }
  };
}
