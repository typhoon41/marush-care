import { TreatmentDefinition } from '../treatment-definition';

/* eslint-disable @stylistic/max-len */
const supportedCombinationTreatments = [
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.violetta:Violeta tretman: Masaža lica + higijensko čišćenje + biološki tretman`,
        name: 'Violeta tretman: Masaža lica + higijensko čišćenje + biološki tretman',
        duration: 120,
        price: 7000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.ultra-micro:Ultrazvučno čišćenje + mikrodermoabrazija`,
        name: 'Ultrazvučno čišćenje + mikrodermoabrazija',
        duration: 90,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.ultra-micro-meso:Ultrazvučno čišćenje + mikrodermoabrazija + neinvazivna mezoterapija`,
        name: 'Ultrazvučno čišćenje + mikrodermoabrazija + neinvazivna mezoterapija',
        duration: 120,
        price: 8500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.hygiene-meso:Higijenski tretman + neinvazivna mezoterapija`,
        name: 'Higijenski tretman + neinvazivna mezoterapija',
        duration: 90,
        price: 8000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.micro-bio:Mikrodermoabrazija + biološki tretman`,
        name: 'Mikrodermoabrazija + biološki tretman',
        duration: 90,
        price: 4000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.micro-oxygen:Mikrodermoabrazija + tretman kiseonikom`,
        name: 'Mikrodermoabrazija + tretman kiseonikom',
        duration: 90,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.peel-vitamin-mask:Piling + vitaminska ampula + maska`,
        name: 'Piling + vitaminska ampula + maska',
        duration: 90,
        price: 3000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.massage-meso:Masaža lica + neinvazivna mezoterapija`,
        name: 'Masaža lica + neinvazivna mezoterapija',
        duration: 90,
        price: 6500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.massage-radio:Masaža lica + radiotalasni lifting`,
        name: 'Masaža lica + radiotalasni lifting',
        duration: 90,
        price: 5500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.massage-radio-bio:Lifting masaža lica + radiotalasni lifting + biološki tretman`,
        name: 'Lifting masaža lica + radiotalasni lifting + biološki tretman',
        duration: 80,
        price: 7000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.radio-combo:Radiotalasni lifting lica, vrata i dekoltea`,
        name: 'Radiotalasni lifting lica, vrata i dekoltea',
        duration: 90,
        price: 6000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.massage-radio-combo:Masaža lica, vrata i dekoltea + radiotalasni lifting`,
        name: 'Masaža lica, vrata i dekoltea + radiotalasni lifting',
        duration: 90,
        price: 7500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.massage-radio-bio-combo:Masaža lica, vrata i dekoltea + radiotalasni lifting + biološki tretman`,
        name: 'Masaža lica, vrata i dekoltea + radiotalasni lifting + biološki tretman',
        duration: 90,
        price: 9000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.combination.glass-skin:Glass skin tretman: mikrodermoabrazija + PRXT33`,
        name: 'Glass skin tretman: mikrodermoabrazija + PRXT33',
        duration: 45,
        price: 9500
    })
];

export default supportedCombinationTreatments;
