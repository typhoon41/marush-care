import { Signal } from '@angular/core';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import supportedTreatments from '@shared/models/services/treatments/supported-treatments';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

const catalog: TreatmentDefinition[] = supportedTreatments
    .flatMap(group => group.treatments)
    .filter(treatment => !treatment.clone);

/** Look-ups over the treatment catalogue the calendar offers. */
export class TreatmentCatalog {
    static findByName = (name: string): TreatmentDefinition | undefined => catalog.find(treatment => treatment.name === name);

    static titleOf = (name: string): string => TreatmentCatalog.findByName(name)?.title ?? name;

    static searchExcluding = (selectedTreatments: Signal<string[]>): (query: string) => Promise<IComboBoxItem[]> => (query: string) => {
            const normalizedQuery = query.toLowerCase();
            return Promise.resolve(catalog
                .filter(treatment => !selectedTreatments().includes(treatment.name) &&
                    (treatment.name.toLowerCase().includes(normalizedQuery) ||
                        treatment.title.toLowerCase().includes(normalizedQuery)))
                .map(treatment => ({ value: treatment.name, label: treatment.titleWithDuration() })));
        };
}
