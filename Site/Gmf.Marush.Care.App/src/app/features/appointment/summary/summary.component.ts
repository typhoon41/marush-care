import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IDefineTreatment } from '@shared/models/services/types.model';
import { MoneyPipe } from '@shared/pipes/money-pipe';

@Component({
    selector: 'marush-appointment-summary',
    imports: [ReactiveFormsModule, MoneyPipe],
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss'
})
export class AppointmentSummaryComponent {
    @Input({ required: true }) checkedServices!: IDefineTreatment[];
    @Input({ required: true }) totalCost!: number;
    @Output() removeSelection = new EventEmitter<IDefineTreatment>();

    readonly onRemove = (item: IDefineTreatment) => {
        this.removeSelection.emit(item);
    };
}
