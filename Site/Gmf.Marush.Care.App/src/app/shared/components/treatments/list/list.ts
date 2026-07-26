import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-treatment-list',
    host: { class: 'treatment-list', '[class.hidden]': 'treatments().length === 0' },
    templateUrl: './list.html',
    styleUrl: './list.scss'
})
export class TreatmentList {
    readonly treatments = input.required<TreatmentDefinition[]>();
    readonly showPrices = input<boolean>(true);
    readonly remove = output<TreatmentDefinition>();

    protected readonly onRemove = (treatment: TreatmentDefinition) => {
        this.remove.emit(treatment);
    };
}
