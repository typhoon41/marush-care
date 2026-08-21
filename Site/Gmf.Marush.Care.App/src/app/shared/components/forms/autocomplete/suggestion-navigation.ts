import { ElementRef, Signal } from '@angular/core';
import { isAction, isCancel } from '@shared/functions/keyboard-event';
import { IComboBoxItem } from '../combobox/item';

export class SuggestionNavigation {
    constructor(
        private readonly inputElement: Signal<ElementRef<HTMLInputElement> | undefined>,
        private readonly suggestionElements: Signal<readonly ElementRef<HTMLLIElement>[]>,
        private readonly select: (item: IComboBoxItem) => void,
        private readonly close: () => void) { }

    readonly onKey = (item: IComboBoxItem, event: KeyboardEvent, index: number) => {
        if (isAction(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.select(item);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const previous = index === 0 ? this.inputElement() : this.suggestionElements()[index - 1];
            previous?.nativeElement.focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.suggestionElements()[(index + 1) % this.suggestionElements().length]?.nativeElement.focus();
        } else if (isCancel(event)) {
            event.preventDefault();
            this.close();
            this.inputElement()?.nativeElement.focus();
        }
    };

    readonly isSuggestionElement = (element: HTMLElement | null) =>
        this.suggestionElements().some(reference => reference.nativeElement === element);
}
