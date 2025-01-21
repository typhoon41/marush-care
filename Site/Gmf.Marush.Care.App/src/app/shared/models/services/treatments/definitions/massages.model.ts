/* eslint-disable max-lines, @stylistic/max-len */
import { TreatmentDefinition } from '../treatment-definition';

const supportedMassages = [
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.basic:Opšta masaža lica`,
        name: 'Opšta masaža lica',
        duration: 60,
        price: 2500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.face-gym:Face gym`,
        description: $localize`:@@treatments.massages.face-gym.description:Intenzivna masaža preoblikovanja lica.`,
        name: 'Face gym',
        duration: 60,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.lotos-face-gym:Lotos face gym`,
        description: $localize`:@@treatments.massages.lotos-face-gym.description:Intenzivna masaža lica, vrata, dekoltea, skalpa i ruku.`,
        name: 'Lotos face gym',
        duration: 90,
        price: 8000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.premium-face-gym:Premium face gym`,
        description: $localize`:@@treatments.massages.premium-face-gym.description:Intenzivna masaža lica, vrata, dekoltea, skalpa, ruku i stopala.`,
        name: 'Premium face gym',
        duration: 110,
        price: 10000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.relax:Relaks masaža`,
        name: 'Relaks masaža (45 minuta)',
        duration: 45,
        showDuration: true,
        clone: true,
        price: 2900
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.relax:Relaks masaža`,
        description: $localize`:@@treatments.massages.relax.description:Opuštajuća masaža koja će ti izvući svu napetost iz tela i ostaviti te potpuno opuštenom i podmlađenom.`,
        name: 'Relaks masaža (60 minuta)',
        duration: 60,
        rangedDuration: '45 - 90',
        showDuration: true,
        price: 3500,
        rangedPrice: '2.900 - 4.500'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.relax:Relaks masaža`,
        name: 'Relaks masaža (90 minuta)',
        duration: 90,
        showDuration: true,
        clone: true,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.aroma:Aromaterapija`,
        name: 'Aromaterapija (60 minuta)',
        duration: 60,
        showDuration: true,
        clone: true,
        price: 3900
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.aroma:Aromaterapija`,
        name: 'Aromaterapija (90 minuta)',
        description: $localize`:@@treatments.massages.aroma.description:Aromaterapija je holistički tretman koji koristi aromatična eterična ulja korisna za unapređenje zdravlja i opšteg blagostanja organizma.`,
        duration: 90,
        rangedDuration: '60 - 90',
        showDuration: true,
        price: 4900,
        rangedPrice: '3.900 - 4.900'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.tissue:Masaža dubokih tkiva`,
        name: 'Masaža dubokih tkiva (45 minuta)',
        duration: 45,
        showDuration: true,
        clone: true,
        price: 3200
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.tissue:Masaža dubokih tkiva`,
        name: 'Masaža dubokih tkiva (60 minuta)',
        duration: 60,
        showDuration: true,
        clone: true,
        price: 3900
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.tissue:Masaža dubokih tkiva`,
        name: 'Aromaterapija (90 minuta)',
        description: $localize`:@@treatments.massages.tissue.description:Dubinska masaža cilja na duboke slojeve mišića i vezivnog tkiva kako bi ti obezbedila olakšanje od hroničnog bola i mišićne napetosti.`,
        duration: 90,
        rangedDuration: '45 - 90',
        showDuration: true,
        price: 4900,
        rangedPrice: '3.200 - 4.900'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.therapy:Terapeutska masaža`,
        name: 'Terapeutska masaža (30 minuta)',
        duration: 30,
        showDuration: true,
        clone: true,
        price: 3200
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.therapy:Terapeutska masaža`,
        name: 'Terapeutska masaža (45 minuta)',
        description: $localize`:@@treatments.massages.therapy.description:Terapeutska masaža primenjuje jak pritisak kako bi ti podstakla opuštanje, poboljšala cirkulaciju i ubrzala oporavak mišića.`,
        duration: 45,
        rangedDuration: '30 - 45',
        showDuration: true,
        price: 3900,
        rangedPrice: '3.200 - 3.900'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.anti-stress:Antistres masaža`,
        name: 'Antistres masaža (60 minuta)',
        duration: 60,
        showDuration: true,
        clone: true,
        price: 3500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.anti-stress:Antistres masaža`,
        name: 'Antistres masaža (90 minuta)',
        description: $localize`:@@treatments.massages.anti-stress.description:Antistres masaža je umirujući tretman koji koristi nežne, duge pokrete kako bi ti ublažio napetost i podstakao opuštanje.`,
        duration: 90,
        rangedDuration: '60 - 90',
        showDuration: true,
        price: 4500,
        rangedPrice: '3.500 - 4.500'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.candle:Masaža svećama`,
        name: 'Masaža svećama (60 minuta)',
        duration: 60,
        showDuration: true,
        clone: true,
        price: 3900
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.candle:Masaža svećama`,
        name: 'Masaža svećama (90 minuta)',
        description: $localize`:@@treatments.massages.candle.description:Masaža aromatičnim svećama je tu da ti poboljša celokupno iskustvo stvaranjem opuštajuće atmosfere i promovišući osećaj smirenosti.`,
        duration: 90,
        rangedDuration: '60 - 90',
        showDuration: true,
        price: 4900,
        rangedPrice: '3.900 - 4.900'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.lymph:Limfna drenaža`,
        name: 'Limfna drenaža (60 minuta)',
        duration: 60,
        showDuration: true,
        clone: true,
        price: 3500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.lymph:Limfna drenaža`,
        name: 'Limfna drenaža (90 minuta)',
        description: $localize`:@@treatments.massages.lymph.description:Nežna masažna tehnika koja stimuliše protok limfe, pomaže u detoksikaciji i podstiče opuštanje.`,
        duration: 90,
        rangedDuration: '60 - 90',
        showDuration: true,
        price: 4500,
        rangedPrice: '3.500 - 4.500'
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.cellulite:Anticelulit masaža`,
        name: 'Anticelulit masaža (45 minuta)',
        description: $localize`:@@treatments.massages.cellulite.description:Anticelulit masaža cilja na celulit tako što će ti poboljšati protok krvi, razložiti masti i stimulisati tvoj limfni sistem.`,
        duration: 45,
        showDuration: true,
        price: 3000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.massages.cellulite:Anticelulit masaža` + $localize`:@@treatments.package.ten: - 10 tretmana`,
        name: 'Anticelulit masaža (45 minuta) - 10 tretmana',
        duration: 45,
        showDuration: true,
        clone: true,
        price: 26000
    })
];
export default supportedMassages;
