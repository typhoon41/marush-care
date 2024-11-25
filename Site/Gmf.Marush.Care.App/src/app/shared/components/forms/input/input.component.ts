import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Field } from '../field';

@Component({
    selector: 'marush-input',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent extends Field {
    @Input() form!: FormGroup;
    @Input() name = '';
    @Input() placeholder = '';
    @Input() autoComplete = false;
    @Input() customValidation = '';
    @Input() validation: string[] = [];
    @Input() customValidationMessage = '';

    get maxLength() {
        return this.getFormState('maxlength');
    }

    get email() {
        return this.getFormState('email');
    }

    get custom() {
        return this.getFormState(this.customValidation);
    }
}
