import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Field } from '../field';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-input',
    imports: [ReactiveFormsModule],
    templateUrl: './input.html',
    styleUrl: './input.scss'
})
export class Input extends Field {
    readonly form = input.required<FormGroup>();
    readonly name = input<string>('');
    readonly type = input<string>('text');
    readonly big = input<boolean>(false);
    readonly placeholder = input<string>('');
    readonly autoComplete = input<boolean>(false);
    readonly customValidation = input<string>('');
    readonly customValidationMessage = input<string>('');
    readonly validation = input<string[]>([]);

    get maxLength() {
        return this.getFormState('maxlength');
    }

    get email() {
        return this.getFormState('email');
    }

    get custom() {
        return this.getFormState(this.customValidation());
    }
}
