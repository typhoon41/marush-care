/* eslint-disable max-lines */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { isAction } from '@shared/functions/keyboard-event';
import Language, { ILanguage } from '@shared/models/language.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'marush-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss'
})
export class LanguageSelectorComponent {
  language = new Language();
  collapsed = new BehaviorSubject<boolean>(false);

  @ViewChild('combo') combo: ElementRef | undefined;
  @ViewChildren('option') options: QueryList<ElementRef> | undefined;

  selectedLanguage: ILanguage;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.collapsed.subscribe(collapsed => {
      if (collapsed) {
        this.giveFocusTo(this.getSelectedOption());
      }
      else {
        this.giveFocusTo(this.combo);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.selectedLanguage = this.language.predefined();
    }

    else {
      this.selectedLanguage = this.language.default;
    }
  }

  readonly select = (language: ILanguage) => {
    this.selectedLanguage = language;
    this.language.changeTo(language);
  };

  readonly toggleDropdown = () => {
    this.collapsed.next(!this.collapsed.value);
  };

  readonly hideDropdown = () => {
    this.collapsed.next(false);
  };

  readonly onBlur = (event: FocusEvent) => {
    const clickedElement = event.relatedTarget as HTMLElement;
    const parentElement = clickedElement?.parentElement;

    if (parentElement?.id !== 'language-container' && clickedElement?.id !== 'language-selector') {
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

  readonly onOptionKey = (language: ILanguage, event: KeyboardEvent, index: number) => {
    event.preventDefault();
    if (this.mainActionTriggeredBy(event)) {
      event.stopImmediatePropagation();
      this.select(language);
      this.hideDropdown();
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
    option.nativeElement.dataset.value === this.selectedLanguage?.value)[0];

  private readonly giveFocusTo = (element: ElementRef | undefined) => (element?.nativeElement as HTMLElement)?.focus();
}
