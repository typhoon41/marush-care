import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Input({ required: true }) checkedServices!: TreatmentDefinition[];
    @Input({ required: true }) totalCost!: number;
    @Output() readonly removeSelection = new EventEmitter<TreatmentDefinition>();

    readonly onRemove = (item: TreatmentDefinition) => {
        this.removeSelection.emit(item);
    };
}
