import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, input, PLATFORM_ID } from '@angular/core';
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
  protected selectedLanguage: IComboBoxItem;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.supportedLanguages = this.language.supportedLanguages.map(language => this.toItem(language));

    if (isPlatformBrowser(this.platformId)) {
      this.selectedLanguage = this.toItem(this.language.predefined());
    }

    else {
      this.selectedLanguage = this.toItem(this.language.default);
    }
  }

  protected readonly select = (language: IComboBoxItem, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      const selectedLanguage = this.language.findByValue(language.value);
      this.language.changeTo(selectedLanguage);
    }
  };

  private readonly toItem = (language: ILanguage) => ({
    value: language.value,
    label: language.description
  } as IComboBoxItem);
}
