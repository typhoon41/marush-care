import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { MoneyPipe } from '@shared/pipes/money-pipe';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-appointment-summary',
    imports: [ReactiveFormsModule, MoneyPipe],
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss'
})
export class AppointmentSummaryComponent {
    readonly checkedServices = input.required<TreatmentDefinition[]>();
    readonly totalCost = input.required<number>();
    readonly removeSelection = output<TreatmentDefinition>();

    readonly onRemove = (item: TreatmentDefinition) => {
        this.removeSelection.emit(item);
    };
}
