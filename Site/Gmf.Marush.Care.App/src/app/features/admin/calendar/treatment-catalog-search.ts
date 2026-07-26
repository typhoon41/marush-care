import { Signal } from '@angular/core';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

const treatmentCatalog: TreatmentDefinition[] = supportedTreatments
    .flatMap(group => group.treatments)
    .filter(treatment => !treatment.clone);

export const findTreatmentByName = (name: string): TreatmentDefinition | undefined =>
    treatmentCatalog.find(treatment => treatment.name === name);

export const treatmentLabel = (name: string): string =>
    findTreatmentByName(name)?.titleWithDuration() ?? name;

export const treatmentTitle = (name: string): string =>
    findTreatmentByName(name)?.title ?? name;

export const buildTreatmentSearch = (selectedTreatments: Signal<string[]>) =>
    (query: string): Promise<IComboBoxItem[]> => {
        const normalizedQuery = query.toLowerCase();
        return Promise.resolve(treatmentCatalog
            .filter(treatment => !selectedTreatments().includes(treatment.name) &&
                (treatment.name.toLowerCase().includes(normalizedQuery) ||
                    treatment.title.toLowerCase().includes(normalizedQuery)))
            .map(treatment => ({ value: treatment.name, label: treatment.titleWithDuration() })));
    };
