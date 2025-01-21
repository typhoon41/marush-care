import supportedBodyTreatments from './definitions/body-treatments.model';
import supportedBrowsLashesTreatments from './definitions/brows-lashes.model';
import supportedCombinationTreatments from './definitions/combination-treatments.model';
import supportedFaceTreatments from './definitions/face-treatments.model';
import supportedMassages from './definitions/massages.model';
import supportedWaxing from './definitions/waxing.model';
import { IDefineTreatmentGroup } from './types.model';

const supportedTreatments = [
    {
        key: 'face',
        title: $localize`:@@services.treatments.title:Tretmani Lica`,
        image: 'treatments-face',
        imageDescription: $localize`:@@services.treatments.image-description:Žena uživa u tretmanu lica`,
        treatments: supportedFaceTreatments
    },
    {
        key: 'combination',
        title: $localize`:@@services.treatments-combination.title:Kombinacije Tretmana`,
        image: 'treatments-combination',
        imageDescription: $localize`:@@services.treatments-combination.image-description:Kozmetički preparati za negu lica`,
        treatments: supportedCombinationTreatments
    },
    {
        key: 'browsLashes',
        title: $localize`:@@services.brows-lashes.title:Obrve i Trepavice`,
        image: 'brows-lashes',
        imageDescription: $localize`:@@services.brows-lashes.image-description:Obrva i trepavica žene koja žmuri`,
        treatments: supportedBrowsLashesTreatments
    },
    {
        key: 'waxing',
        title: $localize`:@@services.waxing.title:Depilacija`,
        image: 'treatments-waxing',
        imageDescription: $localize`:@@services.waxing.image-description:Priprema voska za depilaciju`,
        treatments: supportedWaxing
    },
    {
        key: 'body',
        title: $localize`:@@services.body.title:Tretmani tela`,
        image: 'treatments-body',
        imageDescription: $localize`:@@services.body.image-description:Tretman tela`,
        treatments: supportedBodyTreatments
    },
    // {
    //     Key: 'manicurePedicure',
    //     Title: $localize`:@@services.manicure-pedicure.title:Manikir i Pedikir`,
    //     Image: 'manicure-pedicure',
    //     ImageDescription: $localize`:@@services.manicure-pedicure.image-description:Pedikirana ženska stopala`,
    //     Treatments: supportedManicurePedicure
    // },
    {
        key: 'massage',
        title: $localize`:@@services.massage.title:Masaže`,
        image: 'treatments-massage',
        imageDescription: $localize`:@@services.massage.image-description:Žena uživa u masaži lica`,
        treatments: supportedMassages
    }
] as IDefineTreatmentGroup[];

export default supportedTreatments;
