import { TreatmentDefinition } from '../treatment-definition';

const supportedWaxing = [
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.upper-lips:Depilacija nausnica`,
        name: 'Depilacija nausnica',
        duration: 15,
        price: 800
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.chin:Depilacija brade`,
        name: 'Depilacija brade',
        duration: 15,
        price: 800
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.sideburns:Depilacija zulufa`,
        name: 'Depilacija zulufa',
        duration: 15,
        price: 800
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.half-arms:Depilacija pola ruku`,
        name: 'Depilacija pola ruku',
        duration: 30,
        price: 700
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.full-arms:Depilacija celih ruku`,
        name: 'Depilacija celih ruku',
        duration: 30,
        price: 1000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.half-legs:Depilacija pola nogu`,
        name: 'Depilacija pola nogu',
        duration: 30,
        price: 1000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.full-legs:Depilacija celih nogu`,
        name: 'Depilacija celih nogu',
        duration: 45,
        price: 1500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.groin:Depilacija prepona`,
        name: 'Depilacija prepona',
        duration: 20,
        price: 1200
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.waxing.underarms:Depilacija pazuha`,
        name: 'Depilacija pazuha',
        duration: 15,
        price: 700
    })];
export default supportedWaxing;
