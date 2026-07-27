import { FormControl } from '@angular/forms';
import { IComboBoxItem } from '../combobox/item';

export const commitOrClear = (
    control: FormControl,
    suggestions: IComboBoxItem[],
    applySelection: (item: IComboBoxItem) => void): void => {
    if (!control.dirty) {
        return;
    }
    const value = `${control.value ?? ''}`.trim().toLowerCase();
    const match = suggestions.find(item => item.label.trim().toLowerCase() === value);
    if (match) {
        applySelection(match);
        return;
    }
    control.setValue('');
    control.markAsPristine();
    control.markAsTouched();
};
