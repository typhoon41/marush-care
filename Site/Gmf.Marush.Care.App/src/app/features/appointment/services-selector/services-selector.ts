import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, viewChildren } from '@angular/core';
import { ExpansionPanel } from '@shared/components/expansion-panel/expansion-panel';
import { CheckBox } from '@shared/components/forms/checkbox/checkbox';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-appointment-services-selector',
    imports: [CommonModule, ExpansionPanel, CheckBox],
    templateUrl: './services-selector.html',
    styleUrl: './services-selector.scss'
})
export class ServicesSelector {
    readonly checkedServices = input.required<TreatmentDefinition[]>();
    readonly toggleSelection = output<{ item: TreatmentDefinition; checked: boolean }>();
    readonly panels = viewChildren<ExpansionPanel>('panels');
    services = supportedTreatments;

    readonly collapseOpenedPanel = (indexToSkip: number) => {
        this.panels().filter(panel => panel.index() !== indexToSkip && panel.collapsed)
            .forEach(panel => {
                panel.collapsed.set(false);
            });
    };

    protected readonly onTreatmentChanged = (treatment: TreatmentDefinition) => ($event: Event) => this.onCheckboxChange(treatment, $event);

    private readonly onCheckboxChange = (item: TreatmentDefinition, event: Event) => {
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
