import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDefineTreatment } from '@shared/models/services/types.model';

@Component({
    selector: 'marush-appointment-summary',
    standalone: true,
    imports: [],
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss'
})
export class AppointmentSummaryComponent {
    @Input() checkedServices: IDefineTreatment[] = [];
    @Output() removeSelection = new EventEmitter<IDefineTreatment>();

    readonly onRemove = (item: IDefineTreatment) => {
        this.removeSelection.emit(item);
    };

    get totalCost() {
        return this.checkedServices.reduce((sum, { price }) => sum + price, 0);
    }
}
