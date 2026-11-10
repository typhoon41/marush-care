import { Signal, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder } from '@angular/forms';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { Clients } from '../../clients/clients';
import { EntryForm } from './entry-form';
import { SearchForm, buildSearchForm } from './search-form';

export class ClientSelection {
    readonly searchForm: SearchForm;
    readonly selectedItem = signal<IComboBoxItem | undefined>(undefined);
    readonly interacted = signal(false);
    private readonly queryValue: Signal<string | undefined>;

    constructor(
        formBuilder: NonNullableFormBuilder,
        private readonly clients: Clients,
        private readonly entryForm: EntryForm) {
        this.searchForm = buildSearchForm(formBuilder);
        this.queryValue = toSignal(this.searchForm.controls.query.valueChanges, { initialValue: '' });
        effect(() => {
            const query = this.queryValue();
            const selected = this.selectedItem();
            if (selected && query !== selected.label) {
                this.selectedItem.set(undefined);
                this.entryForm.patchValue({ customerId: '' });
            }
        });
    }

    readonly search = (query: string) => this.clients.searchByName(query);

    readonly select = (item: IComboBoxItem) => {
        this.selectedItem.set(item);
        this.entryForm.patchValue({ customerId: item.value });
    };

    readonly dismissed = () => this.interacted.set(true);

    readonly reset = (clientName?: string) => {
        this.searchForm.reset({ query: clientName ?? '' });
        this.selectedItem.set(undefined);
        this.interacted.set(false);
    };
}
