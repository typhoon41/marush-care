import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IDefineTreatment } from '@shared/models/services/types.model';

@Component({
    selector: 'marush-appointment-summary',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss'
})
export class AppointmentSummaryComponent {
    @Input() checkedServices: IDefineTreatment[] = [];
    @Input() totalCost: number = 0;
    @Output() removeSelection = new EventEmitter<IDefineTreatment>();

    readonly onRemove = (item: IDefineTreatment) => {
        this.removeSelection.emit(item);
    };
}
