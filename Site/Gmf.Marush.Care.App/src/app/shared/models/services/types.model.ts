export type SelectedService = 'face' | 'combination' | 'browsLashes' | 'waxing' | 'body' | 'manicurePedicure' | 'faceMassage' | '';

export interface IDefineTreatmentGroup {
    key: SelectedService;
    title: string;
    image: string;
    imageDescription: string;
    treatments: IDefineTreatment[];
}

export interface IDefineTreatment {
    title: string;
    name: string;
    description?: string;
    duration: number;
    clone?: boolean;
    rangedPrice?: string;
    price: number;
}
