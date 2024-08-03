import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import { CheckBoxComponent } from '@shared/components/forms/checkbox/checkbox.component';
import supportedTreatments from '@shared/models/services/supported-treatments.model';

@Component({
    selector: 'marush-appointment-services-selector',
    standalone: true,
    imports: [CommonModule, ExpansionPanelComponent, CheckBoxComponent],
    templateUrl: './services-selector.component.html',
    styleUrl: './services-selector.component.scss'
})
export class ServicesSelectorComponent {
    services = supportedTreatments;
    @ViewChildren('panels') panels: QueryList<ExpansionPanelComponent> | undefined;

    readonly collapseOpenedPanel = (indexToSkip: number) => {
        this.panels?.filter(panel => panel.index !== indexToSkip && panel.collapsed).forEach(panel => {
            panel.collapsed = false;
        });
    };
}
