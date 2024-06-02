export type SelectedService = 'face' | 'combination' | 'browsLashes' | '';

export interface IDefineTreatmentGroup {
    key: SelectedService;
    title: string;
    image: string;
    imageDescription: string;
    treatments: IDefineTreatment[];
}

export interface IDefineTreatment {
    title: string;
    description: string;
    price: number;
}
