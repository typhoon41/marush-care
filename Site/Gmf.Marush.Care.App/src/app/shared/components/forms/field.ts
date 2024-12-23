import { FormGroup } from '@angular/forms';

export abstract class Field {
    abstract form: FormGroup;
    abstract name: string;
    abstract validation: string[];

    // TODO: Once Angular supports adding Signals to Reactive Forms, remove getters from here and inherited classes
    get required() {
        return this.getFormState('required');
    }

    protected readonly getFormState = (validation: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const field = this.form.get(this.name)!;
        const hasValidation = this.validation.includes(validation);
        return hasValidation && field.invalid && (field.dirty || field.touched) && !!field.errors?.[validation];
    };
}
