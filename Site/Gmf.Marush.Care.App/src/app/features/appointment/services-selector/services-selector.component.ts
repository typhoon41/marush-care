import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output, viewChildren } from '@angular/core';
import { ExpansionPanelComponent } from '@shared/components/expansion-panel/expansion-panel.component';
import { CheckBoxComponent } from '@shared/components/forms/checkbox/checkbox.component';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments.model';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-appointment-services-selector',
    imports: [CommonModule, ExpansionPanelComponent, CheckBoxComponent],
    templateUrl: './services-selector.component.html',
    styleUrl: './services-selector.component.scss'
})
export class ServicesSelectorComponent {
    readonly checkedServices = input.required<TreatmentDefinition[]>();
    @Output() readonly toggleSelection = new EventEmitter<{ item: TreatmentDefinition; checked: boolean }>();
    readonly panels = viewChildren<ExpansionPanelComponent>('panels');
    services = supportedTreatments;

    readonly collapseOpenedPanel = (indexToSkip: number) => {
        this.panels().filter(panel => panel.index() !== indexToSkip && panel.collapsed)
        .forEach(panel => {
            panel.collapsed.set(false);
        });
    };

    readonly onTreatmentChanged = (treatment: TreatmentDefinition) => ($event: Event) => this.onCheckboxChange(treatment, $event);

    readonly onCheckboxChange = (item: TreatmentDefinition, event: Event) => {
        const checkbox = event.target as HTMLInputElement;
        const checked = checkbox.checked;
        const maxAllowed = 4;

        if (this.checkedServices().length >= maxAllowed && checked) {
            checkbox.checked = false;
            return;
        }

        this.toggleSelection.emit({ item, checked });
    };
}
