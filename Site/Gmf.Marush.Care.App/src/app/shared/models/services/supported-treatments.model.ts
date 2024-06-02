/* eslint-disable @stylistic/max-len */
import supportedBrowsLashesTreatments from './treatments/brows-lashes.model';
import supportedCombinationTreatments from './treatments/combination-treatments.model';
import supportedFaceTreatments from './treatments/face-treatments.model';
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
    }
] as IDefineTreatmentGroup[];

export default supportedTreatments;
