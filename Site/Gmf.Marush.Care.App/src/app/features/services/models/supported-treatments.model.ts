/* eslint-disable @stylistic/max-len */
import supportedBrowsLashesTreatments from './treatments/brows-lashes.model';
import supportedCombinationTreatments from './treatments/combination-treatments.model';
import supportedFaceTreatments from './treatments/face-treatments.model';
import { IDefineTreatment } from './types.model';

const supportedTreatments = {
    face: supportedFaceTreatments,
    combination: supportedCombinationTreatments,
    browsLashes: supportedBrowsLashesTreatments
} as Record<string, IDefineTreatment[]>;

export default supportedTreatments;
