import { InputSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export abstract class Field {
    abstract form: InputSignal<FormGroup>;
    abstract control: InputSignal<FormControl | undefined>;
    abstract name: InputSignal<string | number>;
    abstract validation: InputSignal<string[]>;

    // TODO: Once Angular supports adding Signals to Reactive Forms, remove getters from here and inherited classes
    get required() {
        return this.getFormState('required');
    }

    get resolvedControl(): FormControl {
        return (this.control() ?? (this.form().get(this.name() as string) as FormControl)) as FormControl;
    }

    protected readonly getFormState = (validation: string) => {
        const field = this.control() ?? this.form().get(this.name() as string);
        const hasValidation = this.validation().includes(validation);
        return hasValidation && field?.invalid && (field.dirty || field.touched) && !!field.errors?.[validation];
    };
}
