import { TreatmentDefinition } from './treatment-definition';

export type SelectedService = 'face' | 'combination' | 'browsLashes' | 'waxing' | 'body' | 'manicurePedicure' | 'faceMassage' | '';

export interface IDefineTreatmentGroup {
    key: SelectedService;
    title: string;
    image: string;
    imageDescription: string;
    treatments: TreatmentDefinition[];
}
