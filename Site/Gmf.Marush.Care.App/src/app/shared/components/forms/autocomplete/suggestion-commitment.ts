import { Signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IComboBoxItem } from '../combobox/item';

/**
 * Decides what a half-typed autocomplete query becomes when the field is left:
 * an exact suggestion is committed, anything else is discarded.
 */
export class SuggestionCommitment {
    constructor(
        private readonly currentControl: () => FormControl,
        private readonly suggestions: Signal<IComboBoxItem[]>,
        private readonly apply: (item: IComboBoxItem) => void) { }

    readonly settle = (): void => {
        const control = this.currentControl();
        if (!control.dirty) {
            return;
        }

        const match = this.matchFor(control.value);
        if (match) {
            this.apply(match);
            return;
        }

        control.setValue('');
        control.markAsPristine();
        control.markAsTouched();
    };

    private readonly matchFor = (value: unknown): IComboBoxItem | undefined => {
        const typed = `${value ?? ''}`.trim().toLowerCase();
        return this.suggestions().find(item => item.label.trim().toLowerCase() === typed);
    };
}
