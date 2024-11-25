import supportedBodyTreatments from './treatments/body-treatments.model';
import supportedBrowsLashesTreatments from './treatments/brows-lashes.model';
import supportedCombinationTreatments from './treatments/combination-treatments.model';
import supportedFaceMassages from './treatments/face-massage.model';
import supportedFaceTreatments from './treatments/face-treatments.model';
import supportedWaxing from './treatments/waxing.model';
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
        title: $localize`:@@services.massage.title:Masaža lica`,
        image: 'treatments-massage',
        imageDescription: $localize`:@@services.massage.image-description:Žena uživa u masaži lica`,
        treatments: supportedFaceMassages
    }
] as IDefineTreatmentGroup[];

export default supportedTreatments;
