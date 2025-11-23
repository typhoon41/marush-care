import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-field-group',
    imports: [ReactiveFormsModule],
    templateUrl: './field-group.html',
    styleUrl: './field-group.scss'
})
export class FieldGroup {
    readonly addDynamicContent = input.required<() => void>();
    readonly title = input.required<string>();
    readonly formGroup = input.required<FormGroup>();
    readonly dynamicContentName = input.required<string>();
    readonly addOperationDescription = input<string>('');
}
