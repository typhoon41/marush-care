import supportedBodyTreatments from './definitions/body-treatments';
import supportedBrowsLashesTreatments from './definitions/brows-lashes';
import supportedCombinationTreatments from './definitions/combination-treatments';
import supportedFaceTreatments from './definitions/face-treatments';
import supportedWaxing from './definitions/waxing';
import { IDefineTreatmentGroup } from './types';

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
    }
] as IDefineTreatmentGroup[];

export default supportedTreatments;
