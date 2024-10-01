import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { IComboBoxItem } from '@shared/components/forms/combobox/combobox.model';
import { isAction, OptionalKeyboardEvent } from '@shared/functions/keyboard-event';
import Language, { ILanguage } from '@shared/models/language.model';
import { ComboBoxComponent } from '../../forms/combobox/combobox.component';

@Component({
  selector: 'marush-language-selector',
  standalone: true,
  imports: [CommonModule, ComboBoxComponent],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss'
})
export class LanguageSelectorComponent {
  @Input() horizontal = false;
  readonly language = new Language();
  readonly supportedLanguages: IComboBoxItem[];
  selectedLanguage: IComboBoxItem;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.supportedLanguages = this.language.supportedLanguages.map(language => this.toItem(language));

    if (isPlatformBrowser(this.platformId)) {
      this.selectedLanguage = this.toItem(this.language.predefined());
    }

    else {
      this.selectedLanguage = this.toItem(this.language.default);
    }
  }

  readonly select = (language: IComboBoxItem, event?: OptionalKeyboardEvent) => {
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
