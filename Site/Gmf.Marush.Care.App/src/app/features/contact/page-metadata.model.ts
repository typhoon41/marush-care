/* eslint-disable @stylistic/max-len */
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';

export class ContactPageMetadata extends PageMetadata {
    override pathTranslations = () => { return { en: 'contact', sr: 'kontakt', ru: 'контакт' }; };
    override getTitle = () => $localize`:@@routes.contact.title:Marush: Space of Care - kontakt` as string;
    override getKeywords = () => $localize`:@@routes.contact.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,kombinacije tretmana,lifting,masaža,kontakt,centar,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.contact.description:Otkrijte oličenje lepote i opuštanja u Marush salonu. Smešten u srcu Beograda, naš salon nudi miran beg od užurbanog gradskog života.` as string;

    override getSpecificStructuredData = (baseStructuredData: IStructuredData, _language: ILanguage) => {
        const salonEntity = this.getGraphFrom(baseStructuredData)[0] as Record<string, unknown>;
        salonEntity['geo'] = {
            '@type': 'GeoCoordinates',
            latitude: '44.8007025',
            longitude: '20.4560413'
        };
        salonEntity['hasMap'] = 'https://www.google.com/maps/place/44.800722,20.455944';
        salonEntity['containedInPlace'] = {
            '@type': 'Place',
            name: 'Belgrade',
            alternateName: ['Beograd', 'Белград'],
            address: this.address()
        };

        return baseStructuredData;
    };
}
