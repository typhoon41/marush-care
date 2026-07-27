import { computed, signal } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { buildTreatmentSearch, findTreatmentByName } from '../treatment-catalog-search';
import { IComboBoxItem, SearchForm, buildSearchForm } from './calendar-entry-form';

export class TreatmentSelection {
    readonly searchForm: SearchForm;
    readonly selectedNames = signal<string[]>([]);
    readonly search = buildTreatmentSearch(this.selectedNames);
    readonly definitions = computed(() =>
        this.selectedNames().map(name =>
            findTreatmentByName(name) ?? new TreatmentDefinition({ title: name, name, duration: 0, price: 0 })));

    readonly priceTotal = computed(() =>
        this.definitions().reduce((sum, { price }) => sum + price, 0));

    constructor(formBuilder: NonNullableFormBuilder) {
        this.searchForm = buildSearchForm(formBuilder);
    }

    readonly select = (item: IComboBoxItem) => {
        if (!this.selectedNames().includes(item.value)) {
            this.selectedNames.update(names => [...names, item.value]);
        }
        this.searchForm.reset();
    };

    readonly remove = (name: string) =>
        this.selectedNames.update(names => names.filter(existing => existing !== name));

    readonly reset = (names: string[]) => {
        this.selectedNames.set(names);
        this.searchForm.reset();
    };
}
