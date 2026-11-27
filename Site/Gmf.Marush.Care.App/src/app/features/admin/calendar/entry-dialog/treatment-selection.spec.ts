/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder } from '@angular/forms';
import { TreatmentSelection } from './treatment-selection';

const retiredTreatment = 'Povučen tretman';
const selectionOf = (...names: string[]) => {
    const selection = new TreatmentSelection(TestBed.inject(NonNullableFormBuilder));
    names.forEach(name => selection.select({ value: name, label: name }));
    return selection;
};

describe('TreatmentSelection', () => {
    it('RULE-010 counts a treatment missing from the catalog as price 0 and duration 0', () => {
        const selection = selectionOf('Dermapen', retiredTreatment);

        expect(selection.priceTotal()).toBe(6500);
        expect(selection.definitions()[1]).toEqual(expect.objectContaining({
            title: retiredTreatment, name: retiredTreatment, price: 0, duration: 0
        }));
    });

    it('RULE-009 RULE-010 totals the catalog prices of the selected names', () => {
        expect(selectionOf('PRX T33 piling', 'Dermapen').priceTotal()).toBe(12500);
        expect(selectionOf('Klasičan higijenski tretman', 'Dermapen').priceTotal()).toBe(10000);
        expect(selectionOf().priceTotal()).toBe(0);
    });

    it('RULE-010 ignores selecting the same name twice', () => {
        const selection = selectionOf('Dermapen', 'Dermapen');

        expect(selection.selectedNames()).toEqual(['Dermapen']);
        expect(selection.priceTotal()).toBe(6500);
    });

    it('RULE-010 recomputes the total after a removal or a reset', () => {
        const selection = selectionOf('PRX T33 piling', 'Dermapen');

        selection.remove('Dermapen');
        expect(selection.priceTotal()).toBe(6000);

        selection.reset(['Klasičan higijenski tretman', retiredTreatment]);
        expect(selection.selectedNames()).toEqual(['Klasičan higijenski tretman', retiredTreatment]);
        expect(selection.priceTotal()).toBe(3500);
    });

    it('clears the search query after each selection', () => {
        const selection = selectionOf();
        selection.searchForm.controls.query.setValue('derm');

        selection.select({ value: 'Dermapen', label: 'Dermapen' });

        expect(selection.searchForm.controls.query.value).toBe('');
    });

    it('RULE-010 leaves already selected treatments out of the search results', async() => {
        const selection = selectionOf();
        const beforeSelection = await selection.search('dermapen');

        selection.select({ value: 'Dermapen', label: 'Dermapen' });
        const afterSelection = await selection.search('dermapen');

        expect(beforeSelection.map(item => item.value)).toEqual(['Dermapen']);
        expect(afterSelection).toEqual([]);
    });
});
