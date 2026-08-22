import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

export type SearchForm = FormGroup<{ query: FormControl<string> }>;

export const buildSearchForm = (formBuilder: NonNullableFormBuilder): SearchForm =>
    formBuilder.group({
        query: new FormControl('', { nonNullable: true, updateOn: 'change' })
    });
