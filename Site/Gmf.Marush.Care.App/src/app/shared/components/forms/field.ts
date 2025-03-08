import { InputSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class Field {
    abstract form: InputSignal<FormGroup>;
    abstract name: InputSignal<string>;
    abstract validation: InputSignal<string[]>;

    // TODO: Once Angular supports adding Signals to Reactive Forms, remove getters from here and inherited classes
    get required() {
        return this.getFormState('required');
    }

    protected readonly getFormState = (validation: string) => {
        const field = this.form().get(this.name());
        const hasValidation = this.validation().includes(validation);
        return hasValidation && field?.invalid && (field.dirty || field.touched) && !!field.errors?.[validation];
    };
}
