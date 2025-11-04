import { TreatmentDefinition } from './treatment-definition';

export type SelectedService = 'face' | 'combination' | 'browsLashes' | 'body' | '';

export interface IDefineTreatmentGroup {
    key: SelectedService;
    title: string;
    image: string;
    imageDescription: string;
    treatments: TreatmentDefinition[];
}
