/* eslint-disable @stylistic/max-len */
import { IStructuredData } from '@shared/components/page/base/page-metadata.model';
import { ServicesMetadata } from '@shared/components/page/base/services-metadata.model';
import { ILanguage } from '@shared/models/language.model';

export class ServicesPageMetadata extends ServicesMetadata {
    override pathTranslations = () => { return { en: 'services', sr: 'usluge', ru: 'услуги' }; };
    override getTitle = () => $localize`:@@routes.services.title:Marush: Space of Care - usluge` as string;
    override getKeywords = () => $localize`:@@routes.services.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,obrve,trepavice,masaža,kombinacije tretmana,higijensko čišćenje lica,mezoterapija,dermapen,hijaluron pen,piling,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.services.description:Kozmetički salon Marush nudi usluge tretmana lica, sređivanja obrva i trepavica, kao i kombinacije tretmana. Pregled kože lica i konsultacije su besplatni.` as string;

    override getSpecificStructuredData = (baseStructuredData: IStructuredData, _language: ILanguage) =>
        this.addDefaultServices(baseStructuredData, $localize`:@@routes.services:usluge`);
}
