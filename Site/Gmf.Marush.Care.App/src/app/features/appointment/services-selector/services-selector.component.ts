import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import { CheckBoxComponent } from '@shared/components/forms/checkbox/checkbox.component';
import supportedTreatments from '@shared/models/services/supported-treatments.model';
import { IDefineTreatment } from '@shared/models/services/types.model';
import { MoneyPipe } from '@shared/pipes/money-pipe';

@Component({
    selector: 'marush-appointment-services-selector',
    imports: [CommonModule, ExpansionPanelComponent, CheckBoxComponent, MoneyPipe],
    templateUrl: './services-selector.component.html',
    styleUrl: './services-selector.component.scss'
})
export class ServicesSelectorComponent {
    @Input() checkedServices: IDefineTreatment[] = [];
    @Output() toggleSelection = new EventEmitter<{ item: IDefineTreatment; checked: boolean }>();
    @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;
    services = supportedTreatments;

    readonly collapseOpenedPanel = (indexToSkip: number) => {
        this.panels?.filter(panel => panel.index !== indexToSkip && panel.collapsed).forEach(panel => {
            panel.collapsed = false;
        });
    };

    readonly onTreatmentChanged = (treatment: IDefineTreatment) => ($event: Event) => this.onCheckboxChange(treatment, $event);

    readonly onCheckboxChange = (item: IDefineTreatment, event: Event) => {
        const checkbox = event.target as HTMLInputElement;
        const checked = checkbox.checked;
        const maxAllowed = 4;

        if (this.checkedServices.length >= maxAllowed && checked) {
            checkbox.checked = false;
            return;
        }

        this.toggleSelection.emit({ item, checked });
    };
}
