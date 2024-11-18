import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'marush-input',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent {
    @Input() form!: FormGroup;
    @Input() name = '';
    @Input() placeholder = '';
    @Input() customValidation = '';
    @Input() validation: string[] = [];
    @Input() customValidationMessage = '';

    get required() {
        return this.getFormState('required');
    }

    get maxLength() {
        return this.getFormState('maxlength');
    }

    get email() {
        return this.getFormState('email');
    }

    get custom() {
        return this.getFormState(this.customValidation);
    }

    private readonly getFormState = (validation: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const field = this.form.get(this.name)!;
        const hasValidation = this.validation.includes(validation);
        return hasValidation && field.invalid && (field.dirty || field.touched) && !!field.errors?.[validation];
    };
}
