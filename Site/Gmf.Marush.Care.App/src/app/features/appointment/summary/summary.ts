import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TreatmentList } from '@shared/components/treatments/list/list';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { Money } from '@shared/pipes/money';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-appointment-summary',
    imports: [Money, TreatmentList],
    templateUrl: './summary.html',
    styleUrl: './summary.scss'
})
export class AppointmentSummary {
    readonly checkedServices = input.required<TreatmentDefinition[]>();
    readonly totalCost = input.required<number>();
    readonly removeSelection = output<TreatmentDefinition>();

    protected readonly onRemove = (item: TreatmentDefinition) => {
        this.removeSelection.emit(item);
    };
}
