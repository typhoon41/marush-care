import { TreatmentDefinition } from '../treatment-definition';

const supportedBodyTreatments = [
    new TreatmentDefinition({
        title: $localize`:@@treatments.body.hygiene.whole-back:Higijensko čišćenje celih leđa`,
        name: 'Higijensko čišćenje celih leđa',
        duration: 60,
        price: 6000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.body.hygiene.half-back:Higijensko čišćenje pola leđa`,
        name: 'Higijensko čišćenje pola leđa',
        duration: 60,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.body.cellulite.massage:Anticelulit masaža nogu i gluteusa`,
        name: 'Anticelulit masaža nogu i gluteusa',
        duration: 30,
        price: 3000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.body.cellulite.vacuslim:Vacuslim 48 sa anticelulit masažom (noge, gluteus i stomak)`,
        name: 'Vacuslim 48 sa anticelulit masažom (noge, gluteus i stomak)',
        duration: 60,
        price: 4000
    })];
export default supportedBodyTreatments;
